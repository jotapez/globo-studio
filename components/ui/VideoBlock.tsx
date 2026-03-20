'use client';

/**
 * VideoBlock — YouTube video embed block for project pages
 *
 * Accepts a YouTube watch URL, youtu.be short URL, embed URL, or bare video ID.
 * Optionally wraps the iframe in a project brand-color card.
 *
 * Layout
 * ──────
 * If `color` is provided: colored wrapper div with border-radius tokens,
 * overflow-hidden, then a relative aspect-ratio div containing the iframe.
 * If `color` is omitted: the aspect-ratio div is the root — no card wrapper.
 *
 * | Breakpoint          | Border radius           |
 * |---------------------|-------------------------|
 * | Mobile  (< 768 px)  | --radius-block-mobile   |
 * | Tablet / Desktop    | --radius-block          |
 *
 * Animation
 * ─────────
 * Slide-up + fade on scroll-into-view (once: true).
 * Respects prefers-reduced-motion via useReducedMotion().
 * y: 30px → 0, opacity: 0 → 1, 500 ms ease-out
 *
 * Props
 * ─────
 * src         — YouTube watch URL, youtu.be short URL, embed URL, or bare video ID
 * title       — accessible title for the <iframe> (required for a11y)
 * color       — optional project brand color card background
 * aspectRatio — aspect ratio of the video container, defaults to '16/9'
 * className   — extra classes on the root element
 */

import { forwardRef, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface VideoBlockProps {
  /** YouTube watch URL, youtu.be short URL, embed URL, or bare video ID. */
  src: string;
  /** Accessible title for the <iframe>. Required for a11y. */
  title: string;
  /** Optional background color card (project brand tint). If omitted, no background wrapper. */
  color?: string;
  /** Aspect ratio of the video container — defaults to '16/9'. */
  aspectRatio?: string;
  /** Extra classes on the root element. */
  className?: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function extractYouTubeId(src: string): string | null {
  const watchMatch = src.match(/[?&]v=([^&#]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = src.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = src.match(/\/embed\/([^?&#]+)/);
  if (embedMatch) return embedMatch[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(src)) return src;
  return null;
}

// ─── component ────────────────────────────────────────────────────────────────

export const VideoBlock = forwardRef<HTMLDivElement, VideoBlockProps>(
  function VideoBlock({ src, title, color, aspectRatio = '16/9', className }, ref) {
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

    const videoId = extractYouTubeId(src);
    if (!videoId) return null;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    if (color) {
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
            'w-full overflow-hidden',
            'rounded-[var(--radius-block-mobile)]',
            'md:rounded-[var(--radius-block)]',
            className,
          )}
        >
          <div className="relative w-full" style={{ aspectRatio }}>
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        {...anim}
        className={cn('relative w-full', className)}
        style={{ aspectRatio }}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
        />
      </motion.div>
    );
  },
);

VideoBlock.displayName = 'VideoBlock';
