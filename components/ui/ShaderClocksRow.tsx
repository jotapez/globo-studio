'use client';

/**
 * ShaderClocksRow — 4 overlapping clock circles with a LiquidMetal shader background
 *
 * Figma: 1643:706
 *
 * Architecture
 * ────────────
 * Each clock face is an `overflow-hidden rounded-full` container. Inside it:
 *   1. LiquidMetal fills the circle (w-full h-full absolute)
 *   2. SVG hands sit on top (w-full h-full absolute, z-10)
 *
 * This is the same pattern used in AboutSectionV2 (LiquidSphere) and avoids
 * the coordinate-system issues of SVG clipPath + CSS transform approaches.
 * Each instance gets the same shader params + frame, so they all look consistent.
 *
 * Overlap
 * ───────
 * Same 40 px technique as ContactFooterV2:
 *   paddingRight: 40px on row + marginRight: -40px on each clock wrapper.
 *
 * Proportional scaling
 * ─────────────────────
 * Each clock is flex-1 + aspect-square — scales with the container width
 * automatically. No fixed sizes, no DOM measurement.
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
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { LiquidMetal } from '@paper-design/shaders-react';
import { cn } from '@/lib/utils';

// ─── constants ────────────────────────────────────────────────────────────────

const CLOCKS = [
  { city: 'Sydney, Australia',     timezone: 'Australia/Sydney'    },
  { city: 'Santiago, Chile',        timezone: 'America/Santiago'    },
  { city: 'Zurich, Switzerland',   timezone: 'Europe/Zurich'       },
  { city: 'Kyoto, Japan',          timezone: 'Asia/Tokyo'          },
] as const;

const OVERLAP       = 40;   // px — 40 px overlap at every breakpoint
const INTRO_DURATION = 2200; // ms

// Shader params — from Paper Design (exported Mar 31 2026, @paper-design/shaders-react@0.0.72)
// https://app.paper.design/file/01KMPY83A0XVK3Q2G7D75K4S01?node=S-0
const SHADER_PROPS = {
  speed:      1,
  softness:   0.1,
  repetition: 2,
  shiftRed:   0.3,
  shiftBlue:  0.3,
  distortion: 0.07,
  contour:    0.4,
  scale:      1,
  rotation:   0,
  shape:      'circle' as const,
  angle:      70,
  frame:      4515.4000000059605,
  colorTint:  '#00000000',
  colorBack:  '#00000000',
} as const;

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

export interface ShaderClocksRowProps {
  /** Extra classes on the root wrapper. */
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export function ShaderClocksRow({ className }: ShaderClocksRowProps) {
  return (
    <div
      className={cn('flex items-start w-full', className)}
      style={{ paddingRight: OVERLAP }}
    >
      {CLOCKS.map((clock, i) => (
        <ClockFace
          key={clock.city}
          timezone={clock.timezone}
          city={clock.city}
          index={i}
          total={CLOCKS.length}
        />
      ))}
    </div>
  );
}

ShaderClocksRow.displayName = 'ShaderClocksRow';

// ─── ClockFace (private) ──────────────────────────────────────────────────────

interface ClockFaceProps {
  timezone: string;
  city: string;
  index: number;
  total: number;
}

function ClockFace({ timezone, city, index, total }: ClockFaceProps) {
  const [phase, setPhase] = useState<'idle' | 'animating' | 'ticking'>('idle');
  const [timeLabel, setTimeLabel] = useState<string | null>(null);

  const rootRef       = useRef<HTMLDivElement>(null);
  const hourHandRef   = useRef<SVGLineElement>(null);
  const minuteHandRef = useRef<SVGLineElement>(null);
  const secondHandRef = useRef<SVGLineElement>(null);
  const rafRef        = useRef<number>(0);

  // One-shot IntersectionObserver: idle → animating
  const observe = useCallback(() => {
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
  }, []);

  useEffect(observe, [observe]);

  // rAF loop — intro animation ('animating') or real-time ticking ('ticking')
  useEffect(() => {
    if (phase === 'idle') return;

    if (phase === 'animating') {
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

  const label    = timeLabel ?? '00:00';
  const cityName = city.split(',')[0].trim();

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={`${city}: ${label}`}
      className="relative flex-1 min-w-0 flex flex-col items-center gap-[var(--clock-gap-mobile)] md:gap-[var(--clock-gap)]"
      style={{ marginRight: -OVERLAP, zIndex: total - index }}
    >
      {/* Circle: shader + hands stacked inside overflow-hidden rounded-full */}
      <div className="relative w-full aspect-square overflow-hidden rounded-full" aria-hidden="true" data-clock-circle="true">

        {/* Shader fills the circle */}
        <LiquidMetal
          {...SHADER_PROPS}
          className="absolute inset-0 w-full h-full"
          aria-hidden={true}
        />

        {/* Hands on top of the shader */}
        <svg
          viewBox="1.5 1.5 97.0 97.0"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full z-10"
        >
          {/* Hour hand */}
          <line
            ref={hourHandRef}
            x1="50" y1="50" x2="50" y2="24"
            stroke="black"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          {/* Minute hand */}
          <line
            ref={minuteHandRef}
            x1="50" y1="50" x2="50" y2="15"
            stroke="black"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          {/* Seconds hand — longest, sweeps fluidly */}
          <line
            ref={secondHandRef}
            x1="50" y1="50" x2="50" y2="12"
            stroke="black"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* City label */}
      <p
        aria-hidden="true"
        className={cn(
          'font-sans [font-weight:var(--text-body-light-weight)] text-center w-full',
          '[font-size:var(--text-body-mobile-size)] [line-height:var(--text-body-mobile-leading)]',
          'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
        )}
      >
        <span className="md:hidden">{cityName}</span>
        <span className="hidden md:inline">{cityName}, {label}</span>
      </p>
    </div>
  );
}
