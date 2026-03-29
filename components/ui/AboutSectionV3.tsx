'use client';

/**
 * AboutSectionV3 — sphere animation + bio, no portrait photo, centered column
 *
 * Design reference: Figma globostudio · node 1572:1471
 *
 * Layout
 * ──────
 * [Animation area]  aspect-ratio 1727:660, full width
 * [Bio section]     pt-[162px] · centered 815px column
 *   LiquidSphere 136px
 *   ↓ 16px
 *   "Juan Pablo Castro"   16px / 24px  --text-primary
 *   ↓ 24px
 *   "Product Designer"    16px / 24px  --text-secondary
 *   ↓ 68px
 *   h2 heading            --text-h1-size tokens
 *   ↓ 56px
 *   Bio paragraphs        --text-intro-size tokens
 *
 * Animation mechanic
 * ──────────────────
 * useInView (once, amount=0.3) fires when the section enters the viewport.
 * animate() drives a MotionValue 0 → 1 over 1.8 s through 3 keyframes:
 *   progress=0:   Frame 1 — spheres spread across viewport
 *   progress=0.5: Frame 2 — spheres moving inward, shrinking
 *   progress=1:   Frame 3 — all converged
 * No NameCaption in the animation area — name lives in the bio section below.
 *
 * Keyframe positions derived from Paper design (canvas 1728×839):
 *   Convergence point: left=456, top=320 (= COL_LEFT at 26.4vw)
 *   x/y offsets are deltas from convergence point, expressed in vw/vh.
 *   Scale = ball_size / 136 (136px = final convergence size)
 *
 * Reduced motion
 * ──────────────
 * Static: single sphere at convergence position above the bio.
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

const KF = [0, 0.5, 1] as const;

// ─── sphere keyframe data ─────────────────────────────────────────────────────
//
// x / y: pixel offsets FROM the convergence point (left=456, top=320 on 1728×839),
//         converted to vw / vh: Δx/1728 and Δy/839.
// scale: ball_size / 136  (136px = final convergence size)
// rotate: degrees each sphere spins while converging (0 at Frame 3)

const SPHERES = [
  {
    id: 'ball1',
    // Frame 1: left=182, top=250, size=247  →  offset (-274px, -70px)
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

const COL_LEFT   = 'max(20px, calc((100vw - 815px) / 2))';
/**
 * Sphere convergence position from section top.
 * Must be large enough so Frame-1 balls (largest: scale=2.51, y=-8.3vh)
 * don't clip at the section's top edge when it sits at the viewport top.
 * Minimum ≈ 8.3vh + 103px (scale overhang) + 80px buffer.
 * 280px satisfies this across common viewport heights (768–1600px).
 */
const SPHERE_TOP = '280px';

// ─── bio content ──────────────────────────────────────────────────────────────

const BIO_INTRO =
  'I specialise in crafting human-centred experiences and scalable design systems that bring brands to life across products, services, and digital platforms.';

const BIO_REST = [
  "As a Lead Product Designer at Levo, a leading technology consultancy, I've delivered impactful digital experiences for major clients. I led the Officeworks B2B Digital Experience program, guiding product design from discovery to delivery while establishing their foundational design system and coaching designers on systematic workflows. I also led the product experience design for Taronga Zoo's new website.",
  'Previously at Open Insurance, I drove product design for car and home insurance products from strategy to delivery, while building and governing their design system.',
  "When I'm not designing, you'll find me in sunny Clovelly running, playing guitar, or daydreaming by the water. I'm always up for a coffee, chat, freelance projects, and new opportunities. Please say hello—or hola! :)",
];

// ─── types ────────────────────────────────────────────────────────────────────

export interface AboutSectionV3Props {
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
    <div style={{ position: 'absolute', left: COL_LEFT, top: SPHERE_TOP }}>
      <motion.div style={{ x, y, scale, rotate }}>
        <LiquidSphere size={FINAL_SIZE} />
      </motion.div>
    </div>
  );
}

// Sphere top (162px) + sphere height (136px) + gap to name (16px) = 314px
const BIO_PADDING_TOP = `calc(${SPHERE_TOP} + ${FINAL_SIZE}px + 16px)`;

function BioSection() {
  return (
    <div
      style={{
        paddingTop: BIO_PADDING_TOP,
        paddingLeft: COL_LEFT,
        paddingRight: COL_LEFT,
        paddingBottom: 200,
      }}
    >
      <div style={{ maxWidth: 815 }}>

        {/* Name */}
        <div className="font-sans font-normal not-italic">
          <p
            className="text-[var(--text-primary)]"
            style={{ fontSize: 16, lineHeight: '24px' }}
          >
            Juan Pablo Castro
          </p>
          <p
            className="text-[var(--text-secondary)]"
            style={{ fontSize: 16, lineHeight: '24px' }}
          >
            Product Designer
          </p>
        </div>

        {/* Heading */}
        <h2
          style={{ marginTop: 68 }}
          className={cn(
            'font-normal not-italic text-[var(--text-primary)] w-full',
            '[font-size:var(--text-h1-mobile-size)] [line-height:var(--text-h1-mobile-leading)]',
            'md:[font-size:var(--text-h1-size)] md:[line-height:var(--text-h1-leading)]',
          )}
        >
          <span className="font-sans md:font-serif">{'Rewriting '}</span>
          <span className="font-serif">{'the '}</span>
          <span className="font-sans">process</span>
          <span className="font-serif">{' right now'}</span>
        </h2>

        {/* Bio */}
        <div
          style={{ marginTop: 56 }}
          className="font-sans font-normal not-italic text-[var(--text-primary)]"
        >
          <p
            className={cn(
              '[font-size:var(--text-intro-mobile-size)] [line-height:var(--text-intro-mobile-leading)]',
              'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
              'mb-[var(--text-intro-sm-mobile-leading)] md:mb-[var(--text-intro-leading)]',
            )}
          >
            {BIO_INTRO}
          </p>
          {BIO_REST.map((paragraph, i) => (
            <p
              key={i}
              className={cn(
                '[font-size:var(--text-intro-sm-mobile-size)] [line-height:var(--text-intro-sm-mobile-leading)]',
                'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                i < BIO_REST.length - 1 &&
                  'mb-[var(--text-intro-sm-mobile-leading)] md:mb-[var(--text-intro-leading)]',
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function AboutSectionV3({ className }: AboutSectionV3Props) {
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

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About"
      className={cn('bg-[var(--bg-page)]', className)}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Zero-height sentinel — observed by page.tsx for scroll-triggered theme inversion */}
      <div id="about-sentinel" aria-hidden="true" style={{ height: 0 }} />

      {/*
       * Sphere layer — absolutely positioned so it doesn't push the bio down.
       * The section height is determined by BioSection (normal flow).
       * overflow:hidden on the section clips spheres that spread beyond viewport width.
       */}
      <div
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {shouldReduceMotion ? (
          /* ── reduced-motion: single static sphere ────────────────────── */
          <div style={{ position: 'absolute', left: COL_LEFT, top: SPHERE_TOP }}>
            <LiquidSphere size={FINAL_SIZE} />
          </div>
        ) : (
          /* ── inView-triggered convergence ────────────────────────────── */
          <>
            {SPHERES.map((s) => (
              <AnimatedSphere key={s.id} config={s} progress={progress} />
            ))}
          </>
        )}
      </div>

      {/* Bio content — in normal flow, sets the section height */}
      <BioSection />
    </section>
  );
}

AboutSectionV3.displayName = 'AboutSectionV3';
