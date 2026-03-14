'use client';

/**
 * Clock — analogue timezone clock
 *
 * Figma: clock (809:42708) inside Clock section (1012:36154)
 *
 * Layout
 * ──────
 * Circular SVG face (1:1 aspect ratio, fills container width) with hour
 * and minute hands. City label centred below in Instrument Serif / H3.
 *
 * Sizes (controlled by the parent — this component is width-agnostic):
 *   Desktop  392 × 444 px  (face 392 + gap 16 + leading 36)
 *   Tablet   216 × 268 px  (face 216 + gap 16 + leading 36)
 *   Mobile   148 × 184 px  (face 148 + gap  4 + leading 32)
 *
 * Theme
 * ─────
 * 'auto'  — follows the CSS token cascade (adapts to light/dark mode).
 * 'light' — forces light appearance via --color-black token override.
 * 'dark'  — forces dark appearance via --color-white token override.
 *
 * Hands
 * ─────
 * Updated every second via setInterval. Hour angle includes minute
 * interpolation (smooth sweep). Minute angle includes second interpolation.
 * Initialised to null on server to avoid SSR/hydration time mismatch.
 *
 * Accessibility
 * ─────────────
 * role="img" with aria-label="[city]: [HH:MM]". Inner SVG and visible
 * city label are aria-hidden — the wrapper aria-label is the single source.
 *
 * Props
 * ─────
 * timezone — IANA timezone string (e.g. "Australia/Sydney")
 * city     — display label shown below the face (e.g. "Sydney, Australia")
 * theme    — colour theme override; default "auto"
 * className — extra classes on the root element
 */

import { forwardRef, useEffect, useMemo, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { cn } from '@/lib/utils';

// ─── helpers ──────────────────────────────────────────────────────────────────

interface Time { h: number; m: number; s: number }

function getZonedTime(tz: string): Time {
  const d = toZonedTime(new Date(), tz);
  return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
}

// ─── types ────────────────────────────────────────────────────────────────────

export interface ClockProps {
  /** IANA timezone identifier, e.g. "Australia/Sydney". */
  timezone: string;
  /** Display label rendered below the clock face, e.g. "Sydney, Australia". */
  city: string;
  /**
   * Colour theme.
   * - `'auto'` (default) — inherits from the CSS token cascade.
   * - `'light'` — forces black strokes/text via `--color-black` token.
   * - `'dark'`  — forces white strokes/text via `--color-white` token.
   */
  theme?: 'auto' | 'light' | 'dark';
  /** Extra classes on the root element. */
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export const Clock = forwardRef<HTMLDivElement, ClockProps>(
  function Clock({ timezone, city, theme = 'auto', className = '' }, ref) {
    // null on first render (SSR) → avoids hydration time mismatch
    const [time, setTime] = useState<Time | null>(null);

    useEffect(() => {
      setTime(getZonedTime(timezone));
      const id = setInterval(() => setTime(getZonedTime(timezone)), 1000);
      return () => clearInterval(id);
    }, [timezone]);

    const { h, m, s } = time ?? { h: 0, m: 0, s: 0 };

    // Smooth sweep: minute hand interpolates seconds, hour hand interpolates minutes
    const minuteAngle = (m / 60) * 360 + (s / 60) * 6;
    const hourAngle   = ((h % 12) / 12) * 360 + (m / 60) * 30;

    // Accessible time string — memoised on [h, m] so it only changes on the minute boundary,
    // preventing unnecessary re-renders and reducing noise for AT users navigating the element.
    const timeString = useMemo(
      () => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      [h, m],
    );

    // ── theme: map to palette tokens, never raw hex ───────────────────────────
    const clockColor =
      theme === 'dark'  ? 'var(--color-white)'
      : theme === 'light' ? 'var(--color-black)'
      : 'var(--text-primary)'; // 'auto': follows the cascade

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${city}: ${timeString}`}
        className={cn(
          'flex flex-col items-center w-full',
          // gap: --clock-gap-mobile (4 px) → --clock-gap (16 px) matches Figma face+label spacing
          'gap-[var(--clock-gap-mobile)] md:gap-[var(--clock-gap)]',
          className,
        )}
        style={{ '--clock-color': clockColor } as React.CSSProperties}
      >
        {/* ── clock face (SVG) ──────────────────────────────────────────────── */}
        <div className="w-full aspect-square" aria-hidden="true">
          <svg
            viewBox="1.375 1.375 97.25 97.25"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Circular face — thin ring */}
            <circle
              cx="50"
              cy="50"
              r="48.5"
              fill="none"
              stroke="var(--clock-color)"
              strokeWidth="0.25"
            />

            {/* Hour hand — shorter (26/48.5 ≈ 53 %), thicker */}
            <line
              x1="50" y1="50"
              x2="50" y2="24"
              stroke="var(--clock-color)"
              strokeWidth="0.25"
              strokeLinecap="round"
              transform={`rotate(${hourAngle}, 50, 50)`}
            />

            {/* Minute hand — longer (35/48.5 ≈ 72 %), thinner */}
            <line
              x1="50" y1="50"
              x2="50" y2="15"
              stroke="var(--clock-color)"
              strokeWidth="0.25"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle}, 50, 50)`}
            />
          </svg>
        </div>

        {/* ── city label ────────────────────────────────────────────────────── */}
        <p
          aria-hidden="true"
          className={cn(
            '[font-family:var(--font-serif)] font-normal not-italic',
            // mobile: H3-mobile (24/32), desktop: H3 (28/36)
            '[font-size:var(--text-h3-mobile-size)] [line-height:var(--text-h3-mobile-leading)]',
            'md:[font-size:var(--text-h3-size)] md:[line-height:var(--text-h3-leading)]',
            'text-center w-full',
          )}
          style={{ color: 'var(--clock-color)' }}
        >
          {city.split(',')[0].trim()} {timeString}
        </p>
      </div>
    );
  },
);

Clock.displayName = 'Clock';
