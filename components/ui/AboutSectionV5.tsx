'use client';

/**
 * AboutSectionV5 — metaballs LiquidMetal blob above bio column
 *
 * Design reference: Figma globostudio · node 1572:2108
 * Shader reference: paper.design file 01KMPY83A0XVK3Q2G7D75K4S01 · node 7-0
 *
 * shape="metaballs", scale=0.69, no fixed frame (live ambient animation).
 */

import { useReducedMotion } from 'framer-motion';
import { LiquidMetal } from '@paper-design/shaders-react';
import { cn } from '@/lib/utils';

// ─── shader constants ─────────────────────────────────────────────────────────

const SHADER_TINT  = '#FFFFFF';
// No fixed frame — shader runs from live time (ambient animation)

// ─── layout constants ─────────────────────────────────────────────────────────

const COL_LEFT = 'max(20px, calc((100vw - 815px) / 2))';

// ─── bio content ──────────────────────────────────────────────────────────────

const BIO_INTRO =
  'I specialise in crafting human-centred experiences and scalable design systems that bring brands to life across products, services, and digital platforms.';

const BIO_REST = [
  "As a Lead Product Designer at Levo, a leading technology consultancy, I've delivered impactful digital experiences for major clients. I led the Officeworks B2B Digital Experience program, guiding product design from discovery to delivery while establishing their foundational design system and coaching designers on systematic workflows. I also led the product experience design for Taronga Zoo's new website.",
  'Previously at Open Insurance, I drove product design for car and home insurance products from strategy to delivery, while building and governing their design system.',
  "When I'm not designing, you'll find me in sunny Clovelly running, playing guitar, or daydreaming by the water. I'm always up for a coffee, chat, freelance projects, and new opportunities. Please say hello—or hola! :)",
];

// ─── types ────────────────────────────────────────────────────────────────────

export interface AboutSectionV5Props {
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export function AboutSectionV5({ className }: AboutSectionV5Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      aria-label="About"
      className={cn('bg-[var(--bg-page)]', className)}
    >
      {/* Zero-height sentinel — observed by page.tsx for scroll-triggered theme inversion */}
      <div id="about-sentinel" aria-hidden="true" style={{ height: 0 }} />

      <div
        style={{
          paddingLeft: COL_LEFT,
          paddingRight: COL_LEFT,
          paddingTop: 152,
          paddingBottom: 200,
        }}
      >
        <div style={{ maxWidth: 816 }}>

          {/* Shader area — LiquidMetal extends 15% beyond each edge so metaballs
               don't get clipped when they travel to the canvas boundary. */}
          <div
            className="w-full relative overflow-hidden"
            style={{ aspectRatio: '1028 / 771' }}
            aria-hidden="true"
          >
            <LiquidMetal
              speed={shouldReduceMotion ? 0 : 1}
              softness={0.1}
              repetition={2}
              shiftRed={0.3}
              shiftBlue={0.3}
              distortion={0.07}
              contour={0.4}
              scale={0.69}
              rotation={0}
              shape="metaballs"
              angle={70}
              colorBack="#00000000"
              colorTint={SHADER_TINT}
              className="absolute"
              style={{ inset: '-15%' }}
            />
          </div>

          {/* Text */}
          <div style={{ marginTop: 72 }}>

            {/* Heading */}
            <h2
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
      </div>
    </section>
  );
}

AboutSectionV5.displayName = 'AboutSectionV5';
