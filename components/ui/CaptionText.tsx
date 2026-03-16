'use client';

/**
 * CaptionText — short descriptive label between content blocks on project pages
 *
 * Figma: Caption text instances within 994:45176
 * Spec:  docs/screens/project-page-spec.md § 3g
 *
 * Layout
 * ──────
 * Full-width container with px-[16px]. A flex row selects the alignment variant.
 *
 * | Variant        | CSS                | Use                              |
 * |----------------|--------------------|----------------------------------|
 * | left           | justify-start      | Label below block, left default  |
 * | right          | justify-end        | Right-aligned label              |
 * | center         | justify-center     | Centred standalone descriptor    |
 * | space-between  | justify-between    | Two captions — left and right    |
 *
 * Text node: 16px / 24px, var(--text-muted), Helvetica Neue
 * Width: w-[627px] desktop → w-full mobile
 * space-between on mobile: flex-col gap-[8px]
 *
 * Animation
 * ─────────
 * Fade only — opacity: 0 → 1, 300ms ease-out, once: true.
 * No y-translation (unlike image blocks).
 * Respects prefers-reduced-motion via useReducedMotion().
 *
 * Props
 * ─────
 * alignment  — 'left' | 'right' | 'center' | 'space-between'
 * children   — one child for single, two children for space-between
 * className  — extra classes on the root element
 */

import { forwardRef, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export type CaptionAlignment = 'left' | 'right' | 'center' | 'space-between';

export interface CaptionTextProps {
  /** Alignment variant controlling how text nodes are distributed. */
  alignment: CaptionAlignment;
  /**
   * Text content. Pass one child for single captions; two children for
   * `space-between` (left caption + right caption).
   */
  children: React.ReactNode;
  /** Extra classes on the root element. */
  className?: string;
}

// ─── shared class ─────────────────────────────────────────────────────────────

const CAPTION_SPAN_CLS = cn(
  'font-sans font-normal not-italic',
  'text-[var(--text-muted)]',
  '[font-size:16px] [line-height:24px]',
  // Desktop: fixed 627px width; Mobile: full width
  'w-full md:w-[627px]',
);

// ─── alignment map ────────────────────────────────────────────────────────────

const alignmentCls: Record<CaptionAlignment, string> = {
  'left':          'justify-start',
  'right':         'justify-end',
  'center':        'justify-center',
  'space-between': 'justify-between flex-col gap-[8px] md:flex-row',
};

// ─── component ────────────────────────────────────────────────────────────────

export const CaptionText = forwardRef<HTMLDivElement, CaptionTextProps>(
  function CaptionText({ alignment, children, className }, ref) {
    const shouldReduceMotion = useReducedMotion();

    const innerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(innerRef, { once: true, amount: 0.2 });

    const anim = shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0 },
          animate: isInView ? { opacity: 1 } : { opacity: 0 },
          transition: { duration: 0.3, ease: 'easeOut' as const },
        };

    return (
      <motion.div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        {...anim}
        className={cn(
          'w-full px-[16px] flex',
          alignmentCls[alignment],
          className,
        )}
      >
        {/* Wrap each child in the text styles */}
        {Array.isArray(children)
          ? children.map((child, i) => (
              <span key={i} className={CAPTION_SPAN_CLS}>
                {child}
              </span>
            ))
          : (
              <span className={CAPTION_SPAN_CLS}>
                {children}
              </span>
            )}
      </motion.div>
    );
  },
);

CaptionText.displayName = 'CaptionText';
