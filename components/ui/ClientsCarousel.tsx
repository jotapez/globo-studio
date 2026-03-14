'use client';

/**
 * ClientsCarousel — infinite horizontal marquee of client logos
 *
 * Figma: clients-caroussel (994:1567) inside Clients carousel (1012:36155)
 *
 * Layout
 * ──────
 * Full-width container, 64 px tall on desktop/tablet (--carousel-height) and
 * 48 px on mobile (--carousel-height-mobile). A flex track of logos (64 px tall,
 * --carousel-logo-h) scrolls continuously right-to-left. The track
 * is doubled so the loop is seamless. Left/right edges fade via CSS mask-image.
 * Each logo slot owns its trailing gap (--carousel-logo-gap) via marginRight so
 * the -50% translateX lands exactly at the start of the duplicate set.
 *
 * Theme
 * ─────
 * 'auto'  — mix-blend-mode: luminosity (adapts to page background cascade).
 * 'light' — mix-blend-mode: multiply   (dark logos on a light background).
 * 'dark'  — mix-blend-mode: screen     (light logos on a dark background).
 *
 * Accessibility
 * ─────────────
 * role="region" + aria-label="Client logos". The duplicate set is wrapped in a
 * display:contents element with aria-hidden="true" so AT reads logos once only.
 * Animation pauses for prefers-reduced-motion: reduce (via Framer Motion hook).
 *
 * Logos prop
 * ──────────
 * Accepts a LogoItem[]. When `src` is omitted a styled placeholder block renders
 * so the component is usable before real assets are available.
 */

import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface LogoItem {
  /** Company name — used as img alt text and placeholder label. */
  name: string;
  /** Image source URL. When omitted a placeholder block is rendered. */
  src?: string;
  /** Slot width (px) rendered at the --carousel-logo-h height. */
  width: number;
}

export interface ClientsCarouselProps {
  /**
   * Logo items to display. Defaults to CLIENT_LOGOS (18 entries).
   */
  logos?: LogoItem[];
  /**
   * Colour theme.
   * - `'auto'`  (default) — blend-mode adapts to the CSS token cascade.
   * - `'light'` — blend: multiply for dark logos on a light background.
   * - `'dark'`  — blend: screen for light logos on a dark background.
   */
  theme?: 'auto' | 'light' | 'dark';
  /** Extra classes on the root element. */
  className?: string;
}

// ─── client logos ─────────────────────────────────────────────────────────────

export const CLIENT_LOGOS: LogoItem[] = [
  { name: 'AKQA',               src: '/client-logos/AKQA.svg',             width:  63 },
  { name: 'BCE',                src: '/client-logos/BCE.svg',              width: 113 },
  { name: 'Bupa',               src: '/client-logos/Bupa.svg',             width:  33 },
  { name: 'Coca-Cola',          src: '/client-logos/Coca-Cola.svg',        width:  68 },
  { name: 'Huddle',             src: '/client-logos/Huddle.svg',           width: 103 },
  { name: 'Infrastructure',     src: '/client-logos/Infrastructure.svg',   width: 158 },
  { name: 'NLOA',               src: '/client-logos/NLOA.svg',             width: 124 },
  { name: 'NSW',                src: '/client-logos/NSW.svg',              width:  47 },
  { name: 'NSWEC',              src: '/client-logos/NSWEC.svg',            width: 105 },
  { name: 'Open',               src: '/client-logos/Open.svg',             width:  86 },
  { name: 'Polestar',           src: '/client-logos/Polestar.svg',         width:  71 },
  { name: 'Queensland',         src: '/client-logos/Queensland.svg',       width: 101 },
  { name: 'Taronga',            src: '/client-logos/Taronga.svg',          width: 100 },
  { name: 'Tasmania',           src: '/client-logos/Tasmania.svg',         width: 115 },
  { name: 'Toyota',             src: '/client-logos/Toyota.svg',           width:  93 },
  { name: 'Trove',              src: '/client-logos/Trove.svg',            width:  78 },
  { name: 'ahm',                src: '/client-logos/ahm.svg',              width: 101 },
  { name: 'City of Parramatta', src: '/client-logos/cityofparramatta.svg', width: 121 },
];

/** @deprecated Use CLIENT_LOGOS */
export const PLACEHOLDER_LOGOS = CLIENT_LOGOS;

// ─── component ────────────────────────────────────────────────────────────────

export const ClientsCarousel = forwardRef<HTMLDivElement, ClientsCarouselProps>(
  function ClientsCarousel({ logos = CLIENT_LOGOS, theme = 'auto', className = '' }, ref) {
    const shouldReduceMotion = useReducedMotion();

    const blendMode: React.CSSProperties['mixBlendMode'] =
      theme === 'dark'  ? 'screen'
      : theme === 'light' ? 'multiply'
      : 'luminosity';

    const placeholderColor =
      theme === 'dark'  ? 'var(--color-white)'
      : theme === 'light' ? 'var(--color-black)'
      : 'var(--text-primary)';

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Client logos"
        className={cn('overflow-hidden h-[var(--carousel-height-mobile)] md:h-carousel relative', className)}
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        <motion.div
          className="flex items-center h-full"
          style={{ width: 'max-content' }}
          animate={shouldReduceMotion ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 50, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
          }
        >
          {/* ── set 1 — readable by assistive technology ── */}
          {logos.map((logo, i) => (
            <LogoSlot
              key={`a-${i}`}
              logo={logo}
              blendMode={blendMode}
              placeholderColor={placeholderColor}
              theme={theme}
            />
          ))}

          {/* ── set 2 — duplicate for seamless loop ──
               display:contents preserves the flex layout while aria-hidden
               prevents screen readers from announcing logos twice.          ── */}
          <div aria-hidden="true" className="contents">
            {logos.map((logo, i) => (
              <LogoSlot
                key={`b-${i}`}
                logo={logo}
                blendMode={blendMode}
                placeholderColor={placeholderColor}
                theme={theme}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  },
);

ClientsCarousel.displayName = 'ClientsCarousel';

// ─── logo slot ────────────────────────────────────────────────────────────────

interface LogoSlotProps {
  logo: LogoItem;
  blendMode: React.CSSProperties['mixBlendMode'];
  placeholderColor: string;
  theme: 'auto' | 'light' | 'dark';
}

function LogoSlot({ logo, blendMode, placeholderColor, theme }: LogoSlotProps) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center h-[var(--carousel-logo-h-mobile)] md:h-[var(--carousel-logo-h)]"
      style={{ width: logo.width, marginRight: 'var(--carousel-logo-gap)' }}
    >
      {logo.src ? (
        <img
          src={logo.src}
          alt={logo.name}
          className={cn(
            'h-full w-auto max-w-full object-contain grayscale',
            theme === 'auto' && 'dark:invert',
            theme === 'dark'  && 'invert',
          )}
          style={{ mixBlendMode: blendMode }}
        />
      ) : (
        /* Placeholder block — swap for <img src={logo.src}> when real assets arrive */
        <div
          className={cn(
            'w-full h-full flex items-center justify-center rounded-sm',
            '[font-family:var(--font-sans)] [font-size:var(--text-xs-size)] [line-height:var(--text-xs-leading)]',
            'font-medium tracking-[0.08em] uppercase',
          )}
          style={{
            border: `1px solid ${placeholderColor}`,
            color: placeholderColor,
            opacity: 0.45,
          }}
        >
          {logo.name}
        </div>
      )}
    </div>
  );
}
