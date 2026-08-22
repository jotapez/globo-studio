'use client';

/**
 * ContactFooterV3 — contact footer with 3-mode interactive clocks (v3)
 *
 * Extends ContactFooterV2 with a third clock mode: shader (LiquidMetal).
 * Clicking the clock area cycles: shader → light → dark → shader.
 *
 * Figma: contact-footer section (1638:4135)
 *   Desktop  1638:4660  — 1728 × 1108 px, content 1664 px wide
 *   Tablet   1638:4661  — 1024 × 872 px,  content 960 px wide
 *   Mobile   1638:4732  — 393 × 686 px,   content 353 px wide
 *
 * Clocks (shader mode): ShaderClocksRow (Figma 1643:706)
 */

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { toZonedTime } from 'date-fns-tz';
import { LiquidMetal } from '@paper-design/shaders-react';
import { cn } from '@/lib/utils';
import { trackContactClick } from '@/lib/mixpanel';
// ─── types ────────────────────────────────────────────────────────────────────

export interface ContactFooterV3Props {
  /** Page colour theme — controls text colour only. */
  theme?: 'auto' | 'light' | 'dark';
  /** Extra classes on the root <section>. */
  className?: string;
  /** Background colour override. Defaults to var(--bg-page). */
  bgColor?: string;
  /** Called when the user clicks the logo — use to smooth-scroll to the hero section. */
  onLogoClick?: () => void;
  /** Click an individual clock to swap it to a random different city. Default: false. */
  randomizeCitiesOnClick?: boolean;
}

type ClockMode = 'light' | 'dark' | 'color-full';

// ─── constants ────────────────────────────────────────────────────────────────

const CLOCKS = [
  { city: 'Sydney, Australia',     timezone: 'Australia/Sydney'    },
  { city: 'Santiago, Chile',        timezone: 'America/Santiago'    },
  { city: 'Zurich, Switzerland',   timezone: 'Europe/Zurich'       },
  { city: 'Kyoto, Japan',          timezone: 'Asia/Tokyo'          },
] as const;

type ClockEntry = { city: string; timezone: string };

/** The leftmost clock always shows one of these two, alternating on each click. */
const ANCHORS: ClockEntry[] = [
  { city: 'Sydney, Australia', timezone: 'Australia/Sydney' },
  { city: 'Santiago, Chile',   timezone: 'America/Santiago' },
];

/** Cities to randomly fill the other 3 clocks when `randomizeCitiesOnClick` is on. */
const FOLLOWER_CITY_POOL: ClockEntry[] = [
  { city: 'Rio de Janeiro, Brazil',  timezone: 'America/Sao_Paulo'              },
  { city: 'Pichilemu, Chile',        timezone: 'America/Santiago'               },
  { city: 'New York, USA',           timezone: 'America/New_York'               },
  { city: 'Barcelona, Spain',        timezone: 'Europe/Madrid'                  },
  { city: 'Girona, Spain',           timezone: 'Europe/Madrid'                  },
  { city: 'Manila, Philippines',     timezone: 'Asia/Manila'                    },
  { city: 'Hong Kong',               timezone: 'Asia/Hong_Kong'                 },
  { city: 'Tokyo, Japan',            timezone: 'Asia/Tokyo'                     },
  { city: 'Kyoto, Japan',            timezone: 'Asia/Tokyo'                     },
  { city: 'Osaka, Japan',            timezone: 'Asia/Tokyo'                     },
  { city: 'Berlin, Germany',         timezone: 'Europe/Berlin'                  },
  { city: 'Zurich, Switzerland',     timezone: 'Europe/Zurich'                  },
  { city: 'Paris, France',           timezone: 'Europe/Paris'                   },
  { city: 'Marseille, France',       timezone: 'Europe/Paris'                   },
  { city: 'Stockholm, Sweden',       timezone: 'Europe/Stockholm'               },
  { city: 'Copenhagen, Denmark',     timezone: 'Europe/Copenhagen'              },
  { city: 'Singapore',               timezone: 'Asia/Singapore'                 },
  { city: 'Amsterdam, Netherlands',  timezone: 'Europe/Amsterdam'               },
];

/** The part after the last comma (e.g. "Spain"), or the whole label if there's no comma (e.g. "Singapore"). */
function countryOf(entry: ClockEntry): string {
  const idx = entry.city.lastIndexOf(',');
  return idx === -1 ? entry.city.trim() : entry.city.slice(idx + 1).trim();
}

/**
 * Builds the 4 clocks for a given anchor (0 = Sydney, 1 = Santiago): the
 * anchor itself, plus 3 distinct cities picked at random from
 * `FOLLOWER_CITY_POOL` (no time-gap constraint between them), never two
 * from the same country as each other or as the anchor.
 */
function buildClocksForAnchor(anchorIndex: number): ClockEntry[] {
  const anchor = ANCHORS[anchorIndex];
  const usedCountries = new Set([countryOf(anchor)]);
  const pool = [...FOLLOWER_CITY_POOL];
  const followers: ClockEntry[] = [];
  for (let i = 0; i < 3; i++) {
    const candidates = pool.filter((c) => !usedCountries.has(countryOf(c)));
    const options = candidates.length > 0 ? candidates : pool;
    const pick = options[Math.floor(Math.random() * options.length)];
    followers.push(pick);
    usedCountries.add(countryOf(pick));
    pool.splice(pool.indexOf(pick), 1);
  }
  return [anchor, ...followers];
}

const OVERLAP        = 40;
const INTRO_DURATION = 2200; // ms

// Logo shader — Paper Design (exported Mar 31 2026, @paper-design/shaders-react@0.0.72)
// https://app.paper.design/file/01KJ49ZNQEH0F1QK3CFW5W4DZG?node=4-0
const LOGO_SHADER_PROPS = {
  speed:      1,
  softness:   0,
  repetition: 4.73,
  shiftRed:   0.57,
  shiftBlue:  0,
  distortion: 0,
  contour:    0.8,
  scale:      1,
  rotation:   0,
  shape:      'diamond' as const,
  angle:      0,
  image:      'https://workers.paper.design/file-assets/01KJ49ZNQEH0F1QK3CFW5W4DZG/01KJ6CMVXYXYYS0GRT703XMCA4.svg',
  frame:      8410114.15000008,
  colorBack:  '#00000000',
  colorTint:  '#C7C7C7',
} as const;

// Per-clock fill colors — Figma 1638:5107, full 100% opacity
const CLOCK_COLORS_FULL = [
  '#FFE100',  // Sydney    — background/clock yellow
  '#DD0000',  // Rancagua  — background/clock red
  '#0055FF',  // Zurich — background/clock blue
  '#00FF08',  // Kyoto  — background/clock green
] as const;

// ─── helpers ──────────────────────────────────────────────────────────────────

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getAngles(timezone: string, at: Date = new Date()): { second: number; minute: number; hour: number } {
  const d   = toZonedTime(at, timezone);
  const ms  = d.getMilliseconds();
  const sec = d.getSeconds() + ms / 1000;
  const min = d.getMinutes() + sec / 60;
  const hr  = (d.getHours() % 12) + min / 60;
  return {
    second: (sec / 60) * 360,
    minute: (min / 60) * 360,
    hour:   (hr  / 12) * 360,
  };
}

function getTimeLabel(timezone: string): string {
  const d = toZonedTime(new Date(), timezone);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function setHandTransform(el: SVGLineElement | null, angle: number) {
  if (el) el.setAttribute('transform', `rotate(${angle}, 50, 50)`);
}

// ─── shared link classes ──────────────────────────────────────────────────────

const linkBaseCls =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm';

// ─── component ────────────────────────────────────────────────────────────────

export const ContactFooterV3 = forwardRef<HTMLElement, ContactFooterV3Props>(
  function ContactFooterV3({ theme = 'auto', className, bgColor, onLogoClick, randomizeCitiesOnClick = false }, ref) {
    const textColor =
      theme === 'dark'  ? 'var(--color-white)'
      : theme === 'light' ? 'var(--color-black)'
      : 'var(--text-primary)';

    const shouldReduceMotion = useReducedMotion();
    const innerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(innerRef, { once: false, amount: 0.1 });

    const containerVariants: Variants = shouldReduceMotion
      ? { hidden: {}, visible: {} }
      : { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

    const itemVariants: Variants = shouldReduceMotion
      ? { hidden: {}, visible: {} }
      : {
          hidden: { opacity: 0, y: 28 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 2.0, ease: [0.22, 1, 0.36, 1] },
          },
        };

    return (
      <section
        id="contact"
        ref={ref}
        aria-label="Contact"
        style={{ backgroundColor: bgColor ?? 'var(--bg-page)', color: textColor }}
        className={cn(
          'relative min-h-lvh flex flex-col',
          'pt-[88px] md:pt-[118px]',
          'pb-8',
          className,
        )}
      >
        <motion.div
          ref={innerRef}
          className="flex-1 flex flex-col w-full px-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >

          {/* Centred group: contact links + interactive clocks — extra 32px inner padding on desktop → 64px total */}
          <div className="flex-1 flex flex-col justify-center lg:px-8">
            <div className="flex flex-col gap-10 md:gap-16 [@media(min-width:768px)_and_(min-height:1250px)]:gap-[104px]">
              <motion.div variants={itemVariants}>
                <ContactLinks />
              </motion.div>
              <motion.div variants={itemVariants} className="pb-[24px] md:pb-0">
                <InteractiveClocksRowV3 theme={theme} randomizeCitiesOnClick={randomizeCitiesOnClick} />
              </motion.div>
            </div>
          </div>

          {/* Footer bar — pinned to bottom */}
          <motion.div variants={itemVariants}>
            <FooterBar onLogoClick={onLogoClick} textColor={textColor} />
          </motion.div>

        </motion.div>
      </section>
    );
  },
);

ContactFooterV3.displayName = 'ContactFooterV3';

// ─── InteractiveClocksRowV3 (private) ─────────────────────────────────────────

function InteractiveClocksRowV3({
  theme,
  randomizeCitiesOnClick = false,
}: {
  theme: 'auto' | 'light' | 'dark';
  randomizeCitiesOnClick?: boolean;
}) {
  // Before the user interacts, clocks follow the section theme:
  //   section dark  → light clocks   (contrast)
  //   section light → dark clocks    (contrast)
  // After the first click, manual cycling takes over.
  const [hasInteracted, setHasInteracted] = useState(false);
  const [clockMode, setClockMode] = useState<ClockMode>('light');
  const [isOverCircle, setIsOverCircle] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [anchorIndex, setAnchorIndex] = useState(0);
  const [clocks, setClocks] = useState<ClockEntry[]>(
    () => randomizeCitiesOnClick ? buildClocksForAnchor(0) : CLOCKS.map((c) => ({ ...c })),
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef(0);
  // Persists across clock mode changes so the intro doesn't replay when user toggles
  const hasPlayedIntroRef = useRef(false);
  const handleIntroComplete = useCallback(() => { hasPlayedIntroRef.current = true; }, []);

  useEffect(() => { setMounted(true); }, []);

  // Resolve whether the section is currently in dark mode (handles 'auto' via DOM)
  const sectionIsDark =
    theme === 'dark'  ? true  :
    theme === 'light' ? false :
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  // Theme-driven default: flip relative to section background for contrast
  const themeDefault: ClockMode = sectionIsDark ? 'light' : 'dark';

  // Effective mode: theme-driven until first interaction, then manual
  const effectiveMode: ClockMode = hasInteracted ? clockMode : themeDefault;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (Date.now() - lastTouchRef.current < 500) return;
    const pos = { x: e.clientX, y: e.clientY };
    setCursorPos(pos);

    // Show pill only when cursor is geometrically inside a clock circle (not the corner dead zones).
    // Each [data-clock-circle] element is a square whose inscribed circle we check against.
    let over = false;
    if (wrapperRef.current) {
      wrapperRef.current.querySelectorAll<HTMLElement>('[data-clock-circle]').forEach(el => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const r  = rect.width / 2;
        const dx = pos.x - cx;
        const dy = pos.y - cy;
        if (dx * dx + dy * dy <= r * r) over = true;
      });
    }
    setIsOverCircle(over);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOverCircle(false);
    setCursorPos(null);
  }, []);

  function handleToggle() {
    const next: ClockMode =
      effectiveMode === 'light'      ? 'dark'       :
      effectiveMode === 'dark'       ? 'color-full' :
      'light';
    setHasInteracted(true);
    setClockMode(next);
    if (randomizeCitiesOnClick) {
      const nextAnchor = anchorIndex === 0 ? 1 : 0;
      setAnchorIndex(nextAnchor);
      setClocks(buildClocksForAnchor(nextAnchor));
    }
  }

  const clockFaces: readonly string[] =
    effectiveMode === 'dark'       ? CLOCKS.map(() => 'var(--color-black)') :
    effectiveMode === 'color-full' ? CLOCK_COLORS_FULL                      :
    CLOCKS.map(() => 'var(--color-white)');

  const clockBorder = effectiveMode === 'dark' ? 'var(--color-white)' : 'var(--color-black)';

  return (
    <>
      <div
        ref={wrapperRef}
        role="button"
        tabIndex={0}
        aria-label={
          randomizeCitiesOnClick
            ? 'Toggle clock theme and shuffle cities — click to cycle light, dark, and colour, and randomize each clock\'s city'
            : 'Toggle clock theme — click to switch between light, dark, and colour'
        }
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }}
        onTouchStart={() => { lastTouchRef.current = Date.now(); setIsOverCircle(false); setCursorPos(null); }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={effectiveMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full"
          >
            <SolidClocksRow
              clocks={clocks}
              clockFaces={clockFaces}
              clockBorder={clockBorder}
              showCircleBorder={effectiveMode !== 'color-full'}
              skipIntro={randomizeCitiesOnClick ? false : hasPlayedIntroRef.current}
              onIntroComplete={handleIntroComplete}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOverCircle && cursorPos && (
            <motion.div
              key="clocks-pill"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}
              className={cn(
                'fixed z-50 hidden md:flex items-center gap-2 pointer-events-none',
                'px-8 py-4 rounded-[var(--radius-pill)]',
                'bg-[var(--bg-page)] text-[var(--text-primary)]',
                'shadow-[var(--shadow-pill)]',
                '[font-family:var(--font-sans)]',
                '[font-size:var(--text-body-size)] [line-height:var(--text-body-leading)]',
              )}
            >
              <span>Do it</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

// ─── SolidClocksRow (private) ─────────────────────────────────────────────────

interface SolidClocksRowProps {
  /** Cities/timezones to render, in order. */
  clocks: readonly ClockEntry[];
  /** One fill colour per clock (index matches `clocks` order). */
  clockFaces: readonly string[];
  clockBorder: string;
  /** Whether to show the ring stroke on each circle. Defaults to true. */
  showCircleBorder?: boolean;
  /** Skip the intro animation and go straight to ticking (e.g. after first play). */
  skipIntro?: boolean;
  /** Called when the intro animation completes on the first clock. */
  onIntroComplete?: () => void;
}

function SolidClocksRow({ clocks, clockFaces, clockBorder, showCircleBorder = true, skipIntro = false, onIntroComplete }: SolidClocksRowProps) {
  return (
    <div className="flex items-center w-full" style={{ paddingRight: OVERLAP }}>
      {clocks.map((clock, i) => (
        <div
          key={i}
          className="relative flex-1 min-w-0"
          style={{ marginRight: -OVERLAP, zIndex: clocks.length - i }}
        >
          <SolidClockFace
            timezone={clock.timezone}
            city={clock.city}
            clockFace={clockFaces[i]}
            clockBorder={clockBorder}
            showCircleBorder={showCircleBorder}
            skipIntro={skipIntro}
            onIntroComplete={i === 0 ? onIntroComplete : undefined}
          />
        </div>
      ))}
    </div>
  );
}

// ─── SolidClockFace (private) ─────────────────────────────────────────────────
//
// SVG geometry identical to ClockFaceV2 in ContactFooterV2:
//   viewBox="1.5 1.5 97.0 97.0", r=48.5, strokeWidth=0.25
//   Hour hand:    (50,50)→(50,24)
//   Minute hand:  (50,50)→(50,15)
//   Seconds hand: (50,50)→(50,12)  ← new

interface SolidClockFaceProps {
  timezone: string;
  city: string;
  clockFace: string;
  clockBorder: string;
  showCircleBorder?: boolean;
  /** Skip the intro and go straight to ticking (use when intro already played). */
  skipIntro?: boolean;
  /** Called when the intro animation completes. */
  onIntroComplete?: () => void;
}

function SolidClockFace({ timezone, city, clockFace, clockBorder, showCircleBorder = true, skipIntro = false, onIntroComplete }: SolidClockFaceProps) {
  const [phase, setPhase] = useState<'idle' | 'animating' | 'ticking'>(skipIntro ? 'ticking' : 'idle');
  const [timeLabel, setTimeLabel] = useState<string | null>(null);

  const rootRef       = useRef<HTMLDivElement>(null);
  const hourHandRef   = useRef<SVGLineElement>(null);
  const minuteHandRef = useRef<SVGLineElement>(null);
  const secondHandRef = useRef<SVGLineElement>(null);
  const rafRef        = useRef<number>(0);

  // One-shot IntersectionObserver: idle → animating (skipped when skipIntro=true)
  useEffect(() => {
    if (phase !== 'idle') return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('animating');
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  // rAF loop — intro animation ('animating') or real-time ticking ('ticking')
  useEffect(() => {
    if (phase === 'idle') return;

    if (phase === 'animating') {
      // Target the angle the clock WILL show when the intro finishes (not when it
      // starts), so the handoff to real-time ticking lands exactly in place instead
      // of snapping forward by ~INTRO_DURATION worth of elapsed time.
      const target    = getAngles(timezone, new Date(Date.now() + INTRO_DURATION));
      const startTime = performance.now();

      function frame(now: number) {
        const t     = Math.min((now - startTime) / INTRO_DURATION, 1);
        const eased = easeInOutCubic(t);
        setHandTransform(hourHandRef.current,   eased * (360 + target.hour));
        setHandTransform(minuteHandRef.current, eased * (360 + target.minute));
        setHandTransform(secondHandRef.current, eased * (360 + target.second));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          onIntroComplete?.();
          setPhase('ticking');
        }
      }
      rafRef.current = requestAnimationFrame(frame);

    } else {
      // Real-time smooth ticking
      let lastMinute = -1;

      function tick() {
        const angles = getAngles(timezone);
        setHandTransform(hourHandRef.current,   angles.hour);
        setHandTransform(minuteHandRef.current, angles.minute);
        setHandTransform(secondHandRef.current, angles.second);
        const d = toZonedTime(new Date(), timezone);
        if (d.getMinutes() !== lastMinute) {
          lastMinute = d.getMinutes();
          setTimeLabel(getTimeLabel(timezone));
        }
        rafRef.current = requestAnimationFrame(tick);
      }
      setTimeLabel(getTimeLabel(timezone));
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, timezone, onIntroComplete]);

  const label = timeLabel ?? '00:00';

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={`${city}: ${label}`}
      className="flex flex-col items-center gap-[var(--clock-gap-mobile)] md:gap-[var(--clock-gap)] w-full"
      style={{
        '--clock-face':   clockFace,
        '--clock-border': clockBorder,
      } as React.CSSProperties}
    >
      <div className="w-full aspect-square" aria-hidden="true" data-clock-circle="true">
        <svg
          viewBox="1.5 1.5 97.0 97.0"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <circle
            cx="50" cy="50" r="48.5"
            fill="var(--clock-face)"
            stroke="var(--clock-border)"
            strokeWidth={showCircleBorder ? 0.25 : 0}
          />
          <line
            ref={hourHandRef}
            x1="50" y1="50" x2="50" y2="24"
            stroke="var(--clock-border)"
            strokeWidth="0.25"
            strokeLinecap="round"
          />
          <line
            ref={minuteHandRef}
            x1="50" y1="50" x2="50" y2="15"
            stroke="var(--clock-border)"
            strokeWidth="0.25"
            strokeLinecap="round"
          />
          {/* Seconds hand — longest (38/48.5 ≈ 78 %), sweeps fluidly */}
          <line
            ref={secondHandRef}
            x1="50" y1="50" x2="50" y2="12"
            stroke="var(--clock-border)"
            strokeWidth="0.25"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p
        aria-hidden="true"
        className={cn(
          'font-sans [font-weight:var(--text-body-weight)] md:[font-weight:var(--text-h2-weight)] text-center w-full',
          '[font-size:var(--text-xs-size)] [line-height:var(--text-xs-leading)]',
          'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
        )}
      >
        <span className="md:hidden">{city.split(',')[0].trim()}</span>
        <span className="hidden md:inline">{city.split(',')[0].trim()}, {label}</span>
      </p>
    </div>
  );
}

// ─── ContactLinks (private) ───────────────────────────────────────────────────

// ─── HoverPillLink (private) ──────────────────────────────────────────────────

interface HoverPillLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  pill: string;
}

function HoverPillLink({ href, pill, children, className, ...props }: HoverPillLinkProps) {
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const lastTouchRef = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <a
        href={href}
        className={cn(linkBaseCls, 'w-fit', className)}
        onTouchStart={() => { lastTouchRef.current = Date.now(); setHovered(false); setCursorPos(null); }}
        onMouseEnter={() => { if (Date.now() - lastTouchRef.current < 500) return; setHovered(true); }}
        onMouseLeave={() => { setHovered(false); setCursorPos(null); }}
        onMouseMove={(e) => { if (Date.now() - lastTouchRef.current < 500) return; setCursorPos({ x: e.clientX, y: e.clientY }); }}
        {...props}
      >
        {children}
      </a>
      {mounted && createPortal(
        <AnimatePresence>
          {hovered && cursorPos && (
            <motion.div
              key={pill}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}
              className={cn(
                'fixed z-50 hidden md:flex items-center pointer-events-none',
                'px-8 py-4 rounded-[var(--radius-pill)]',
                'bg-[var(--bg-page)] text-[var(--text-primary)]',
                'shadow-[var(--shadow-pill)]',
                'font-sans [font-weight:var(--text-body-weight)]',
                '[font-size:var(--text-body-size)] [line-height:var(--text-body-leading)]',
              )}
            >
              {pill}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

// ─── HoverPillCopyButton (private) ────────────────────────────────────────────

function HoverPillCopyButton({ value, children, className, onClick }: { value: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastTouchRef = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <button
        onClick={() => {
          navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          onClick?.();
        }}
        onTouchStart={() => { lastTouchRef.current = Date.now(); setHovered(false); setCursorPos(null); }}
        onMouseEnter={() => { if (Date.now() - lastTouchRef.current < 500) return; setHovered(true); }}
        onMouseLeave={() => { setHovered(false); setCursorPos(null); }}
        onMouseMove={(e) => { if (Date.now() - lastTouchRef.current < 500) return; setCursorPos({ x: e.clientX, y: e.clientY }); }}
        className={cn(linkBaseCls, 'w-fit text-left', className)}
      >
        {children}
      </button>
      {mounted && createPortal(
        <AnimatePresence>
          {hovered && cursorPos && (
            <motion.div
              key={copied ? 'copied' : 'copy'}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}
              className={cn(
                'fixed z-50 hidden md:flex items-center pointer-events-none',
                'px-8 py-4 rounded-[var(--radius-pill)]',
                'bg-[var(--bg-page)] text-[var(--text-primary)]',
                'shadow-[var(--shadow-pill)]',
                'font-sans [font-weight:var(--text-body-weight)]',
                '[font-size:var(--text-body-size)] [line-height:var(--text-body-leading)]',
              )}
            >
              {copied ? 'Copied!' : 'Copy email'}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

// ─── ContactLinks (private) ───────────────────────────────────────────────────

function ContactLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[var(--card-gap)]">

      {/* Get in touch */}
      <div className="flex flex-col gap-0 text-left">
        <h3 className={cn(
          'font-serif font-normal not-italic',
          '[font-size:var(--text-h2-serif-mobile-size)] [line-height:var(--text-h2-serif-mobile-leading)]',
          'md:[font-size:var(--text-h2-serif-size)] md:[line-height:var(--text-h2-serif-leading)]',
        )}>
          Get in touch
        </h3>
        <div className={cn(
          'flex flex-col font-sans [font-weight:var(--text-h2-weight)]',
          '[font-size:var(--text-h2-mobile-size)] [line-height:var(--text-h2-mobile-leading)]',
          'md:[font-size:var(--text-h2-size)] md:[line-height:var(--text-h2-leading)]',
          '[letter-spacing:var(--text-h2-tracking)]',
        )}>
          <HoverPillCopyButton value="jp@globo.studio" onClick={() => trackContactClick('email')}>jp@globo.studio</HoverPillCopyButton>
          <HoverPillLink href="tel:+61432520578" pill="Call now!" onClick={() => trackContactClick('phone')}>04 3252 0578</HoverPillLink>
        </div>
      </div>

      {/* Stalk me */}
      <div className="flex flex-col gap-0 text-left">
        <h3 className={cn(
          'font-serif font-normal not-italic',
          '[font-size:var(--text-h2-serif-mobile-size)] [line-height:var(--text-h2-serif-mobile-leading)]',
          'md:[font-size:var(--text-h2-serif-size)] md:[line-height:var(--text-h2-serif-leading)]',
        )}>
          Stalk me
        </h3>
        <div className={cn(
          'flex flex-col font-sans [font-weight:var(--text-h2-weight)]',
          '[font-size:var(--text-h2-mobile-size)] [line-height:var(--text-h2-mobile-leading)]',
          'md:[font-size:var(--text-h2-size)] md:[line-height:var(--text-h2-leading)]',
          '[letter-spacing:var(--text-h2-tracking)]',
        )}>
          <HoverPillLink href="https://www.linkedin.com/in/juanpablo-design/" target="_blank" rel="noopener noreferrer" pill="Necessary evil" onClick={() => trackContactClick('linkedin')}>LinkedIn</HoverPillLink>
          <HoverPillLink href="https://www.onlyme.life/juanpablo" target="_blank" rel="noopener noreferrer" pill="See more of me" onClick={() => trackContactClick('onlyme')}>OnlyMe</HoverPillLink>
        </div>
      </div>

    </div>
  );
}

// ─── FooterBar (private) ──────────────────────────────────────────────────────

function FooterBar({ onLogoClick, textColor }: { onLogoClick?: () => void; textColor: string }) {
  const textCls = cn(
    'font-sans not-italic [font-weight:var(--text-body-light-weight)]',
    '[font-size:var(--text-xs-size)] [line-height:var(--text-xs-leading)]',
    'md:[font-size:var(--text-sm-size)] md:[line-height:var(--text-sm-leading)]',
  );

  return (
    <div
      className={cn(
        'flex flex-col items-start gap-2',
        'md:flex-row md:justify-between md:items-end',
      )}
      style={{ color: textColor }}
    >
      {/* Logo — left on mobile and desktop */}
      <div className="flex flex-col items-start gap-[8px]">
        {/* Logo — LiquidMetal shader, same size as static SVG was (h-8 mobile / h-[45px] desktop) */}
        <a
          href="#hero"
          aria-label="Back to top"
          onClick={onLogoClick ? (e) => { e.preventDefault(); onLogoClick(); } : undefined}
        >
          <div
            role="img"
            aria-label="globo Studio"
            className="relative overflow-hidden h-8 md:h-[45px] aspect-[86/56]"
          >
            <LiquidMetal
              {...LOGO_SHADER_PROPS}
              className="absolute inset-0 w-full h-full"
              aria-hidden
            />
          </div>
        </a>

        {/* Mobile only: two lines + "Built with" stacked below logo */}
        <div className={cn(textCls, 'flex flex-col items-start md:hidden')}>
          <span className="[font-weight:var(--text-body-weight)]">© globo 2026</span>
          <span>Designer person born in Chile</span>
          <span>Based in Sydney, NSW</span>
          <span>Built with obsession and good vibes (coding)</span>
        </div>

        {/* Desktop only: stacked lines below logo */}
        <div className={cn(textCls, 'hidden md:flex flex-col items-start')}>
          <span className="[font-weight:var(--text-body-weight)]">© globo 2026</span>
          <span>Designer person born in Chile. Based in Sydney, NSW</span>
        </div>
      </div>

      {/* Desktop only: tagline (right) */}
      <p className={cn(textCls, 'hidden md:block')}>Built with obsession and good vibes (coding)</p>
    </div>
  );
}
