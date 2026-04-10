'use client';

/**
 * AboutSection — #about section: designer bio + landscape photo
 *
 * Figma: 1599:4626 (about section, nodes 1599:4657 desktop / 1599:4683 mobile)
 *
 * ─── All breakpoints ────────────────────────────────────────────────────────
 * Single centered column (max-w-[1264px] mx-auto).
 * Vertical stack order: heading (w/ shader bg) → bio → photo + caption
 *
 * ─── Desktop/Tablet (≥768px) ────────────────────────────────────────────────
 * pt-200px pb-200px, gap-64px between blocks
 * Heading: h-569px container, LiquidMetal shader behind text (758×569px centered)
 * Heading text: 64px/84px, centered, mixed serif/sans
 * Bio + Photo: max-w-[832px] mx-auto
 * Bio text:   32px/40px (--text-intro-*)
 * Photo:      h-540px, rounded-[26.796px], jpc-home-desktop.png
 * Caption gap: 16px
 *
 * ─── Mobile (<768px) ────────────────────────────────────────────────────────
 * pt-104px pb-104px, gap-32px between blocks
 * Heading: h-296px container, LiquidMetal shader fills container
 * Heading text: 36px/50px
 * Bio: first § 24px/29px, rest 20px/28px
 * Photo: aspect-[326/216], rounded-[10.719px], jpc-home-mobile.png
 * Caption gap: 20px
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
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { LiquidMetal } from '@paper-design/shaders-react';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface AboutSectionProps {
  /** Extra classes on the root <section>. */
  className?: string;
}

// ─── bio content ──────────────────────────────────────────────────────────────

const BIO_INTRO =
  'For most of my 15 years in design, I had a quiet problem with the industry: it kept fragmenting. UX researcher, UI designer, interaction designer, visual designer — each a separate title, each a separate step, each a new layer of coordination between you and the thing you were actually trying to build. The process became the product. And the product suffered.';

const BIO_REST = [
  "I bealive design doesn't move in a straight line through sticky notes and problem statements toward a static prototype that nobody will ever ship exactly as drawn. The best work I've been part of always started somewhere else: with a solution people couldn't stop reacting to. Something obvious in the best way. Something that made a team say that's it before they could explain why.",
  "AI didn't just speed up the old process. It made it obsolete. A working prototype used to cost weeks of alignment. Now it costs an afternoon. That changes everything — not just the tools, but the logic of who does what and how quickly a team can learn from something real. I work from 0 to 1 across strategy, design, and implementation. I prototype in code, test with AI agents, iterate fast, and skip any step that doesn't get us closer to something people will actually love using. Craft and taste matter more now, not less — because anyone can generate a starting point, but not anyone can tell when it's genuinely good.",
  "I'm based in Sydney and working with teams that believe smaller, more autonomous, and more opinionated is better. If you're building something that deserves to be great, I'd like to help make it that way.",
];

// ─── component ────────────────────────────────────────────────────────────────

export const AboutSection = forwardRef<HTMLElement, AboutSectionProps>(
  function AboutSection({ className }, ref) {
    const shouldReduceMotion = useReducedMotion();

    // Heading inView — reverses on scroll back (once: false)
    const innerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(innerRef, { once: true, amount: 0.1 });

    // Each paragraph + photo triggers independently as user scrolls (once: true)
    const para0Ref = useRef<HTMLParagraphElement>(null);
    const para1Ref = useRef<HTMLParagraphElement>(null);
    const para2Ref = useRef<HTMLParagraphElement>(null);
    const para3Ref = useRef<HTMLParagraphElement>(null);
    const isPara0InView = useInView(para0Ref, { once: true, amount: 0.1 });
    const isPara1InView = useInView(para1Ref, { once: true, amount: 0.1 });
    const isPara2InView = useInView(para2Ref, { once: true, amount: 0.1 });
    const isPara3InView = useInView(para3Ref, { once: true, amount: 0.1 });

    // Heading: tight word-by-word stagger (Linear-style blur materialise)
    const headingContainerVariants: Variants = shouldReduceMotion
      ? { hidden: {}, visible: {} }
      : { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

    const headingWordVariants: Variants = shouldReduceMotion
      ? { hidden: {}, visible: {} }
      : {
          hidden: { opacity: 0, y: 10, filter: 'blur(10px)' },
          visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1.0] },
          },
        };

    // Shared blur-materialise for individual paragraphs + photo
    const revealVariants: Variants = shouldReduceMotion
      ? { hidden: {}, visible: {} }
      : {
          hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
          visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1.0] },
          },
        };

    return (
      <section
        ref={ref}
        id="about"
        aria-label="About"
        className={cn(
          'relative bg-[var(--bg-page)] text-[var(--text-primary)]',
          'px-8 md:px-[var(--page-padding-desktop)]',
          className,
        )}
      >
        {/* Zero-height sentinel pinned to the section's top edge.
            Observed by page.tsx for scroll-triggered theme inversion. */}
        <div id="about-sentinel" aria-hidden="true" style={{ position: 'absolute', top: 0, height: 0 }} />

        {/*
         * Inner column — max-w-[1264px] centred (matches Figma desktop content width).
         * Mobile:  pt-104px pb-104px, gap-32px
         * Desktop: pt-200px pb-200px, gap-64px
         */}
        <div
          ref={innerRef}
          className={cn(
            'max-w-[1264px] mx-auto',
            'flex flex-col',
            'gap-0',
            'pt-[64px] md:pt-[80px]',
          )}
        >

          {/* ── [1] Heading + Shader ─────────────────────────────────────────── */}
          {/*
           * Relative container with the LiquidMetal shader as background.
           * Mobile:  h-296px — shader fills the container
           * Desktop: h-569px — shader is 758×569px centred within 1264px column
           * Heading text sits on top (z-10), centred, same mixed serif/sans.
           */}
          <div
            className={cn(
              'relative overflow-hidden',
              'h-[296px] md:h-[569px]',
              'flex items-center justify-center',
            )}
          >
            {/* Shader — mask fades edges to transparent so drifting metaballs never hard-clip */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ maskImage: 'radial-gradient(ellipse 80% 75% at 50% 55%, black 45%, transparent 100%)' }}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.90 }}
              animate={
                shouldReduceMotion
                  ? {}
                  : isInView
                  ? { opacity: 1, scale: 1, y: [0, -14, 0] }
                  : { opacity: 0, scale: 0.90 }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: { duration: 0.6, delay: 0.1, ease: 'easeOut' },
                      scale:   { duration: 0.6, delay: 0.1, ease: 'easeOut' },
                      y: {
                        duration:   4.5,
                        delay:      0.7,
                        ease:       'easeInOut',
                        repeat:     Infinity,
                        repeatType: 'mirror',
                      },
                    }
              }
            >
              <LiquidMetal
                speed={1}
                softness={0.1}
                repetition={2}
                shiftRed={0.3}
                shiftBlue={0.3}
                distortion={0.07}
                contour={0.4}
                scale={0.57}
                rotation={0}
                shape="metaballs"
                angle={70}
                frame={15565694.000000058}
                colorBack="#00000000"
                colorTint="#D2D2D2"
                className="w-full h-full md:w-[758px] md:h-[569px]"
              />
            </motion.div>

            {/* Heading text — word-by-word blur+fade stagger (Linear-style) */}
            <motion.h2
              variants={headingContainerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className={cn(
                'relative z-10 font-normal not-italic w-full text-left md:text-center',
                '[font-size:var(--text-h1-mobile-size)] [line-height:var(--text-h1-mobile-leading)]',
                'md:[font-size:var(--text-h1-size)] md:[line-height:var(--text-h1-leading)]',
                '[letter-spacing:var(--text-h1-tracking)]',
              )}
            >
              <motion.span variants={headingWordVariants} className="font-sans">Rewriting</motion.span>
              <motion.span variants={headingWordVariants} className="font-serif"> the </motion.span>
              <motion.span variants={headingWordVariants} className="font-sans">process</motion.span>
              <motion.span variants={headingWordVariants} className="font-serif"> at the </motion.span>
              <motion.span variants={headingWordVariants} className="font-sans">speed</motion.span>
              <motion.span variants={headingWordVariants} className="font-serif"> of AI.</motion.span>
            </motion.h2>
          </div>

          {/* ── [2] Bio ──────────────────────────────────────────────────────── */}
          {/*
           * Centred at 832px on desktop/tablet; full-width on mobile.
           * Desktop/Tablet: all paragraphs 32px/40px (--text-intro-*)
           * Mobile: first § 24px/29px (--text-intro-mobile-*), rest 20px/28px (--text-intro-sm-*)
           * Inter-paragraph spacing = one line-height of whitespace (mirrors Figma's empty-§ pattern).
           */}
          <div className="w-full md:max-w-[832px] md:mx-auto font-sans font-normal not-italic">
            {/* Paragraph 0 — triggers independently on scroll */}
            <motion.p
              ref={para0Ref}
              variants={revealVariants}
              initial="hidden"
              animate={isPara0InView ? 'visible' : 'hidden'}
              className={cn(
                '[font-size:var(--text-intro-sm-size)] [line-height:var(--text-intro-sm-leading)]',
                'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                'mb-[var(--text-intro-sm-leading)] md:mb-[var(--text-intro-leading)]',
              )}
            >
              {BIO_INTRO}
            </motion.p>

            {/* Paragraph 1 */}
            <motion.p
              ref={para1Ref}
              variants={revealVariants}
              initial="hidden"
              animate={isPara1InView ? 'visible' : 'hidden'}
              className={cn(
                '[font-size:var(--text-intro-sm-size)] [line-height:var(--text-intro-sm-leading)]',
                'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                'mb-[var(--text-intro-sm-leading)] md:mb-[var(--text-intro-leading)]',
              )}
            >
              {BIO_REST[0]}
            </motion.p>

            {/* Paragraph 2 */}
            <motion.p
              ref={para2Ref}
              variants={revealVariants}
              initial="hidden"
              animate={isPara2InView ? 'visible' : 'hidden'}
              className={cn(
                '[font-size:var(--text-intro-sm-size)] [line-height:var(--text-intro-sm-leading)]',
                'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                'mb-[var(--text-intro-sm-leading)] md:mb-[var(--text-intro-leading)]',
              )}
            >
              {BIO_REST[1]}
            </motion.p>

            {/* Paragraph 3 — triggers together with photo */}
            <motion.p
              ref={para3Ref}
              variants={revealVariants}
              initial="hidden"
              animate={isPara3InView ? 'visible' : 'hidden'}
              className={cn(
                '[font-size:var(--text-intro-sm-size)] [line-height:var(--text-intro-sm-leading)]',
                'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
              )}
            >
              {BIO_REST[2]}
            </motion.p>
          </div>

          {/* ── [3] Photo + Caption ──────────────────────────────────────────── */}
          {/*
           * Centred at 832px on desktop/tablet; full-width on mobile.
           * Mobile:  aspect-[326/216] (~218px at 330px width), rounded-[10.719px]
           * Desktop: h-540px, rounded-[26.796px]
           * Caption gap: 20px mobile / 16px desktop
           */}
          <motion.div
            variants={revealVariants}
            initial="hidden"
            animate={isPara3InView ? 'visible' : 'hidden'}
            className={cn(
              'w-full md:max-w-[832px] md:mx-auto',
              'flex flex-col',
              'gap-[20px] md:gap-[16px]',
              'mt-[32px] md:mt-[64px]',
            )}
          >
            {/* Photo */}
            <div className="relative w-full aspect-[326/216] md:aspect-auto md:h-[540px] overflow-hidden rounded-[var(--radius-card-mobile)] md:rounded-[var(--radius-card)]">
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
                sizes="832px"
                priority
              />
            </div>

            {/* Caption */}
            <div
              className={cn(
                'flex flex-col font-sans font-normal not-italic',
                '[font-size:var(--text-caption-mobile-size)] [line-height:var(--text-caption-mobile-leading)]',
                'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
              )}
            >
              <p className="text-[var(--text-primary)] [font-weight:var(--text-body-weight)]">Juan Pablo Castro (in Kyoto)</p>
              <p className="text-[var(--text-muted)] [font-weight:var(--text-body-light-weight)]">Designer person</p>
            </div>
          </motion.div>

        </div>
      </section>
    );
  },
);

AboutSection.displayName = 'AboutSection';
