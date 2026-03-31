'use client';

/**
 * ContactFooterV2 — contact footer with interactive clocks (v2)
 *
 * Figma: contact-footer section (1638:4135)
 *   Desktop  1638:4660  — 1728 × 1108 px, content 1664 px wide
 *   Tablet   1638:4661  — 1024 × 872 px,  content 960 px wide
 *   Mobile   1638:4732  — 393 × 686 px,   content 353 px wide
 *
 * Key differences from ContactFooter (v1)
 * ────────────────────────────────────────
 * 1. Clock face — solid filled circle (black on light page, white on dark page).
 *    Figma variables: background/clock = #000000, border/default-light = #ffffff.
 *    The ring stroke and both hand strokes share the same color token.
 *
 * 2. Clock hand geometry — IDENTICAL to Clock.tsx (viewBox, coords, strokeWidth).
 *    Only the fill and color tokens differ.
 *
 * 3. Overlapping layout — 40 px overlap at every breakpoint.
 *    Container: padding-right 40 px. Each clock wrapper: margin-right -40 px.
 *    This is exact per Figma node positions (same rule regardless of breakpoint).
 *
 * 4. City labels — full "City, Country" on md+, city name only on mobile.
 *    No time displayed (unlike v1's Clock component which shows HH:MM).
 *    Gap between face and label: 16 px at all breakpoints (--clock-gap).
 *
 * 5. All 4 clocks visible at every breakpoint (v1 hides 2 on mobile).
 *
 * Interactive behaviour
 * ─────────────────────
 * Clicking anywhere on the clocks area toggles their theme:
 *   auto  → detects page theme, jumps to the opposite (always visible)
 *   dark  ↔ light  (subsequent clicks)
 * Keyboard: Tab to reach the area, press Enter or Space to toggle.
 *
 * New CSS tokens (in tokens.css)
 * ───────────────────────────────
 *   --bg-clock-v2      face fill   → #000000 light / #ffffff dark
 *   --border-clock-v2  ring+hands  → #ffffff light / #000000 dark
 */

import { forwardRef, useEffect, useMemo, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface ContactFooterV2Props {
  /** Initial clock colour theme. Default 'auto' follows the CSS token cascade. */
  theme?: 'auto' | 'light' | 'dark';
  /** Extra classes on the root <section>. */
  className?: string;
  /** Background colour override. Defaults to var(--bg-page). */
  bgColor?: string;
}

// ─── constants ────────────────────────────────────────────────────────────────

const CLOCKS = [
  { city: 'Sydney, Australia',     timezone: 'Australia/Sydney'    },
  { city: 'Rancagua, Chile',       timezone: 'America/Santiago'    },
  { city: 'Barcelona, Spain',      timezone: 'Europe/Madrid'       },
  { city: 'San Juan, Puerto Rico', timezone: 'America/Puerto_Rico' },
] as const;

// ─── shared link classes ──────────────────────────────────────────────────────

const linkCls =
  'hover:opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm';

// ─── component ────────────────────────────────────────────────────────────────

export const ContactFooterV2 = forwardRef<HTMLElement, ContactFooterV2Props>(
  function ContactFooterV2({ theme = 'auto', className, bgColor }, ref) {
    const textColor =
      theme === 'dark'  ? 'var(--color-white)'
      : theme === 'light' ? 'var(--color-black)'
      : 'var(--text-primary)';

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
        <div className="flex-1 flex flex-col w-full px-8">

          {/* Centred group: contact links + interactive clocks — extra 32px inner padding on desktop → 64px total */}
          <div className="flex-1 flex flex-col justify-center lg:px-8">
            <div className="flex flex-col gap-10 md:gap-16 [@media(min-width:768px)_and_(min-height:1250px)]:gap-[104px]">
              <ContactLinks />
              <InteractiveClocksRow initialTheme={theme} />
            </div>
          </div>

          {/* Footer bar — pinned to bottom */}
          <FooterBar />

        </div>
      </section>
    );
  },
);

ContactFooterV2.displayName = 'ContactFooterV2';

// ─── ContactLinks (private) ───────────────────────────────────────────────────

function ContactLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[var(--card-gap)]">

      {/* Get in touch */}
      <div className="flex flex-col gap-0 text-left">
        <h3 className={cn(
          'font-serif font-normal not-italic',
          '[font-size:var(--text-h3-mobile-size)] [line-height:var(--text-h3-mobile-leading)]',
          'md:[font-size:var(--text-h3-size)] md:[line-height:var(--text-h3-leading)]',
        )}>
          Get in touch
        </h3>
        <div className={cn(
          'flex flex-col font-sans',
          '[font-size:var(--text-h2-mobile-size)] [line-height:var(--text-h2-mobile-leading)]',
          'md:[font-size:var(--text-h2-size)] md:[line-height:var(--text-h2-leading)]',
        )}>
          <a href="mailto:hello@globo.studio" className={linkCls}>hello@globo.studio</a>
          <a href="tel:+61432520578" className={linkCls}>04 3252 0578</a>
        </div>
      </div>

      {/* Stalk me */}
      <div className="flex flex-col gap-0 text-left">
        <h3 className={cn(
          'font-serif font-normal not-italic',
          '[font-size:var(--text-h3-mobile-size)] [line-height:var(--text-h3-mobile-leading)]',
          'md:[font-size:var(--text-h3-size)] md:[line-height:var(--text-h3-leading)]',
        )}>
          Stalk me
        </h3>
        <div className={cn(
          'flex flex-col font-sans',
          '[font-size:var(--text-h2-mobile-size)] [line-height:var(--text-h2-mobile-leading)]',
          'md:[font-size:var(--text-h2-size)] md:[line-height:var(--text-h2-leading)]',
        )}>
          <a href="https://www.linkedin.com/company/globostudio" target="_blank" rel="noopener noreferrer" className={linkCls}>LinkedIn</a>
          <a href="https://onlyme.com/globostudio" target="_blank" rel="noopener noreferrer" className={linkCls}>OnlyMe</a>
        </div>
      </div>

    </div>
  );
}

// ─── InteractiveClocksRow (private) ──────────────────────────────────────────

interface InteractiveClocksRowProps {
  initialTheme: 'auto' | 'light' | 'dark';
}

function InteractiveClocksRow({ initialTheme }: InteractiveClocksRowProps) {
  const [clockTheme, setClockTheme] = useState<'auto' | 'light' | 'dark'>(initialTheme);

  function handleToggle() {
    setClockTheme(prev => {
      if (prev !== 'auto') return prev === 'light' ? 'dark' : 'light';
      // First click from 'auto': jump to the opposite of the current page theme
      // so the contrast change is always immediately visible.
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? 'light' : 'dark';
    });
  }

  // Resolve colour tokens from clockTheme state
  const clockFace =
    clockTheme === 'dark'  ? 'var(--color-black)'
    : clockTheme === 'light' ? 'var(--color-white)'
    : 'var(--bg-clock-v2)';   // auto → CSS token cascade

  const clockBorder =
    clockTheme === 'dark'  ? 'var(--color-white)'
    : clockTheme === 'light' ? 'var(--color-black)'
    : 'var(--border-clock-v2)';  // auto → CSS token cascade

  return (
    // padding-right + margin-right create the 40 px overlap at every breakpoint.
    // Inline styles used (not Tailwind) to prevent the negative value being purged.
    <div
      role="button"
      tabIndex={0}
      aria-label="Toggle clock theme — click to switch between light and dark"
      onClick={handleToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }}
      className="flex items-center w-full cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm"
      style={{ paddingRight: '40px' }}
    >
      {CLOCKS.map((clock, i) => (
        <div key={clock.city} className="relative flex-1 min-w-0" style={{ marginRight: '-40px', zIndex: CLOCKS.length - i }}>
          <ClockFaceV2
            timezone={clock.timezone}
            city={clock.city}
            clockFace={clockFace}
            clockBorder={clockBorder}
          />
        </div>
      ))}
    </div>
  );
}

// ─── ClockFaceV2 (private) ────────────────────────────────────────────────────
//
// SVG geometry is IDENTICAL to Clock.tsx:
//   viewBox="1.5 1.5 97.0 97.0", r=48.5, strokeWidth=0.25
//   Hour hand:   (50,50)→(50,24)   — same coordinates
//   Minute hand: (50,50)→(50,15)   — same coordinates
//
// The only additions vs Clock.tsx:
//   • circle gets fill="var(--clock-face)"  (solid filled face)
//   • circle gets stroke="var(--clock-border)" (visible ring)
//   • hands use stroke="var(--clock-border)" instead of the v1 --clock-color

interface ClockFaceV2Props {
  timezone: string;
  city: string;
  clockFace: string;
  clockBorder: string;
}

function ClockFaceV2({ timezone, city, clockFace, clockBorder }: ClockFaceV2Props) {
  // null on first render (SSR) → avoids hydration time mismatch
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

  // Smooth sweep (same logic as Clock.tsx)
  const minuteAngle = (m / 60) * 360 + (s / 60) * 6;
  const hourAngle   = ((h % 12) / 12) * 360 + (m / 60) * 30;

  // Aria label — memoised to minute boundary (same as Clock.tsx)
  const timeString = useMemo(
    () => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    [h, m],
  );

  return (
    <div
      role="img"
      aria-label={`${city}: ${timeString}`}
      // 16 px gap at ALL breakpoints — Figma measures confirm this for desktop, tablet, and mobile
      className="flex flex-col items-center gap-[var(--clock-gap)] w-full"
      style={{
        '--clock-face':   clockFace,
        '--clock-border': clockBorder,
      } as React.CSSProperties}
    >
      {/* Clock face */}
      <div className="w-full aspect-square" aria-hidden="true">
        <svg
          viewBox="1.5 1.5 97.0 97.0"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          {/* Solid filled circle face + visible ring border */}
          <circle
            cx="50" cy="50" r="48.5"
            fill="var(--clock-face)"
            stroke="var(--clock-border)"
            strokeWidth="0.25"
          />

          {/* Hour hand — IDENTICAL geometry to Clock.tsx */}
          <line
            x1="50" y1="50" x2="50" y2="24"
            stroke="var(--clock-border)"
            strokeWidth="0.25"
            strokeLinecap="round"
            transform={`rotate(${hourAngle}, 50, 50)`}
          />

          {/* Minute hand — IDENTICAL geometry to Clock.tsx */}
          <line
            x1="50" y1="50" x2="50" y2="15"
            stroke="var(--clock-border)"
            strokeWidth="0.25"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle}, 50, 50)`}
          />
        </svg>
      </div>

      {/* City label — full "City, Country" on md+, city name only on mobile. No time. */}
      <p
        aria-hidden="true"
        className={cn(
          '[font-family:var(--font-serif)] font-normal not-italic text-center w-full',
          '[font-size:var(--text-h3-mobile-size)] [line-height:var(--text-h3-mobile-leading)]',
          'md:[font-size:var(--text-h3-size)] md:[line-height:var(--text-h3-leading)]',
        )}
      >
        <span className="md:hidden">{city.split(',')[0].trim()}</span>
        <span className="hidden md:inline">{city.split(',')[0].trim()}, {timeString}</span>
      </p>
    </div>
  );
}

// ─── FooterBar (private) ──────────────────────────────────────────────────────

function FooterBar() {
  const textCls = cn(
    'font-sans not-italic',
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
        <svg
          className="h-8 md:h-[45px] w-auto"
          viewBox="0 0 86 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Globo Studio"
          role="img"
        >
          <path d="M74.4302 39.7796C76.7082 39.7892 78.9379 39.1232 80.8375 37.8659C82.7372 36.6086 84.2214 34.8164 85.1028 32.7157C85.9841 30.6151 86.2229 28.3003 85.7891 26.064C85.3552 23.8277 84.2682 21.7701 82.6653 20.1515C81.0624 18.5328 79.0156 17.4256 76.7837 16.9698C74.5517 16.514 72.2347 16.7301 70.1255 17.5908C68.0163 18.4515 66.2096 19.9181 64.9337 21.8053C63.6579 23.6925 62.97 25.9155 62.9572 28.1935C62.9482 29.707 63.2375 31.2075 63.8088 32.6091C64.38 34.0107 65.2219 35.286 66.2863 36.362C67.3507 37.438 68.6167 38.2937 70.012 38.8802C71.4073 39.4666 72.9046 39.7722 74.4181 39.7796" fill="currentColor"/>
          <path d="M32.4585 39.7796C34.7365 39.7892 36.9662 39.1232 38.8659 37.8659C40.7655 36.6086 42.2498 34.8164 43.1311 32.7157C44.0124 30.6151 44.2512 28.3003 43.8174 26.064C43.3835 23.8277 42.2965 21.7701 40.6936 20.1515C39.0907 18.5328 37.044 17.4256 34.812 16.9698C32.58 16.514 30.263 16.7301 28.1539 17.5908C26.0447 18.4515 24.238 19.9181 22.9621 21.8053C21.6862 23.6925 20.9984 25.9155 20.9856 28.1935C20.9765 29.707 21.2659 31.2075 21.8371 32.6091C22.4083 34.0107 23.2502 35.286 24.3146 36.362C25.379 37.438 26.645 38.2937 28.0403 38.8802C29.4357 39.4666 30.9329 39.7722 32.4464 39.7796" fill="currentColor"/>
          <path d="M22.0137 0C22.5818 0 23.0429 0.460814 23.043 1.0293V38.5L23.0371 38.6055C22.9843 39.1245 22.5462 39.5293 22.0137 39.5293C21.4457 39.5291 20.9854 39.0684 20.9854 38.5V1.0293C20.9854 0.460941 21.4457 0.000206369 22.0137 0Z" fill="currentColor"/>
          <path d="M53.4429 39.7796C55.7209 39.7892 57.9506 39.1232 59.8502 37.8659C61.7499 36.6086 63.2341 34.8164 64.1155 32.7157C64.9968 30.6151 65.2356 28.3003 64.8018 26.064C64.3679 23.8277 63.2809 21.7701 61.678 20.1515C60.0751 18.5328 58.0283 17.4256 55.7964 16.9698C53.5644 16.514 51.2474 16.7301 49.1382 17.5908C47.029 18.4515 45.2223 19.9181 43.9464 21.8053C42.6705 23.6925 41.9827 25.9155 41.9699 28.1935C41.9609 29.707 42.2502 31.2075 42.8215 32.6091C43.3927 34.0107 44.2346 35.286 45.2989 36.362C46.3633 37.438 47.6294 38.2937 49.0247 38.8802C50.42 39.4666 51.9172 39.7722 53.4308 39.7796" fill="currentColor"/>
          <path d="M42.998 0C43.5662 0 44.0273 0.460809 44.0273 1.0293V38.5L44.0215 38.6055C43.9687 39.1245 43.5306 39.5293 42.998 39.5293C42.4301 39.5291 41.9697 39.0684 41.9697 38.5V1.0293C41.9698 0.460936 42.4301 0.000206372 42.998 0Z" fill="currentColor"/>
          <ellipse cx="6.37831" cy="54.9706" rx="1.0287" ry="1.02941" fill="currentColor"/>
          <ellipse cx="22.0141" cy="17.4999" rx="1.0287" ry="1.02941" fill="currentColor"/>
          <path d="M11.4732 39.7796C13.7512 39.7892 15.9809 39.1232 17.8805 37.8659C19.7801 36.6086 21.2644 34.8164 22.1457 32.7157C23.0271 30.6151 23.2659 28.3003 22.832 26.064C22.3982 23.8277 21.3111 21.7701 19.7083 20.1515C18.1054 18.5328 16.0586 17.4256 13.8266 16.9698C11.5947 16.514 9.27768 16.7301 7.1685 17.5908C5.05932 18.4515 3.25261 19.9181 1.97671 21.8053C0.70082 23.6925 0.0130102 25.9155 0.000205739 28.1935C-0.0088405 29.707 0.280516 31.2075 0.851733 32.6091C1.42295 34.0107 2.26482 35.286 3.32922 36.362C4.39362 37.438 5.65967 38.2937 7.05498 38.8802C8.4503 39.4666 9.94752 39.7722 11.461 39.7796" fill="currentColor"/>
          <path d="M23.043 39.5293H20.9854V17.5H23.043V39.5293Z" fill="currentColor"/>
          <path d="M23.0422 39.5293C23.0422 48.6258 15.6732 55.9999 6.58301 55.9999V53.9411C14.5369 53.9411 20.9848 47.4887 20.9848 39.5293H23.0422Z" fill="currentColor"/>
        </svg>

        {/* Mobile only: two lines + "Built with" stacked below logo */}
        <div className={cn(textCls, 'flex flex-col items-start md:hidden')}>
          <span>© Globo 2026</span>
          <span>Designer person born in Chile. Based in Sydney, NSW</span>
          <span>Built with ♥ and good vibes (coding)</span>
        </div>

        {/* Desktop only: single dash-separated line below logo */}
        <p className={cn(textCls, 'hidden md:block')}>
          © Globo 2026 - Designer person born in Chile. Based in Sydney, NSW
        </p>
      </div>

      {/* Desktop only: tagline (right) */}
      <p className={cn(textCls, 'hidden md:block')}>Built with ♥ and good vibes (coding)</p>
    </div>
  );
}
