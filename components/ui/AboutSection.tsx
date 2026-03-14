'use client';

/**
 * AboutSection — #about section: designer bio + portrait
 *
 * Figma: about (1014:1372)
 *   Desktop  1664 × 1614   node 1014:1760
 *   Tablet    960 × 2053   node 1014:1758
 *   Mobile    353 × 1429   node 1014:1759
 *
 * ─── Desktop (≥1024px) ──────────────────────────────────────────────────────
 * flex-row items-start justify-between, py-200px
 *   Left col  816px  flex-col gap-246px
 *     heading: Instrument Serif ~67px, "process" → Helvetica Neue
 *     bio:     Helvetica Neue 32px / 40px
 *   Right col 533px  flex-col gap-16px
 *     photo:   aspect-[1500/1615] rounded-40px
 *     caption: Helvetica Neue 16px / 24px
 *
 * ─── Tablet (768–1023px) ────────────────────────────────────────────────────
 * flex-col gap-80px, py-200px
 *   Row 1 full-width justify-end → inner box 464px
 *     photo:   aspect-[1500/1615] rounded-40px
 *     caption: 16px / 24px, gap-16px
 *   Row 2 full-width flex-col gap-48px, max-w-[816px]
 *     heading + bio (same sizes as desktop)
 *
 * ─── Mobile (<768px) ────────────────────────────────────────────────────────
 * flex-col gap-32px, py-100px
 *   Photo block  flex-col gap-8px
 *     photo:   h-380px clip + aspect-[1500/1615] rounded-24px
 *     caption: Helvetica Neue 14px / 21px
 *   Text block   flex-col gap-24px
 *     heading: Helvetica Neue 40px / 54px, "the" + "right now" → Instrument Serif
 *     bio:     first § 24px/29px · rest 16px/21px
 *
 * ─── Scroll entrance ────────────────────────────────────────────────────────
 * Photo:  x 60px→0, opacity 0→1, 500ms
 * Text:   x -40px→0, opacity 0→1, 500ms, delay 150ms
 * Respects prefers-reduced-motion (null treated as "reduce").
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
    const isInView = useInView(innerRef, { once: true, amount: 0.15 });

    const textAnim = shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, x: -40 },
          animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 },
          transition: { duration: 0.5, ease: 'easeOut' as const, delay: 0.15 },
        };

    const photoAnim = shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, x: 60 },
          animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 },
          transition: { duration: 0.5, ease: 'easeOut' as const },
        };

    return (
      <section
        id="about"
        ref={ref}
        aria-label="About"
        className={cn(
          'bg-[var(--bg-page)] text-[var(--text-primary)]',
          'px-[var(--page-padding-mobile)] md:px-[var(--page-padding-desktop)]',
          'pt-[104px] md:pt-[var(--section-padding-top-desktop)] pb-0',
          className,
        )}
      >
        {/* Zero-height sentinel — observed by page.tsx for scroll-triggered theme inversion */}
        <div id="about-sentinel" aria-hidden="true" style={{ height: 0 }} />
        <div ref={innerRef} className="w-full max-w-desktop mx-auto">

          {/*
           * ── Outer column container ────────────────────────────────────────
           * Mobile:  flex-col  gap-32px
           * Tablet:  flex-col  gap-80px
           * Desktop: flex-row  justify-between  items-start
           */}
          <div
            className={cn(
              'flex flex-col',
              'gap-[var(--card-gap)]',
              'md:gap-[var(--intro-section-gap)]',
              'lg:flex-row lg:items-start lg:justify-between lg:gap-0',
            )}
          >

            {/* ── Photo column ─────────────────────────────────────────────
             * DOM order 1 → renders above text on mobile + tablet.
             * Desktop: pushed right via lg:order-2.
             * Tablet:  full-width outer div with justify-end → right-aligns
             *          the 464px inner box.
             * Desktop: outer div auto-sized; inner div 533px (inherits parent).
             */}
            <motion.div
              {...photoAnim}
              className={cn(
                'order-1 lg:order-2',
                // Mobile: full width, no alignment
                // Tablet: full width outer, justify-end right-aligns the inner box
                // Desktop: auto width (inner box is 533px)
                'w-full',
                'md:flex md:justify-end',
                'lg:block lg:w-auto lg:flex-shrink-0',
              )}
            >
              {/*
               * Inner sized box
               * Mobile:  full-width   (353px)
               * Tablet:  464px fixed
               * Desktop: 533px fixed
               */}
              <div
                className={cn(
                  'flex flex-col',
                  // Mobile caption gap: 8px
                  'gap-[var(--about-caption-gap-mobile)]',
                  // Tablet+ caption gap: 16px
                  'md:gap-[var(--about-caption-gap)]',
                  'w-full',
                  'md:w-[var(--about-photo-width-tablet)]',
                  'lg:w-[var(--about-photo-width-desktop)]',
                )}
              >

                {/*
                 * Photo
                 * Mobile:  outer wrapper clips photo to h-380px, rounded-24px
                 * Tablet+: aspect ratio drives height, rounded-40px
                 */}
                <div
                  className={cn(
                    // Mobile: fixed-height clip container
                    'h-[var(--about-photo-height-mobile)] overflow-hidden',
                    'rounded-[var(--radius-card-mobile)]',
                    // Tablet+: natural aspect ratio, larger radius
                    'md:h-auto md:aspect-[1500/1615]',
                    'md:rounded-[var(--radius-card)]',
                    'relative w-full',
                  )}
                >
                  <Image
                    src="/portrait-jp.png"
                    alt="Juan Pablo Castro smiling, wearing a black sweater"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 464px, 533px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Caption */}
                <div
                  className={cn(
                    'flex flex-col font-sans font-normal not-italic',
                    // Mobile: sm (14px / 21px)
                    '[font-size:var(--text-sm-size)] [line-height:var(--text-sm-leading)]',
                    // Tablet+: body (16px / 24px)
                    'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
                  )}
                >
                  <p className="text-[var(--text-primary)]">Juan Pablo Castro</p>
                  <p className="text-[var(--text-secondary)]">Senior Product Designer</p>
                </div>

              </div>
            </motion.div>

            {/* ── Text column ──────────────────────────────────────────────
             * DOM order 2 → renders below photo on mobile + tablet.
             * Desktop: pushed left via lg:order-1.
             *
             * Internal gap between heading and bio:
             *   Mobile:  24px  (--about-text-gap-mobile)
             *   Tablet:  48px  (--card-gap-mobile)
             *   Desktop: 246px (--about-heading-bio-gap-desktop)
             */}
            <motion.div
              {...textAnim}
              className={cn(
                'order-2 lg:order-1',
                'w-full lg:w-[var(--about-text-col-width)] lg:flex-shrink-0',
              )}
            >
              <div
                className={cn(
                  'flex flex-col',
                  'gap-[var(--about-text-gap-mobile)]',
                  'md:gap-[var(--card-gap-mobile)]',
                  'lg:gap-[var(--about-heading-bio-gap-desktop)]',
                )}
              >

                {/*
                 * Heading — "Rewriting the process right now"
                 * Mixed serif/sans, pattern differs by breakpoint:
                 *   Mobile:         sans base · "the" + "right now" = serif
                 *   Tablet/Desktop: serif base · "process" = sans
                 *
                 * Font size:
                 *   Mobile:         40px / 54px (--text-h1-mobile-*)
                 *   Tablet/Desktop: ~67px / normal → use --text-h1-size (64px) as token
                 *
                 * Tablet: heading sits inside a full-width column but is visually
                 *   capped at 816px (matching Figma) via max-w.
                 */}
                <h2
                  className={cn(
                    'font-normal not-italic w-full',
                    '[font-size:var(--text-h1-mobile-size)] [line-height:var(--text-h1-mobile-leading)]',
                    'md:[font-size:var(--text-h1-size)] md:[line-height:var(--text-h1-leading)]',
                    'md:max-w-[var(--about-text-col-width)]',
                  )}
                >
                  {/* Mobile: sans · Tablet/Desktop: serif */}
                  <span className="font-sans md:font-serif">{'Rewriting '}</span>
                  {/* Always serif */}
                  <span className="font-serif">{'the '}</span>
                  {/* Always sans — accent word */}
                  <span className="font-sans">process</span>
                  {/* Always serif */}
                  <span className="font-serif">{' right now'}</span>
                </h2>

                {/*
                 * Bio
                 * Desktop/Tablet: all Helvetica Neue 32px / 40px
                 * Mobile:
                 *   First §  24px / 29px  (--text-intro-mobile-*)
                 *   Rest §   16px / 21px  (--text-intro-sm-mobile-*)
                 *
                 * Paragraph spacing = line-height of the text (mirrors Figma's
                 * empty-paragraph spacer pattern: one full leading of whitespace).
                 *   Desktop: mb = --text-intro-leading (40px)
                 *   Mobile:  mb = --text-intro-sm-mobile-leading (21px)
                 *
                 * Tablet: capped at 816px via max-w.
                 */}
                <div
                  className={cn(
                    'font-sans font-normal not-italic w-full md:max-w-[816px]',
                  )}
                >
                  {/* First paragraph — larger on mobile */}
                  <p
                    className={cn(
                      '[font-size:var(--text-intro-mobile-size)] [line-height:var(--text-intro-mobile-leading)]',
                      'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                      'mb-[var(--text-intro-sm-mobile-leading)] md:mb-[var(--text-intro-leading)]',
                    )}
                  >
                    {BIO_INTRO}
                  </p>

                  {/* Remaining paragraphs */}
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
            </motion.div>

          </div>
        </div>
      </section>
    );
  },
);

AboutSection.displayName = 'AboutSection';
