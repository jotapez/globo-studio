'use client';

/**
 * TwoImageLayout — side-by-side two-image block for project pages
 *
 * Figma: section "Two-Image Layout" within 994-45176
 *
 * Layout
 * ──────
 * Two equal-width columns, each a full-bleed image card with the project brand
 * color as background. On mobile both columns stack vertically.
 *
 * | Breakpoint         | Layout      | Gap   | Border radius         |
 * |--------------------|-------------|-------|-----------------------|
 * | Mobile  (< 768 px) | stack (col) | 32px  | --radius-block-mobile |
 * | Desktop / Tablet   | row (50/50) | 32px  | --radius-block        |
 *
 * Animation
 * ─────────
 * Slide-up + fade on scroll-into-view (once: true).
 * Respects prefers-reduced-motion via useReducedMotion().
 * y: 30px → 0, opacity: 0 → 1, 500 ms ease-out
 *
 * Props
 * ─────
 * srcA / srcB       — image sources
 * altA / altB       — alt text for each image
 * aspectRatioA / B  — aspect ratio per image, e.g. "3219/4020"
 * color             — project brand color (shared across both columns)
 * className         — extra classes on the root element
 */

import { forwardRef, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface TwoImageLayoutProps {
  srcA: string;
  altA: string;
  aspectRatioA: string;
  srcB: string;
  altB: string;
  aspectRatioB: string;
  /** Project brand color for both column backgrounds. */
  color: string;
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export const TwoImageLayout = forwardRef<HTMLDivElement, TwoImageLayoutProps>(
  function TwoImageLayout({ srcA, altA, aspectRatioA, srcB, altB, aspectRatioB, color, className }, ref) {
    const shouldReduceMotion = useReducedMotion();

    const innerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(innerRef, { once: true, amount: 0.1 });

    const anim = shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
          transition: { duration: 0.5, ease: 'easeOut' as const },
        };

    return (
      <motion.div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        {...anim}
        className={cn('flex flex-col md:flex-row gap-[32px]', className)}
      >
        {/* Column A */}
        <div
          style={{ backgroundColor: color }}
          className="flex-1 rounded-[var(--radius-block-mobile)] md:rounded-[var(--radius-block)] overflow-hidden"
        >
          <div className="relative w-full" style={{ aspectRatio: aspectRatioA }}>
            <Image
              src={srcA}
              alt={altA}
              fill
              className="object-cover"
              // Each column is ~50% of content width minus half the gap:
              // desktop: (1664px − 32px) / 2 = 816px
              // tablet:  (960px  − 32px) / 2 = 464px
              // mobile:  353px (full width when stacked)
              sizes="(max-width: 767px) 353px, (max-width: 1023px) 464px, 816px"
            />
          </div>
        </div>

        {/* Column B */}
        <div
          style={{ backgroundColor: color }}
          className="flex-1 rounded-[var(--radius-block-mobile)] md:rounded-[var(--radius-block)] overflow-hidden"
        >
          <div className="relative w-full" style={{ aspectRatio: aspectRatioB }}>
            <Image
              src={srcB}
              alt={altB}
              fill
              className="object-cover"
              sizes="(max-width: 767px) 353px, (max-width: 1023px) 464px, 816px"
            />
          </div>
        </div>
      </motion.div>
    );
  },
);

TwoImageLayout.displayName = 'TwoImageLayout';
