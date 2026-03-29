'use client';

/**
 * AboutSection — #about section: designer bio + landscape photo
 *
 * Figma: 1599:4626 (about section, nodes 1599:4657 desktop / 1599:4683 mobile)
 *
 * ─── All breakpoints ────────────────────────────────────────────────────────
 * Single centered column (max-w-[1264px] mx-auto).
 * Vertical stack order: heading → bio → photo + caption
 *
 * ─── Desktop/Tablet (≥768px) ────────────────────────────────────────────────
 * py-164px, gap-64px between blocks
 * Heading: 64px/84px full container width
 * Bio + Photo: max-w-[816px] mx-auto
 * Bio text:   32px/40px (--text-intro-*)
 * Photo:      h-540px, rounded-[27px], jpc-home-desktop.png
 *
 * ─── Mobile (<768px) ────────────────────────────────────────────────────────
 * py-104px, gap-32px between blocks
 * Heading: 36px/50px
 * Bio: first § 24px/29px, rest 20px/28px
 * Photo: h-540px, rounded-[27px], jpc-home-mobile.png
 *
 * ─── Scroll entrance ────────────────────────────────────────────────────────
 * Staggered fade-up: heading (0ms) → bio (100ms) → photo (200ms)
 * y: 40→0, opacity: 0→1, 500ms easeOut.
 * Respects prefers-reduced-motion.
 *
 * Props
 * ─────
 * className — extra classes on the root <section>
 */

import { forwardRef, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface AboutSectionProps {
  /** Extra classes on the root <section>. */
  className?: string;
}

// ─── bio content ──────────────────────────────────────────────────────────────

const BIO_INTRO =
  'I specialise in crafting human-centred experiences and scalable design systems that bring brands to life across products, services, and digital platforms.';

const BIO_REST = [
  "As a Lead Product Designer at Levo, a leading technology consultancy, I've delivered impactful digital experiences for major clients. I led the Officeworks B2B Digital Experience program, guiding product design from discovery to delivery while establishing their foundational design system and coaching designers on systematic workflows. I also led the product experience design for Taronga Zoo's new website.",
  'Previously at Open Insurance, I drove product design for car and home insurance products from strategy to delivery, while building and governing their design system.',
  "When I'm not designing, you'll find me in sunny Clovelly running, playing guitar, or daydreaming by the water. I'm always up for a coffee, chat, freelance projects, and new opportunities. Please say hello—or hola! :)",
];

// ─── component ────────────────────────────────────────────────────────────────

export const AboutSection = forwardRef<HTMLElement, AboutSectionProps>(
  function AboutSection({ className }, ref) {
    const shouldReduceMotion = useReducedMotion();

    const innerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(innerRef, { once: true, amount: 0.1 });

    function fadeUp(delay: number) {
      if (shouldReduceMotion) return {};
      return {
        initial: { opacity: 0, y: 40 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
        transition: { duration: 0.5, ease: 'easeOut' as const, delay },
      };
    }

    return (
      <section
        ref={ref}
        id="about"
        aria-label="About"
        className={cn(
          'relative bg-[var(--bg-page)] text-[var(--text-primary)]',
          'px-[var(--page-padding-mobile)] md:px-[var(--page-padding-desktop)]',
          className,
        )}
      >
        {/* Zero-height sentinel pinned to the section's top edge.
            Observed by page.tsx for scroll-triggered theme inversion. */}
        <div id="about-sentinel" aria-hidden="true" style={{ position: 'absolute', top: 0, height: 0 }} />

        {/*
         * Inner column — max-w-[1264px] centred (matches Figma desktop content width).
         * Mobile:  py-104px, gap-32px
         * Desktop: py-164px, gap-64px
         */}
        <div
          ref={innerRef}
          className={cn(
            'max-w-[1264px] mx-auto',
            'flex flex-col',
            'gap-8 md:gap-16',
            'pt-[132px] md:pt-[240px]',
          )}
        >

          {/* ── [1] Heading ──────────────────────────────────────────────────── */}
          {/*
           * Full container width (1264px desktop / fluid mobile).
           * Mixed serif/sans — same pattern on all breakpoints:
           *   sans: "Rewriting", "process", "speed"
           *   serif: " the ", " right now at the ", " of AI."
           */}
          <motion.h2
            {...fadeUp(0)}
            className={cn(
              'font-normal not-italic w-full text-center',
              '[font-size:var(--text-h1-mobile-size)] [line-height:var(--text-h1-mobile-leading)]',
              'md:[font-size:var(--text-h1-size)] md:[line-height:var(--text-h1-leading)]',
              'mb-[72px] md:mb-[100px]',
            )}
          >
            <span className="font-sans">Rewriting</span>
            <span className="font-serif"> the </span>
            <span className="font-sans">process</span>
            <span className="font-serif"> at the </span>
            <span className="font-sans">speed</span>
            <span className="font-serif"> of AI.</span>
          </motion.h2>

          {/* ── [2] Bio ──────────────────────────────────────────────────────── */}
          {/*
           * Centred at 816px on desktop/tablet; full-width on mobile.
           * Desktop/Tablet: all paragraphs 32px/40px (--text-intro-*)
           * Mobile: first § 24px/29px (--text-intro-mobile-*), rest 20px/28px (--text-intro-sm-*)
           * Inter-paragraph spacing = one line-height of whitespace (mirrors Figma's empty-§ pattern).
           */}
          <motion.div
            {...fadeUp(0.1)}
            className="w-full md:max-w-[816px] md:mx-auto font-sans font-normal not-italic"
          >
            {/* First paragraph — larger on mobile */}
            <p
              className={cn(
                '[font-size:var(--text-intro-mobile-size)] [line-height:var(--text-intro-mobile-leading)]',
                'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                'mb-[var(--text-intro-mobile-leading)] md:mb-[var(--text-intro-leading)]',
              )}
            >
              {BIO_INTRO}
            </p>

            {/* Remaining paragraphs */}
            {BIO_REST.map((paragraph, i) => (
              <p
                key={i}
                className={cn(
                  '[font-size:var(--text-intro-sm-size)] [line-height:var(--text-intro-sm-leading)]',
                  'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                  i < BIO_REST.length - 1 &&
                    'mb-[var(--text-intro-sm-leading)] md:mb-[var(--text-intro-leading)]',
                )}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* ── [3] Photo + Caption ──────────────────────────────────────────── */}
          {/*
           * Centred at 816px on desktop/tablet; full-width on mobile.
           * Photo container: fixed 540px height, overflow-hidden, rounded-[27px].
           * Two images — each hidden at the opposite breakpoint:
           *   Mobile (<md):   jpc-home-mobile.png  object-center
           *   Desktop/tablet: jpc-home-desktop.png  object-[60%_60%]
           * Caption gap: 20px desktop / 8px mobile (--about-caption-gap-mobile).
           */}
          <motion.div
            {...fadeUp(0.2)}
            className={cn(
              'w-full md:max-w-[816px] md:mx-auto',
              'flex flex-col',
              'gap-[var(--about-caption-gap-mobile)] md:gap-[20px]',
            )}
          >
            {/* Photo */}
            <div className="relative w-full h-[540px] overflow-hidden rounded-[27px]">
              {/* Mobile image */}
              <Image
                src="/Homepage/jpc-home-mobile.png"
                alt="Juan Pablo Castro by the Kamo River in Kyoto"
                fill
                className="object-cover object-center md:hidden"
                sizes="100vw"
              />
              {/* Desktop / tablet image */}
              <Image
                src="/Homepage/jpc-home-desktop.png"
                alt="Juan Pablo Castro by the Kamo River in Kyoto"
                fill
                className="object-cover object-[60%_60%] hidden md:block"
                sizes="816px"
                priority
              />
            </div>

            {/* Caption */}
            <div
              className={cn(
                'flex flex-col font-sans font-normal not-italic',
                '[font-size:var(--text-body-size)] [line-height:var(--text-body-leading)]',
              )}
            >
              <p className="text-[var(--text-primary)]">Juan Pablo Castro</p>
              <p className="text-[var(--text-muted)]">Product Designer</p>
            </div>
          </motion.div>

        </div>
      </section>
    );
  },
);

AboutSection.displayName = 'AboutSection';
