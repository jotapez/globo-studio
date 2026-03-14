'use client';

/**
 * SingleImageWhiteCard — UI screenshot block for project pages
 *
 * Figma: section "Single Image — White Card" (994:45176)
 *   Desktop / Tablet  994:45188 — bg-project-card, p-48px, radius-56px
 *   Mobile            994:45247 — bg-project-card, p-16px, radius-24px
 *
 * Layout
 * ──────
 * A white (or dark-mode near-black) card that frames a UI screenshot
 * with padding on all sides. Image is rendered with object-contain so the
 * full screenshot is always visible — no cropping.
 *
 * | Breakpoint          | Padding | Border radius         |
 * |---------------------|---------|-----------------------|
 * | Mobile  (< 768 px)  | 16px    | --radius-card-mobile  |
 * | Desktop / Tablet    | 48px    | --radius-block        |
 *
 * Animation
 * ─────────
 * Slide-up + fade on scroll-into-view (once: true).
 * Respects prefers-reduced-motion via useReducedMotion().
 * y: 30px → 0, opacity: 0 → 1, 500 ms ease-out
 *
 * Props
 * ─────
 * src       — UI screenshot source
 * alt       — describe the interface for screen readers
 * priority  — pass true when above the fold (LCP)
 * className — extra classes on the root element
 */

import { forwardRef, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface SingleImageWhiteCardProps {
  /**
   * UI screenshot source — passed directly to next/image `src`.
   */
  src: string;
  /**
   * Alt text for the screenshot.
   * Describe the interface — e.g. "Officeworks B2B catalogue product listing page".
   */
  alt: string;
  /**
   * Aspect ratio for the image container, e.g. `"4034/2760"` or `"1600/900"`.
   * Required because screenshot dimensions vary per project.
   */
  aspectRatio: string;
  /**
   * Passes `priority` to next/image — set true for the first content block
   * visible on load to skip lazy-loading and improve LCP.
   * Default: false
   */
  priority?: boolean;
  /** Extra classes on the root element. */
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export const SingleImageWhiteCard = forwardRef<HTMLDivElement, SingleImageWhiteCardProps>(
  function SingleImageWhiteCard({ src, alt, aspectRatio, priority = false, className }, ref) {
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
        className={cn(
          'w-full flex flex-col',
          'bg-[var(--bg-project-card)]',
          // Mobile (<768px): 16px padding, 24px radius
          'p-[16px] rounded-[var(--radius-card-mobile)]',
          // Tablet / Desktop (≥768px): 48px padding, 56px radius
          'md:p-[48px] md:rounded-[var(--radius-block)]',
          className,
        )}
      >
        {/* Image container — aspect ratio varies per project, passed as prop */}
        <div className="relative w-full" style={{ aspectRatio }}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-contain"
            // Content widths minus 2× padding:
            // mobile: 353px − 32px = 321px
            // tablet: 960px − 96px = 864px
            // desktop: 1664px − 96px = 1568px
            sizes="(max-width: 767px) 321px, (max-width: 1023px) 864px, 1568px"
          />
        </div>
      </motion.div>
    );
  },
);

SingleImageWhiteCard.displayName = 'SingleImageWhiteCard';
