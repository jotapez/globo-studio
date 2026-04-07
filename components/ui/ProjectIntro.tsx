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

import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
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
  /** id forwarded to the <h1> — used with aria-labelledby on <main>. */
  id?: string;
  /** Extra classes on the root <div>. */
  className?: string;
  /**
   * Extra body content revealed when expanded. Presence enables Read-more mode.
   * Rendered below the toggle at `--text-intro-sm-size` with `--text-primary`.
   */
  extraBody?: React.ReactNode;
  /** Label for the expand toggle. Default: "Read more" */
  readMoreLabel?: string;
  /** Label for the collapse toggle. Default: "Read less" */
  readLessLabel?: string;
  /**
   * Body text colour.
   * - `'muted'` (default) — `--text-muted`, matches all existing usage
   * - `'primary'`         — `--text-primary`, used with the read-more variant
   */
  bodyColor?: 'muted' | 'primary';
}

// ─── component ────────────────────────────────────────────────────────────────

export const ProjectIntro = forwardRef<HTMLDivElement, ProjectIntroProps>(
  function ProjectIntro({ heading, body, id, className, extraBody, readMoreLabel, readLessLabel, bodyColor = 'muted' }, ref) {
    const shouldReduceMotion = useReducedMotion();
    const [expanded, setExpanded] = useState(false);

    const innerRef = useRef<HTMLDivElement>(null);
    const [lockedMobileWidth, setLockedMobileWidth] = useState<number | null>(null);
    const isInView = useInView(innerRef, { once: true, amount: 0.2 });

    useLayoutEffect(() => {
      if (window.innerWidth >= 768) return;
      const node = innerRef.current;
      if (!node) return;
      const measured = Math.round(node.getBoundingClientRect().width);
      if (measured > 0) setLockedMobileWidth(measured);
    }, []);

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
        style={lockedMobileWidth != null ? { maxWidth: `${lockedMobileWidth}px` } : undefined}
        className={cn(
          // Mobile: single column
          'flex flex-col gap-[16px] pt-[8px] px-[8px] pb-[20px] mx-auto md:mx-0',
          // Tablet+: two equal columns (no items-start — right col stretches to row height)
          'md:flex-row md:gap-[32px] md:pt-[24px] md:px-[24px] md:pb-[24px]',
          className,
        )}
      >
        {/* ── Left column: heading ── */}
        <motion.div {...headingAnim} className="flex-1 min-w-0 md:self-start">
          <h1
            id={id}
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
        <motion.div {...bodyAnim} className={cn('flex-1 min-w-0', extraBody && 'md:flex md:flex-col')}>
          {/* Body text + toggle share a flex-col so gap matches Figma exactly */}
          {/* On desktop with extraBody: flex-1 fills right column height; spacer provides min 32px gap */}
          <div className={cn(extraBody && 'flex flex-col gap-[16px] md:gap-0 items-start w-full md:flex-1')}>
            <div
              className={cn(
                'font-sans not-italic',
                extraBody && 'w-full',
                bodyColor === 'primary' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]',
                extraBody
                  ? [
                      'font-medium',
                      '[font-size:var(--text-intro-mobile-size)] [line-height:var(--text-intro-mobile-leading)]',
                      'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                    ]
                  : [
                      'font-normal',
                      '[font-size:var(--text-intro-sm-mobile-size)] [line-height:var(--text-intro-sm-mobile-leading)]',
                      'md:[font-size:var(--text-intro-sm-size)] md:[line-height:var(--text-intro-sm-leading)]',
                    ],
              )}
            >
              {body}
            </div>

            {extraBody && (
              <>
                {/* Spacer — desktop only. Grows to fill any remaining height so the
                    button always sits at the bottom of the right column. Minimum 32px
                    preserves the Figma gap when the right column is naturally taller. */}
                <div className="hidden md:block md:flex-1 md:min-h-[32px]" aria-hidden="true" />
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className={cn(
                    'w-full text-left font-sans font-medium not-italic cursor-pointer',
                    'text-[var(--text-muted)]',
                    '[font-size:var(--text-intro-mobile-size)] [line-height:var(--text-intro-mobile-leading)]',
                    'md:[font-size:var(--text-intro-size)] md:[line-height:var(--text-intro-leading)]',
                  )}
                >
                  {expanded ? (readLessLabel ?? 'Read less') : (readMoreLabel ?? 'Read more')}
                </button>
              </>
            )}
          </div>

          {/* Extra content — outside flex container so gap doesn't flash during animation */}
          {extraBody && (
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="extra"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden w-full"
                >
                  <div
                    className={cn(
                      'pt-[16px] md:pt-[32px] font-sans font-normal not-italic',
                      'text-[var(--text-primary)]',
                      '[font-size:var(--text-intro-sm-mobile-size)] [line-height:var(--text-intro-sm-mobile-leading)]',
                      'md:[font-size:var(--text-intro-sm-size)] md:[line-height:var(--text-intro-sm-leading)]',
                    )}
                  >
                    {extraBody}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    );
  },
);

ProjectIntro.displayName = 'ProjectIntro';
