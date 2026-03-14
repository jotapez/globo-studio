'use client';

/**
 * HeroImageLayout — full-width hero image block for project pages
 *
 * Figma: section "HeroImageLayout" (1067:37100)
 *   Desktop  1067:37126 — 1600 × 853 px
 *   Tablet   1067:37127 —  896 × 853 px
 *   Mobile   1067:37128 —  329 × 470 px
 *
 * Layout
 * ──────
 * Full-width container that clips a single composited hero image
 * (device mockups pre-exported from Figma) edge-to-edge.
 * No padding. No background. `object-cover` fills every breakpoint.
 *
 * The three Figma frame sizes map to three responsive aspect ratios:
 *
 * | Breakpoint          | Aspect ratio | Border radius         |
 * |---------------------|--------------|-----------------------|
 * | Mobile  (< 768 px)  | 329 / 470    | --radius-block-mobile |
 * | Tablet  (768–1023px)| 896 / 853    | --radius-block        |
 * | Desktop (≥ 1024 px) | 1600 / 853   | --radius-block        |
 *
 * Animation
 * ─────────
 * Slide-up + fade on scroll-into-view (once: true).
 * Respects prefers-reduced-motion via useReducedMotion().
 * y: 30px → 0, opacity: 0 → 1, 500 ms ease-out
 *
 * Props
 * ─────
 * src       — hero image source (pre-composited device scene from Figma)
 * alt       — describe the scene for screen readers
 * priority  — pass true when this is the first / above-the-fold block (LCP)
 * className — extra classes on the root element
 */

import { forwardRef, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface HeroImageLayoutProps {
  /**
   * Hero image source — a pre-composited device-mockup scene exported from Figma.
   * Passed directly to next/image `src`.
   */
  src: string;
  /**
   * Alt text for the hero image.
   * Describe the scene — e.g. "iPad on a wooden desk showing the Otherhomes
   * property listings interface alongside a MacBook".
   */
  alt: string;
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

export const HeroImageLayout = forwardRef<HTMLDivElement, HeroImageLayoutProps>(
  function HeroImageLayout({ src, alt, priority = false, className }, ref) {
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
          // Clip composited images + apply border radius
          'relative w-full overflow-hidden',
          // Mobile  (<768px)   329 × 470 → portrait
          'aspect-[329/470] rounded-[var(--radius-block-mobile)]',
          // Tablet  (768–1023) 896 × 853 → near-square
          'md:aspect-[896/853] md:rounded-[var(--radius-block)]',
          // Desktop (≥1024px)  1600 × 853 → landscape
          'lg:aspect-[1600/853]',
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          // Matches the three project-page content widths from tokens:
          // --content-width-mobile 353px · --content-width-tablet 960px
          // --content-width-desktop 1664px
          sizes="(max-width: 767px) 353px, (max-width: 1023px) 960px, 1664px"
        />
      </motion.div>
    );
  },
);

HeroImageLayout.displayName = 'HeroImageLayout';
