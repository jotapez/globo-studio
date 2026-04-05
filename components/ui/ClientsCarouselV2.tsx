'use client';

/**
 * ClientsCarouselV2 — card-style infinite horizontal marquee of client logos
 *
 * Figma: 994:43399
 *
 * Layout
 * ──────
 * Each logo is wrapped in a fixed-size rounded card with a --bg-client-logo-card
 * fill. Cards scroll continuously right-to-left. The track is doubled for a
 * seamless loop. Left/right edges fade via CSS mask-image.
 *
 * All dimensions come from CSS tokens (tokens.css) so they respond to
 * breakpoints without Tailwind arbitrary-value generation:
 *   Desktop  258 × 151 px  radius 24 px  gap 16 px  logo area 120 × 72 px
 *   Mobile   171 × 106 px  radius 17 px  gap  8 px  logo area  84 × 50 px
 *
 * Theme
 * ─────
 * 'auto'  — logos grayscale, inverted in dark mode via dark:invert.
 * 'light' — logos grayscale, no invert.
 * 'dark'  — logos grayscale + inverted.
 *
 * Accessibility
 * ─────────────
 * role="region" + aria-label="Client logos". Duplicate set is aria-hidden.
 * Animation pauses for prefers-reduced-motion: reduce.
 */

import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CLIENT_LOGOS } from '@/components/ui/ClientsCarousel';
import type { LogoItem } from '@/components/ui/ClientsCarousel';

// ─── types ────────────────────────────────────────────────────────────────────

export interface ClientsCarouselV2Props {
  /** Logo items to display. Defaults to CLIENT_LOGOS (18 entries). */
  logos?: LogoItem[];
  /**
   * Colour theme.
   * - `'auto'`  (default) — logos invert in dark mode via CSS cascade.
   * - `'light'` — logos stay dark (no invert).
   * - `'dark'`  — logos are inverted.
   */
  theme?: 'auto' | 'light' | 'dark';
  /** Extra classes on the root element. */
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export const ClientsCarouselV2 = forwardRef<HTMLDivElement, ClientsCarouselV2Props>(
  function ClientsCarouselV2({ logos = CLIENT_LOGOS, theme = 'auto', className = '' }, ref) {
    const shouldReduceMotion = useReducedMotion();

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Client logos"
        className={cn('overflow-hidden relative', className)}
        style={{
          height: 'var(--carousel-v2-card-h)',
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
            <CardSlot key={`a-${i}`} logo={logo} theme={theme} />
          ))}

          {/* ── set 2 — duplicate for seamless loop, hidden from AT ── */}
          <div aria-hidden="true" className="contents">
            {logos.map((logo, i) => (
              <CardSlot key={`b-${i}`} logo={logo} theme={theme} />
            ))}
          </div>
        </motion.div>
      </div>
    );
  },
);

ClientsCarouselV2.displayName = 'ClientsCarouselV2';

// ─── card slot ────────────────────────────────────────────────────────────────

interface CardSlotProps {
  logo: LogoItem;
  theme: 'auto' | 'light' | 'dark';
}

function CardSlot({ logo, theme }: CardSlotProps) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width:           'var(--carousel-v2-card-w)',
        height:          'var(--carousel-v2-card-h)',
        borderRadius:    'var(--carousel-v2-card-radius)',
        marginRight:     'var(--carousel-v2-card-gap)',
        backgroundColor: 'var(--bg-client-logo-card)',
      }}
    >
      {/* Inner logo area — constrains logo to Figma-specified dimensions */}
      <div
        className="flex items-center justify-center"
        style={{
          width:  'var(--carousel-v2-logo-w)',
          height: 'var(--carousel-v2-logo-h)',
        }}
      >
        {logo.src ? (
          <img
            src={logo.src}
            alt={logo.name}
            className="w-full h-full object-contain"
            style={{
              filter:
                theme === 'dark'  ? 'grayscale(1) invert(1)' :
                theme === 'light' ? 'grayscale(1)' :
                'var(--carousel-v2-logo-filter)',
              opacity: 'var(--text-muted-alpha)',
              ...(((logo.scaleV2 ?? logo.scale) ?? 1) !== 1 && { transform: `scale(${logo.scaleV2 ?? logo.scale})` }),
            }}
          />
        ) : (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center rounded-sm',
              '[font-family:var(--font-sans)] [font-size:var(--text-xs-size)]',
              'font-medium tracking-[0.08em] uppercase',
            )}
            style={{ border: '1px solid currentColor', opacity: 0.45 }}
          >
            {logo.name}
          </div>
        )}
      </div>
    </div>
  );
}
