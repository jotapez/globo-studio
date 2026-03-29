'use client';

/**
 * AboutSectionV2 — scroll-driven sphere convergence · alternative about section
 *
 * Design reference: Paper file 01KMM0WVXWC3TRK76KGG7AYE10 · frames 1–3
 *
 * Layout (1728 × 839 canvas, content column centred at left=456 / width=815)
 * ──────────────────────────────────────────────────────────────────────────────
 * Sphere      left=26.4vw  top=17.8vh               size=136px
 * Caption     left=26.4vw  top=calc(17.8vh+160px)   16px / 20px  (8px below sphere)
 * Heading     left=26.4vw  top=calc(17.8vh+256px)   64px serif   (56px below caption)
 * Bio         left=26.4vw  flows after heading       32px sans
 *
 * Animation mechanic
 * ───────────────────
 * 100vh section. useInView (once, amount=0.3) triggers when the section enters
 * the viewport. animate() drives a MotionValue from 0 → 1 over 1.8 s, playing
 * through 3 keyframes:
 *   progress=0:   Frame 1 — spheres visible, spread across viewport
 *   progress=0.5: Frame 2 — spheres moving inward, shrinking
 *   progress=1:   Frame 3 — all converged to one · caption fades in
 *
 * Keyframe positions derived from Paper design (canvas 1728×839):
 *   Convergence point: left=456, top=320 (= COL_LEFT at 26.4vw)
 *   x/y offsets are deltas from convergence point, expressed in vw/vh.
 *   Scale = ball_size / 136 (136px = final convergence size)
 *
 * Caption fades in at progress [0.82, 1.0].
 *
 * Reduced motion
 * ──────────────
 * Static layout: sphere + caption at convergence position, heading + bio below.
 */

import { useRef, useEffect } from 'react';
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { LiquidMetal } from '@paper-design/shaders-react';
import { cn } from '@/lib/utils';

// ─── shader constants ─────────────────────────────────────────────────────────

const SHADER_TINT  = '#FFFFFF';
const SHADER_FRAME = 10084253.7;

// ─── keyframe progress stops ──────────────────────────────────────────────────
//
// 3 stops map directly to the 3 Paper design frames:
//   0   → Frame 1: spheres visible, spread across viewport
//   0.5 → Frame 2: spheres moving inward, shrinking
//   1   → Frame 3: all converged to a single sphere

const KF = [0, 0.5, 1] as const;

// ─── sphere keyframe data ─────────────────────────────────────────────────────
//
// x / y: pixel offsets FROM the convergence point (left=456, top=320 on 1728×839),
//         converted to vw / vh: Δx/1728 and Δy/839.
//         All values reach '0vw' / '0vh' at Frame 3.
//
// scale: ball_size / 136  (136px = final convergence size, from Frame 3 design)
//
// rotate: degrees each sphere spins while converging (0 at Frame 3)

const SPHERES = [
  {
    id: 'ball1',
    // Frame 1: left=182, top=250, size=247  →  offset (-274px, -70px) from convergence
    // Frame 2: left=358, top=319, size=177  →  offset (-98px, -1px)
    x:      ['-15.9vw',  '-5.7vw',  '0vw'],
    y:      ['-8.3vh',   '-0.1vh',  '0vh'],
    scale:  [1.82,        1.30,      1.0],
    rotate: [-90,         -45,        0],
  },
  {
    id: 'ball2',
    // Frame 1: left=984, top=250, size=142  →  offset (+528px, -70px)
    // Frame 2: left=526, top=266, size=186  →  offset (+70px, -54px)
    x:      ['30.6vw',   '4.1vw',   '0vw'],
    y:      ['-8.3vh',   '-6.4vh',  '0vh'],
    scale:  [1.04,        1.37,      1.0],
    rotate: [60,          30,         0],
  },
  {
    id: 'ball3',
    // Frame 1: left=784, top=388, size=200  →  offset (+328px, +68px)
    // Frame 2: left=488, top=346, size=188  →  offset (+32px, +26px)
    x:      ['19.0vw',   '1.9vw',   '0vw'],
    y:      ['8.1vh',    '3.1vh',   '0vh'],
    scale:  [1.47,        1.38,      1.0],
    rotate: [-80,         -40,        0],
  },
  {
    id: 'ball4',
    // Frame 1: left=1201, top=250, size=342  →  offset (+745px, -70px)
    // Frame 2: left=642,  top=266, size=256  →  offset (+186px, -54px)
    x:      ['43.1vw',   '10.8vw',  '0vw'],
    y:      ['-8.3vh',   '-6.4vh',  '0vh'],
    scale:  [2.51,        1.88,      1.0],
    rotate: [120,          60,        0],
  },
] as const;

const FINAL_SIZE = 136;

// ─── position constants ───────────────────────────────────────────────────────

/**
 * Left edge of the centred content column on any viewport.
 * Mirrors `max-width: 815px; margin: 0 auto` with a 20px minimum margin.
 *   1728px → (1728-815)/2 = 456px ≈ 26.4vw  (matches design canvas)
 *    768px → (768-815)/2  = -23px → clamps to 20px
 *    390px → 20px
 */
const COL_LEFT = 'max(20px, calc((100vw - 815px) / 2))';

/** Sphere top: 328/1841 of canvas height. */
const SPHERE_TOP = '17.8vh';

/** Caption starts 16px below sphere bottom. */
const CAPTION_TOP = `calc(${SPHERE_TOP} + ${FINAL_SIZE}px + 16px)`;

// ─── types ────────────────────────────────────────────────────────────────────

export interface AboutSectionV2Props {
  className?: string;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function LiquidSphere({ size }: { size: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-full flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <LiquidMetal
        speed={1}
        softness={0.1}
        repetition={2}
        shiftRed={0.3}
        shiftBlue={0.3}
        distortion={0.07}
        contour={0.4}
        scale={1}
        rotation={0}
        shape="circle"
        angle={70}
        frame={SHADER_FRAME}
        colorBack="#00000000"
        colorTint={SHADER_TINT}
        className="absolute inset-0 w-full h-full"
        aria-hidden={true}
      />
    </div>
  );
}

function AnimatedSphere({
  config,
  progress,
}: {
  config: (typeof SPHERES)[number];
  progress: MotionValue<number>;
}) {
  const x      = useTransform(progress, [...KF], [...config.x]);
  const y      = useTransform(progress, [...KF], [...config.y]);
  const scale  = useTransform(progress, [...KF], [...config.scale]);
  const rotate = useTransform(progress, [...KF], [...config.rotate]);

  return (
    // Outer div handles CSS positioning — keeps complex calc() away from Framer Motion.
    // Inner motion.div handles only transform values (x, y, scale, rotate).
    <div style={{ position: 'absolute', left: COL_LEFT, top: SPHERE_TOP }}>
      <motion.div style={{ x, y, scale, rotate }}>
        <LiquidSphere size={FINAL_SIZE} />
      </motion.div>
    </div>
  );
}

function NameCaption({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <div style={{ position: 'absolute', top: CAPTION_TOP, left: COL_LEFT }}>
    <motion.div
      style={{ opacity }}
      className="flex flex-col font-sans font-normal"
    >
      <span className="text-[var(--text-primary)]" style={{ fontSize: 16, lineHeight: '20px' }}>
        Juan Pablo Castro
      </span>
      <span className="text-[var(--text-secondary)]" style={{ fontSize: 16, lineHeight: '20px' }}>
        Product Designer
      </span>
    </motion.div>
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function AboutSectionV2({ className }: AboutSectionV2Props) {
  const shouldReduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const progress = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: 1.8,
      ease: [0.4, 0, 0.2, 1],
    });
    return () => controls.stop();
  }, [isInView, progress]);

  const nameOpacity = useTransform(progress, [0.82, 1.0], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About"
      className={cn('bg-[var(--bg-page)]', className)}
    >
      {/* Zero-height sentinel — observed by page.tsx for scroll-triggered theme inversion */}
      <div id="about-sentinel" aria-hidden="true" style={{ height: 0 }} />
      {shouldReduceMotion ? (
        /* ── reduced-motion: static layout ─────────────────────────────── */
        <div style={{ position: 'relative', aspectRatio: '1727/660', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: COL_LEFT, top: SPHERE_TOP }}>
            <LiquidSphere size={FINAL_SIZE} />
          </div>
          <div
            style={{ position: 'absolute', top: CAPTION_TOP, left: COL_LEFT }}
            className="flex flex-col font-sans font-normal"
          >
            <span className="text-[var(--text-primary)]" style={{ fontSize: 16, lineHeight: '20px' }}>
              Juan Pablo Castro
            </span>
            <span className="text-[var(--text-secondary)]" style={{ fontSize: 16, lineHeight: '20px' }}>
              Product Designer
            </span>
          </div>
        </div>
      ) : (
        /* ── inView-triggered convergence ───────────────────────────────── */
        <div style={{ position: 'relative', aspectRatio: '1727/660', overflow: 'hidden' }}>
          {SPHERES.map((s) => (
            <AnimatedSphere key={s.id} config={s} progress={progress} />
          ))}
          <NameCaption opacity={nameOpacity} />
        </div>
      )}
    </section>
  );
}

AboutSectionV2.displayName = 'AboutSectionV2';
