'use client';

/**
 * IntroSection — #intro section: large mixed-type heading + client carousel
 *
 * Figma: intro/heading+carousel (1014:821)
 *   Desktop  1664 × 951   node 1014:1368
 *   Tablet    960 × 1035  node 1014:1369
 *   Mobile    393 × 771   node 1014:1370
 *
 * Layout
 * ──────
 * Fills min-h-svh, content vertically centred. Two stacked rows separated by
 * an 80px gap:
 *   1. Heading — large mixed-font paragraph (Instrument Serif + Helvetica Neue)
 *   2. Carousel — <ClientsCarousel /> full width, infinite horizontal loop
 *
 * Typography
 * ──────────
 * The heading alternates between font-sans (Helvetica Neue) for brand/emphasis
 * words and font-serif (Instrument Serif) for prose connectors — matching the
 * Figma mixed-typeface pattern. "Juan Pablo Castro" is underlined.
 * Desktop: --text-h1-size / --text-h1-leading (64px / 84px)
 * Mobile:  --text-h1-mobile-size / --text-h1-mobile-leading (40px / 54px)
 *
 * Text width
 * ──────────
 * Heading block is capped at 1266px and centred within the content area.
 * At tablet (960px) and mobile this cap is not reached so it's effectively
 * full width — matching the Figma layout at all breakpoints.
 *
 * Scroll entrance animation
 * ─────────────────────────
 * Text fades + slides up first; carousel follows 200ms later.
 * Respects prefers-reduced-motion via useReducedMotion().
 *
 * Dark mode
 * ─────────
 * All color tokens auto-respond to `.dark` on <html> via tokens.css.
 * `theme` prop is forwarded to <ClientsCarousel> for blend-mode control.
 *
 * Props
 * ─────
 * theme     — forwarded to <ClientsCarousel> for blend-mode theming. Default: 'auto'
 * className — extra classes on the root <section>
 */

import { forwardRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ClientsCarousel } from '@/components/ui/ClientsCarousel';
import { ClientsCarouselV2 } from '@/components/ui/ClientsCarouselV2';

// ─── types ────────────────────────────────────────────────────────────────────

export interface IntroSectionProps {
  /** Forwarded to the carousel for blend-mode theming. Default: 'auto' */
  theme?: 'auto' | 'light' | 'dark';
  /** Which carousel variant to render. Default: 'v1' */
  carouselVariant?: 'v1' | 'v2';
  /** Extra classes on the root <section>. */
  className?: string;
}

// ─── shared span class builders ───────────────────────────────────────────────

const sans = 'font-sans';
const serif = 'font-serif';

// ─── component ────────────────────────────────────────────────────────────────

export const IntroSection = forwardRef<HTMLElement, IntroSectionProps>(
  function IntroSection({ theme = 'auto', carouselVariant = 'v1', className }, ref) {
    const shouldReduceMotion = useReducedMotion();
    const [nameHovered, setNameHovered] = useState(false);

    // Cursor tracking for portrait hover effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 150, damping: 18, mass: 0.5 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 18, mass: 0.5 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);       // left edge at cursor
      mouseY.set(e.clientY - rect.top - 330);  // bottom edge at cursor
    };

    // Ref for inView trigger — separate from the forwarded ref
    const innerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(innerRef, { once: true, amount: 0.2 });

    const containerVariants: Variants = shouldReduceMotion
      ? { hidden: {}, visible: {} }
      : {
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.06,
              delayChildren: 0,
            },
          },
        };

    const wordVariants: Variants = shouldReduceMotion
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

    const nameVariants: Variants = shouldReduceMotion
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

    const carouselAnim = shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
          transition: { duration: 0.5, ease: 'easeOut' as const, delay: 0.2 },
        };

    return (
      <section
        id="intro"
        ref={ref}
        aria-label="Intro"
        className={cn(
          'min-h-svh flex flex-col justify-center',
          'bg-[var(--bg-page)] text-[var(--text-primary)]',
          'pt-[var(--intro-padding-top-mobile)] pb-[var(--page-padding-mobile)]',
          'md:pt-[var(--intro-padding-top-desktop)] md:pb-[var(--page-padding-desktop)]',
          className,
        )}
      >
        {/* Zero-height sentinel — observed by page.tsx for scroll-triggered theme inversion */}
        <div id="intro-sentinel" aria-hidden="true" style={{ height: 0 }} />
        {/* Inner wrapper — owns horizontal padding + max content width */}
        <div
          ref={innerRef}
          onMouseMove={handleMouseMove}
          className={cn(
            'relative flex flex-col gap-[var(--intro-section-gap-mobile)] md:gap-[var(--intro-section-gap)]',
            'w-full max-w-desktop mx-auto',
            'px-[var(--page-padding-mobile)] md:px-[var(--page-padding-desktop)]',
          )}
        >

          {/* Portrait — follows cursor with spring physics, behind heading text */}
          <AnimatePresence>
            {!shouldReduceMotion && nameHovered && (
              <motion.div
                key="designer-photo"
                aria-hidden="true"
                className="absolute z-0 top-0 left-0 hidden md:block"
                style={{ x: springX, y: springY }}
                initial={{ scale: 0.85, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.85, opacity: 0, rotate: 4 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Image
                  src="/portrait-jp.png"
                  alt=""
                  width={254}
                  height={330}
                  className="object-cover object-top rounded-[24px] cursor-pointer"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 1. Heading ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}

            className="relative z-10 w-full px-[14px] md:px-0"
          >
            {/*
             * Page-level h1 — visually hidden so it does not appear in the design
             * but satisfies WCAG 2.4.6 and gives screen readers a document title.
             */}
            <h1 className="sr-only">Globo Studio — Juan Pablo Castro, Senior Product Designer</h1>
            <h2
              className={cn(
                // Base text — serif fallback; individual spans override family
                'font-serif font-normal not-italic text-left md:text-center',
                '[font-size:var(--text-h1-mobile-size)] [line-height:var(--text-h1-mobile-leading)]',
                'md:[font-size:var(--text-h1-size)] md:[line-height:var(--text-h1-leading)]',
                '[letter-spacing:var(--text-h1-tracking)]',
                // Cap heading width at var(--content-width-heading) — centred
                'max-w-[var(--content-width-heading)] mx-auto',
              )}
            >
              {/* "G'day." — serif, own line via block display */}
              <span className="block"><motion.span variants={wordVariants} className={serif}>G&apos;day.</motion.span></span>

              {/* Body sentence with alternating typefaces */}
              <motion.span variants={wordVariants} className={sans}>Globo</motion.span>
              <motion.span variants={wordVariants} className={serif}> is a </motion.span>
              <motion.span variants={wordVariants} className={sans}>design</motion.span>
              <motion.span variants={wordVariants} className={serif}> studio </motion.span>
              <motion.span variants={wordVariants} className={sans}>orchestrated</motion.span>
              <motion.span variants={wordVariants} className={serif}> by </motion.span>

              {/*
               * <motion.button> makes this interactive for keyboard + screen reader users.
               * onFocus/onBlur mirror the hover portrait so the effect is reachable
               * via Tab navigation.
               */}
              <motion.button
                variants={nameVariants}
                type="button"
                aria-label="Go to About section — Juan Pablo Castro"
                className={cn(
                  sans,
                  'font-medium underline underline-offset-[calc(0.15em+4px)] decoration-[1px]',
                  'relative z-20 bg-transparent border-none p-0 cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 rounded-sm',
                )}
                onMouseEnter={() => setNameHovered(true)}
                onMouseLeave={() => setNameHovered(false)}
                onFocus={() => setNameHovered(true)}
                onBlur={() => setNameHovered(false)}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Juan Pablo Castro
              </motion.button>

              <motion.span variants={wordVariants} className={serif}> — where </motion.span>
              <motion.span variants={wordVariants} className={sans}>strategy</motion.span>
              <motion.span variants={wordVariants} className={serif}> and </motion.span>
              <motion.span variants={wordVariants} className={sans}>craft</motion.span>
              <motion.span variants={wordVariants} className={serif}> move at the </motion.span>
              <span className="whitespace-nowrap md:whitespace-normal">
                <motion.span variants={wordVariants} className={sans}>speed</motion.span>
                <motion.span variants={wordVariants} className={serif}> of AI.</motion.span>
              </span>
            </h2>
          </motion.div>

          {/* ── 2. Client carousel ── */}
          <motion.div {...carouselAnim} className="relative z-10">
            {carouselVariant === 'v2'
              ? <ClientsCarouselV2 theme={theme} />
              : <ClientsCarousel theme={theme} />
            }
          </motion.div>

        </div>
      </section>
    );
  },
);

IntroSection.displayName = 'IntroSection';
