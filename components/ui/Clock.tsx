'use client';

/**
 * Clock — analogue timezone clock
 *
 * Figma: clock (809:42708) inside Clock section (1012:36154)
 *
 * Layout
 * ──────
 * Circular SVG face (1:1 aspect ratio, fills container width) with hour,
 * minute, and seconds hands. City label centred below in Bricolage Grotesque / Intro-Small.
 *
 * Sizes (controlled by the parent — this component is width-agnostic):
 *   Desktop  392 × 444 px  (face 392 + gap 16 + leading 36)
 *   Tablet   216 × 268 px  (face 216 + gap 16 + leading 36)
 *   Mobile   ~133 × ~169 px (90% of available width, face + gap 4 + leading 32)
 *
 * Theme
 * ─────
 * 'auto'  — follows the CSS token cascade (adapts to light/dark mode).
 * 'light' — forces black strokes/text via --color-black token override.
 * 'dark'  — forces dark appearance via --color-white token override.
 *
 * Hands
 * ─────
 * Hour, minute, and seconds hands. Animated via requestAnimationFrame for
 * sub-second precision and fluid motion. Angle updates are applied directly
 * to SVG element refs — bypassing React re-renders for performance.
 *
 * On scroll into view (IntersectionObserver), hands play a one-shot intro:
 * they start at 12 o'clock, sweep one full revolution with cubic ease-in-out,
 * then settle on the current time. Real-time ticking continues after.
 *
 * Initialised to idle on server — avoids SSR/hydration time mismatch.
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

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { cn } from '@/lib/utils';

// ─── constants ────────────────────────────────────────────────────────────────

const INTRO_DURATION = 2200; // ms

// ─── helpers ──────────────────────────────────────────────────────────────────

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getAngles(timezone: string): { second: number; minute: number; hour: number } {
  const d   = toZonedTime(new Date(), timezone);
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
    // Phase drives which rAF loop is active
    const [phase, setPhase] = useState<'idle' | 'animating' | 'ticking'>('idle');
    // Displayed time string (React state — updates only on minute change to avoid re-renders)
    const [timeLabel, setTimeLabel] = useState<string | null>(null);

    const internalRef   = useRef<HTMLDivElement>(null);
    const hourHandRef   = useRef<SVGLineElement>(null);
    const minuteHandRef = useRef<SVGLineElement>(null);
    const secondHandRef = useRef<SVGLineElement>(null);
    const rafRef        = useRef<number>(0);

    // Merge forwarded ref with internal ref (needed for IntersectionObserver)
    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    // One-shot IntersectionObserver: idle → animating
    useEffect(() => {
      const el = internalRef.current;
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
    }, []);

    // rAF loop — intro animation ('animating') or real-time ticking ('ticking')
    useEffect(() => {
      if (phase === 'idle') return;

      if (phase === 'animating') {
        // Snapshot target angles at animation start
        const target    = getAngles(timezone);
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
          // Update time label only when minute changes (avoids per-frame re-renders)
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
    }, [phase, timezone]);

    const label = timeLabel ?? '00:00';

    // ── theme: map to palette tokens, never raw hex ───────────────────────────
    const clockColor =
      theme === 'dark'  ? 'var(--color-white)'
      : theme === 'light' ? 'var(--color-black)'
      : 'var(--text-primary)'; // 'auto': follows the cascade

    return (
      <div
        ref={setRef}
        role="img"
        aria-label={`${city}: ${label}`}
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
            viewBox="1.5 1.5 97.0 97.0"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            style={{ overflow: 'visible' }}
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
              ref={hourHandRef}
              x1="50" y1="50"
              x2="50" y2="24"
              stroke="var(--clock-color)"
              strokeWidth="0.25"
              strokeLinecap="round"
            />

            {/* Minute hand — longer (35/48.5 ≈ 72 %), thinner */}
            <line
              ref={minuteHandRef}
              x1="50" y1="50"
              x2="50" y2="15"
              stroke="var(--clock-color)"
              strokeWidth="0.25"
              strokeLinecap="round"
            />

            {/* Seconds hand — longest (38/48.5 ≈ 78 %), sweeps fluidly */}
            <line
              ref={secondHandRef}
              x1="50" y1="50"
              x2="50" y2="12"
              stroke="var(--clock-color)"
              strokeWidth="0.25"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ── city label ────────────────────────────────────────────────────── */}
        <p
          aria-hidden="true"
          className={cn(
            'font-sans [font-weight:var(--text-body-light-weight)]',
            // mobile: Body-mobile (14/21), desktop: Body (16/24)
            '[font-size:var(--text-body-mobile-size)] [line-height:var(--text-body-mobile-leading)]',
            'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
            'text-center w-full',
          )}
          style={{ color: 'var(--clock-color)' }}
        >
          {city.split(',')[0].trim()} {label}
        </p>
      </div>
    );
  },
);

Clock.displayName = 'Clock';
