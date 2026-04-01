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

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { toZonedTime } from 'date-fns-tz';
import { LiquidMetal } from '@paper-design/shaders-react';
import { cn } from '@/lib/utils';
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
}

type ClockMode = 'light' | 'dark' | 'color-full';

// ─── constants ────────────────────────────────────────────────────────────────

const CLOCKS = [
  { city: 'Sydney, Australia',     timezone: 'Australia/Sydney'    },
  { city: 'Santiago, Chile',        timezone: 'America/Santiago'    },
  { city: 'Zurich, Switzerland',   timezone: 'Europe/Zurich'       },
  { city: 'Kyoto, Japan',          timezone: 'Asia/Tokyo'          },
] as const;

const OVERLAP = 40;

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

// ─── shared link classes ──────────────────────────────────────────────────────

const linkBaseCls =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm';

// ─── component ────────────────────────────────────────────────────────────────

export const ContactFooterV3 = forwardRef<HTMLElement, ContactFooterV3Props>(
  function ContactFooterV3({ theme = 'auto', className, bgColor, onLogoClick }, ref) {
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
          'pt-[104px] md:pt-[118px]',
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
              <motion.div variants={itemVariants}>
                <InteractiveClocksRowV3 theme={theme} />
              </motion.div>
            </div>
          </div>

          {/* Footer bar — pinned to bottom */}
          <motion.div variants={itemVariants}>
            <FooterBar onLogoClick={onLogoClick} />
          </motion.div>

        </motion.div>
      </section>
    );
  },
);

ContactFooterV3.displayName = 'ContactFooterV3';

// ─── InteractiveClocksRowV3 (private) ─────────────────────────────────────────

function InteractiveClocksRowV3({ theme }: { theme: 'auto' | 'light' | 'dark' }) {
  // Before the user interacts, clocks follow the section theme:
  //   section dark  → light clocks   (contrast)
  //   section light → dark clocks    (contrast)
  // After the first click, manual cycling takes over.
  const [hasInteracted, setHasInteracted] = useState(false);
  const [clockMode, setClockMode] = useState<ClockMode>('light');
  const [isOverCircle, setIsOverCircle] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
        aria-label="Toggle clock theme — click to switch between light, dark, and colour"
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }}
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
            <SolidClocksRow clockFaces={clockFaces} clockBorder={clockBorder} showCircleBorder={effectiveMode !== 'color-full'} />
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
  /** One fill colour per clock (index matches CLOCKS order). */
  clockFaces: readonly string[];
  clockBorder: string;
  /** Whether to show the ring stroke on each circle. Defaults to true. */
  showCircleBorder?: boolean;
}

function SolidClocksRow({ clockFaces, clockBorder, showCircleBorder = true }: SolidClocksRowProps) {
  return (
    <div className="flex items-center w-full" style={{ paddingRight: OVERLAP }}>
      {CLOCKS.map((clock, i) => (
        <div
          key={clock.city}
          className="relative flex-1 min-w-0"
          style={{ marginRight: -OVERLAP, zIndex: CLOCKS.length - i }}
        >
          <SolidClockFace
            timezone={clock.timezone}
            city={clock.city}
            clockFace={clockFaces[i]}
            clockBorder={clockBorder}
            showCircleBorder={showCircleBorder}
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
//   Hour hand:   (50,50)→(50,24)
//   Minute hand: (50,50)→(50,15)

interface SolidClockFaceProps {
  timezone: string;
  city: string;
  clockFace: string;
  clockBorder: string;
  showCircleBorder?: boolean;
}

function SolidClockFace({ timezone, city, clockFace, clockBorder, showCircleBorder = true }: SolidClockFaceProps) {
  const [time, setTime] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    function tick() {
      const d = toZonedTime(new Date(), timezone);
      setTime({ h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const { h = 0, m = 0, s = 0 } = time ?? {};

  const minuteAngle = (m / 60) * 360 + (s / 60) * 6;
  const hourAngle   = ((h % 12) / 12) * 360 + (m / 60) * 30;

  const timeString = useMemo(
    () => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    [h, m],
  );

  return (
    <div
      role="img"
      aria-label={`${city}: ${timeString}`}
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
            x1="50" y1="50" x2="50" y2="24"
            stroke="var(--clock-border)"
            strokeWidth="0.25"
            strokeLinecap="round"
            transform={`rotate(${hourAngle}, 50, 50)`}
          />
          <line
            x1="50" y1="50" x2="50" y2="15"
            stroke="var(--clock-border)"
            strokeWidth="0.25"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle}, 50, 50)`}
          />
        </svg>
      </div>

      <p
        aria-hidden="true"
        className={cn(
          'font-sans [font-weight:var(--text-body-weight)] text-center w-full',
          '[font-size:var(--text-body-mobile-size)] [line-height:var(--text-body-mobile-leading)]',
          'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
        )}
      >
        <span className="md:hidden">{city.split(',')[0].trim()}</span>
        <span className="hidden md:inline">{city.split(',')[0].trim()}, {timeString}</span>
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

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <a
        href={href}
        className={cn(linkBaseCls, 'w-fit', className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setCursorPos(null); }}
        onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
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

// ─── ContactLinks (private) ───────────────────────────────────────────────────

function ContactLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[var(--card-gap)]">

      {/* Get in touch */}
      <div className="flex flex-col gap-0 text-left">
        <h3 className={cn(
          'font-serif font-normal not-italic text-[var(--text-muted)]',
          '[font-size:var(--text-h3-mobile-size)] [line-height:var(--text-h3-mobile-leading)]',
          'md:[font-size:var(--text-h3-size)] md:[line-height:var(--text-h3-leading)]',
        )}>
          Get in touch
        </h3>
        <div className={cn(
          'flex flex-col font-sans [font-weight:var(--text-h2-weight)]',
          '[font-size:var(--text-h2-mobile-size)] [line-height:var(--text-h2-mobile-leading)]',
          'md:[font-size:var(--text-h2-size)] md:[line-height:var(--text-h2-leading)]',
          '[letter-spacing:var(--text-h2-tracking)]',
        )}>
          <HoverPillLink href="mailto:jp@globo.studio" pill="Write me a letter">jp@globo.studio</HoverPillLink>
          <HoverPillLink href="tel:+61432520578" pill="I would love to hear your voice">04 3252 0578</HoverPillLink>
        </div>
      </div>

      {/* Stalk me */}
      <div className="flex flex-col gap-0 text-left">
        <h3 className={cn(
          'font-serif font-normal not-italic text-[var(--text-muted)]',
          '[font-size:var(--text-h3-mobile-size)] [line-height:var(--text-h3-mobile-leading)]',
          'md:[font-size:var(--text-h3-size)] md:[line-height:var(--text-h3-leading)]',
        )}>
          Stalk me
        </h3>
        <div className={cn(
          'flex flex-col font-sans [font-weight:var(--text-h2-weight)]',
          '[font-size:var(--text-h2-mobile-size)] [line-height:var(--text-h2-mobile-leading)]',
          'md:[font-size:var(--text-h2-size)] md:[line-height:var(--text-h2-leading)]',
          '[letter-spacing:var(--text-h2-tracking)]',
        )}>
          <HoverPillLink href="https://www.linkedin.com/in/juanpablo-design/" target="_blank" rel="noopener noreferrer" pill="Not particularly my favourite place">LinkedIn</HoverPillLink>
          <HoverPillLink href="https://onlyme.life/" target="_blank" rel="noopener noreferrer" pill="See more of me">OnlyMe</HoverPillLink>
        </div>
      </div>

    </div>
  );
}

// ─── FooterBar (private) ──────────────────────────────────────────────────────

function FooterBar({ onLogoClick }: { onLogoClick?: () => void }) {
  const textCls = cn(
    'font-sans not-italic text-[var(--text-primary)]',
    '[font-size:var(--text-xs-size)] [line-height:var(--text-xs-leading)]',
    'md:[font-size:var(--text-sm-size)] md:[line-height:var(--text-sm-leading)]',
  );

  return (
    <div className={cn(
      'flex flex-col items-start gap-2',
      'md:flex-row md:justify-between md:items-end',
    )}>
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
            aria-label="Globo Studio"
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
          <span>© Globo 2026</span>
          <span>Designer person born in Chile</span>
          <span>Based in Sydney, NSW</span>
          <span>Built with ♥ and good vibes (coding)</span>
        </div>

        {/* Desktop only: stacked lines below logo */}
        <div className={cn(textCls, 'hidden md:flex flex-col items-start')}>
          <span>© Globo 2026</span>
          <span>Designer person born in Chile. Based in Sydney, NSW</span>
        </div>
      </div>

      {/* Desktop only: tagline (right) */}
      <p className={cn(textCls, 'hidden md:block')}>Built with ♥ and good vibes (coding)</p>
    </div>
  );
}
