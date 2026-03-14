'use client';

/**
 * SingleImageColorBackground — project brand-color card block for project pages
 *
 * Figma: section "Single Image — Project Color Background" (1065:1815)
 *   Desktop / Tablet  994:45192 — project color bg, p-40px, radius-56px
 *   Mobile            994:45251 — project color bg, p-16px, radius-16px
 *
 * Layout
 * ──────
 * A card whose background is a project-specific brand color (passed as a prop,
 * not a semantic token). Used for design system exports, illustrations, and UI
 * images that pair with a case study's primary tint. Image is rendered with
 * object-contain so artwork is never cropped.
 *
 * | Breakpoint          | Padding | Border radius           |
 * |---------------------|---------|-------------------------|
 * | Mobile  (< 768 px)  | 16px    | --radius-block-mobile   |
 * | Desktop / Tablet    | 40px    | --radius-block          |
 *
 * Animation
 * ─────────
 * Slide-up + fade on scroll-into-view (once: true).
 * Respects prefers-reduced-motion via useReducedMotion().
 * y: 30px → 0, opacity: 0 → 1, 500 ms ease-out
 *
 * Props
 * ─────
 * src         — image source
 * alt         — describe the image for screen readers
 * color       — project brand color, e.g. "#e0e2e8" or "var(--bg-project-ow)"
 * aspectRatio — image container ratio, e.g. "3614/4096" or "4034/2760"
 * priority    — pass true when above the fold (LCP)
 * className   — extra classes on the root element
 */

import { forwardRef, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface SingleImageColorBackgroundProps {
  /**
   * Image source — passed directly to next/image `src`.
   */
  src: string;
  /**
   * Alt text for the image.
   * Describe the content — e.g. "Officeworks design system component library overview".
   */
  alt: string;
  /**
   * Project brand color for the card background.
   * Pass a hex value (e.g. `"#e0e2e8"`) or a CSS variable reference
   * (e.g. `"var(--bg-project-ow)"`).
   */
  color: string;
  /**
   * Aspect ratio for the image container, e.g. `"3614/4096"` or `"4034/2760"`.
   * Required because this varies per project and image.
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

export const SingleImageColorBackground = forwardRef<HTMLDivElement, SingleImageColorBackgroundProps>(
  function SingleImageColorBackground({ src, alt, color, aspectRatio, priority = false, className }, ref) {
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
        style={{ backgroundColor: color }}
        className={cn(
          'w-full flex flex-col items-start justify-center',
          // Mobile (<768px): 16px padding, 16px radius
          'p-[16px] rounded-[var(--radius-block-mobile)]',
          // Tablet / Desktop (≥768px): 40px padding, 56px radius
          'md:p-[40px] md:rounded-[var(--radius-block)]',
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
            // tablet: 960px − 80px = 880px
            // desktop: 1664px − 80px = 1584px
            sizes="(max-width: 767px) 321px, (max-width: 1023px) 880px, 1584px"
          />
        </div>
      </motion.div>
    );
  },
);

SingleImageColorBackground.displayName = 'SingleImageColorBackground';
