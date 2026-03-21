'use client';

/**
 * FullBleedImageLayout — full-bleed project brand-color card block for project pages
 *
 * Figma: section "Full-Bleed Image Layout" (1065:1815)
 *   Desktop  994:45203 — project color bg, no padding, radius-56px, object-cover
 *   Tablet   1057:1296 — project color bg, no padding, radius-56px, object-cover
 *   Mobile   994:45255 — project color bg, no padding, radius-16px, object-cover
 *
 * Layout
 * ──────
 * The card IS the image container — no inner wrapper needed because there is
 * no padding. Image fills every pixel edge-to-edge with `object-cover`.
 * A project brand color is set as `backgroundColor` and shows through if the
 * image has transparent areas or leaves any gap at the card edges.
 *
 * | Breakpoint          | Padding | Border radius           | Image fit    |
 * |---------------------|---------|-------------------------|--------------|
 * | Mobile  (< 768 px)  | none    | --radius-block-mobile   | object-cover |
 * | Tablet / Desktop    | none    | --radius-block          | object-cover |
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
 * aspectRatio — card aspect ratio, e.g. "4096/2808" or "1600/853"
 * priority    — pass true when above the fold (LCP)
 * className   — extra classes on the root element
 */

import { forwardRef, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface FullBleedImageLayoutProps {
  /**
   * Image source — passed directly to next/image `src`.
   */
  src: string;
  /**
   * Alt text for the image.
   * Describe the UI — e.g. "Officeworks custom catalogues feature introduction screen".
   */
  alt: string;
  /**
   * Project brand color for the card background.
   * Visible at card edges if the image has transparent areas or doesn't fully cover.
   * Pass a hex value (e.g. `"#e0e2e8"`) or a CSS variable reference
   * (e.g. `"var(--bg-project-ow)"`).
   */
  color: string;
  /**
   * Aspect ratio for the card (and image), e.g. `"4096/2808"` or `"1600/853"`.
   * Required because this varies per project and image.
   */
  aspectRatio: string;
  /**
   * Passes `priority` to next/image — set true for the first content block
   * visible on load to skip lazy-loading and improve LCP.
   * Default: false
   */
  priority?: boolean;
  /** How the image fills its container. Defaults to 'cover'. Use 'contain' for images with transparency that should not be cropped. */
  objectFit?: 'cover' | 'contain';
  /** Extra classes on the root element. */
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export const FullBleedImageLayout = forwardRef<HTMLDivElement, FullBleedImageLayoutProps>(
  function FullBleedImageLayout({ src, alt, color, aspectRatio, priority = false, objectFit = 'cover', className }, ref) {
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
        style={{ backgroundColor: color, aspectRatio }}
        className={cn(
          // Card IS the image container — overflow-hidden + relative for fill image
          'relative w-full overflow-hidden',
          // Mobile (<768px): 16px radius
          'rounded-[var(--radius-block-mobile)]',
          // Tablet / Desktop (≥768px): 56px radius
          'md:rounded-[var(--radius-block)]',
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={objectFit === 'contain' ? 'object-contain' : 'object-cover'}
          // Full content width — no padding to subtract:
          // mobile: 353px · tablet: 960px · desktop: 1664px
          sizes="(max-width: 767px) 353px, (max-width: 1023px) 960px, 1664px"
        />
      </motion.div>
    );
  },
);

FullBleedImageLayout.displayName = 'FullBleedImageLayout';
