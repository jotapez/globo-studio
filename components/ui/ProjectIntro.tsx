'use client';

/**
 * ProjectIntro — intro block for the project page
 *
 * Figma: intro frame (1061:1441) within project page (994:45176)
 *
 * Layout
 * ──────
 * Desktop/Tablet (768px+): two equal columns side-by-side
 *   ┌────────────────────────┬────────────────────────┐
 *   │  [Mixed heading — h1]  │  [Intro body copy]     │
 *   └────────────────────────┴────────────────────────┘
 *   gap: 32px   pt: 24px   px: 24px
 *
 * Mobile (<768px): single column, heading then body
 *   gap: 16px   pt: 8px   px: 8px
 *
 * Typography
 * ──────────
 * Heading — base font is Instrument Serif (font-serif). Callers switch individual
 * words to Helvetica Neue by wrapping them in <span className="font-sans">.
 *   Desktop: --text-h1-size (64px) / --text-h1-leading (84px)
 *   Mobile:  --text-h1-mobile-size (40px) / --text-h1-mobile-leading (54px)
 *
 * Body — Helvetica Neue (font-sans)
 *   Desktop: --text-intro-sm-size (20px) / --text-intro-sm-leading (28px)
 *   Mobile:  --text-intro-sm-mobile-size (16px) / --text-intro-sm-mobile-leading (21px)
 *
 * Animation
 * ─────────
 * Heading and body slide up + fade in on scroll-into-view (once: true).
 * Respects prefers-reduced-motion via useReducedMotion().
 * heading: y 20px → 0, opacity 0 → 1, 500ms ease-out
 * body:    same, 100ms delay
 *
 * Dark mode
 * ─────────
 * Uses --text-primary which auto-responds to .dark on <html> via tokens.css.
 *
 * Props
 * ─────
 * heading   — mixed-typeface h1 content. Wrap serif words in bare text or
 *             <span className="font-serif">; switch to sans with
 *             <span className="font-sans">.
 * body      — intro body copy (2–4 sentences). Accepts string or ReactNode.
 * className — extra classes on the root <div>
 */

import { forwardRef, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface ProjectIntroProps {
  /**
   * Mixed-typeface heading content rendered as <h1>.
   * Base font is Instrument Serif (font-serif). Wrap sans words in
   * <span className="font-sans"> for Helvetica Neue.
   *
   * Example:
   *   <><span className="font-serif">Officeworks</span>
   *   <span className="font-sans"> — Manage your </span>
   *   <span className="font-serif">B2B account</span></>
   */
  heading: React.ReactNode;
  /**
   * Intro body copy — 2–4 sentences summarising the project and designer's role.
   * Accepts a plain string or React elements for bolding / links.
   */
  body: React.ReactNode;
  /** Extra classes on the root <div>. */
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export const ProjectIntro = forwardRef<HTMLDivElement, ProjectIntroProps>(
  function ProjectIntro({ heading, body, className }, ref) {
    const shouldReduceMotion = useReducedMotion();

    const innerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(innerRef, { once: true, amount: 0.2 });

    const headingAnim = shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
          transition: { duration: 0.5, ease: 'easeOut' as const },
        };

    const bodyAnim = shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
          transition: { duration: 0.5, ease: 'easeOut' as const, delay: 0.1 },
        };

    return (
      <div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          // Mobile: single column
          'flex flex-col gap-[16px] pt-[8px] px-[8px]',
          // Tablet+: two equal columns
          'md:flex-row md:items-start md:gap-[32px] md:pt-[24px] md:px-[24px]',
          className,
        )}
      >
        {/* ── Left column: heading ── */}
        <motion.div {...headingAnim} className="flex-1 min-w-0">
          <h1
            className={cn(
              'font-serif font-normal not-italic',
              'text-[var(--text-primary)]',
              '[font-size:var(--text-h1-mobile-size)] [line-height:var(--text-h1-mobile-leading)]',
              'md:[font-size:var(--text-h1-size)] md:[line-height:var(--text-h1-leading)]',
            )}
          >
            {heading}
          </h1>
        </motion.div>

        {/* ── Right column: body copy ── */}
        <motion.div {...bodyAnim} className="flex-1 min-w-0">
          <div
            className={cn(
              'font-sans font-normal not-italic',
              'text-[var(--text-primary)]',
              '[font-size:var(--text-intro-sm-mobile-size)] [line-height:var(--text-intro-sm-mobile-leading)]',
              'md:[font-size:var(--text-intro-sm-size)] md:[line-height:var(--text-intro-sm-leading)]',
            )}
          >
            {body}
          </div>
        </motion.div>
      </div>
    );
  },
);

ProjectIntro.displayName = 'ProjectIntro';
