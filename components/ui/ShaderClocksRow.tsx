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
 */

import { useEffect, useMemo, useState } from 'react';
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

const OVERLAP = 40; // px — 40 px overlap at every breakpoint

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

  const cityName = city.split(',')[0].trim();

  return (
    <div
      role="img"
      aria-label={`${city}: ${timeString}`}
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
          <line
            x1="50" y1="50" x2="50" y2="24"
            stroke="black"
            strokeWidth="0.75"
            strokeLinecap="round"
            transform={`rotate(${hourAngle}, 50, 50)`}
          />
          <line
            x1="50" y1="50" x2="50" y2="15"
            stroke="black"
            strokeWidth="0.75"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle}, 50, 50)`}
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
        <span className="hidden md:inline">{cityName}, {timeString}</span>
      </p>
    </div>
  );
}
