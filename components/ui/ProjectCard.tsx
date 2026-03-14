/**
 * ProjectCard — case study preview card
 *
 * Figma: project-card-desktop (1000:4834) / project-card-mobile (1000:4851)
 *
 * Layout
 * ──────
 * Full-viewport tall (100vh / 100svh on mobile). Vertically stacked:
 * image (flex-1, fills remaining height) → title + description (fixed height).
 *
 * Hover
 * ─────
 * Hovering over the image OR heading triggers:
 *   - Image border-radius morphs to --radius-card-circle (circle)
 *   - Image scales from 1 → 1.05
 *   - Heading gets a left-to-right animated underline bar
 * Hovering over the description or empty space has no effect.
 * Easing: cubic-bezier(0.4, 0, 0.2, 1)
 *
 * External
 * ────────
 * external: true → wraps card in <a target="_blank"> instead of <Link>.
 * A small arrow-up-right icon is shown in the top-right corner of the image.
 *
 * Props
 * ─────
 * title        — project name (heading)
 * description  — one-paragraph summary
 * href         — route to the case study page (or external URL)
 * imageSrc     — hero / preview image URL
 * imageAlt     — alt text; falls back to title
 * external     — true → open in new tab (personal / side projects)
 * className    — extra classes on the root <article>
 */

'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface ProjectCardProps {
  /** Project name — rendered as the card heading. */
  title: string;
  /** One-paragraph summary shown below the image. */
  description: string;
  /** Route to the case study page or external URL. */
  href: string;
  /** Hero preview image. Passed directly to next/image `src`. */
  imageSrc: string;
  /** Alt text for the image. Falls back to `title` when omitted. */
  imageAlt?: string;
  /**
   * When true, wraps the card in <a target="_blank" rel="noopener noreferrer">
   * and shows an external-link icon in the image corner.
   */
  external?: boolean;
  /**
   * Passes `priority` to next/image — set true for above-the-fold cards
   * to avoid lazy-loading and improve LCP.
   */
  priority?: boolean;
  /** When true, renders the card in a faded, non-interactive "coming soon" state. */
  disabled?: boolean;
  /** Extra classes on the root element. */
  className?: string;
  /** Project background colour — set as entry-bg in sessionStorage so
   *  ProjectBackground starts at the right colour instead of white. */
  targetBg?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export function ProjectCard({
  title,
  description,
  href,
  imageSrc,
  imageAlt,
  external = false,
  priority = false,
  disabled = false,
  className = '',
  targetBg,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const enter = useCallback(() => setHovered(true), []);
  const leave = useCallback(() => setHovered(false), []);

  const handleClick = useCallback(() => {
    if (targetBg) {
      try {
        sessionStorage.setItem('entry-bg', targetBg);
        sessionStorage.setItem('skip-nav-entrance', '1');
      } catch {}
    }
  }, [targetBg]);

  // Shared classes for both link variants
  const linkClasses = 'group flex flex-col h-full focus-visible:outline-none pointer-events-none';

  const inner = (
    <>
      {/* ── image ─────────────────────────────────────────────────────── */}
      <div
        onMouseEnter={enter}
        onMouseLeave={leave}
        className={cn(
          'relative flex-1 min-h-[var(--card-image-min-h)] md:max-h-[852px] overflow-hidden pointer-events-auto cursor-pointer',
          // border-radius: morphs to circle when hovered
          hovered
            ? 'rounded-[var(--radius-card-circle)]'
            : 'rounded-[var(--radius-card-mobile)] md:rounded-[var(--radius-card)]',
          'transition-[border-radius] duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
          // focus ring on the link shows via the image container
          'group-focus-visible:ring-2 group-focus-visible:ring-[var(--text-primary)] group-focus-visible:ring-offset-4',
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          fill
          priority={priority}
          className={cn(
            'object-cover transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
            hovered ? 'scale-105' : 'scale-100',
          )}
          // Desktop: 2-col grid (1664px content − 32px gap) / 2 ≈ 816px per card
          sizes="(max-width: 768px) 353px, 816px"
        />

        {/* External link indicator */}
        {external && (
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 z-10 text-white opacity-70"
          >
            {/* Arrow up-right — inline SVG, no dependency needed */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        )}
      </div>

      {/* ── text ──────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col gap-2 pt-4">
        {/* Title — animated underline bar sweeps left-to-right on hover/focus */}
        <h3
          onMouseEnter={enter}
          onMouseLeave={leave}
          className={cn(
            'relative w-fit pointer-events-auto cursor-pointer',
            '[font-family:var(--font-serif)] font-normal',
            // Desktop/H2-Instrument: 32 / 42
            '[font-size:var(--text-h2-serif-size)] [line-height:var(--text-h2-serif-leading)]',
            '[color:var(--text-primary)]',
          )}
        >
          {title}
          <span
            aria-hidden
            className={cn(
              'absolute bottom-0 left-0 h-px bg-[var(--text-primary)]',
              'transition-[width] duration-300 ease-in-out',
              hovered ? 'w-full' : 'w-0 group-focus-visible:w-full',
            )}
          />
        </h3>

        {/* Description — mobile 14 / 21, desktop 16 / 24 */}
        <p
          className={cn(
            '[font-family:var(--font-sans)] font-normal',
            '[font-size:var(--text-body-mobile-size)] [line-height:var(--text-body-mobile-leading)]',
            'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
            '[color:var(--text-primary)]',
            // Figma: description max-width ~570 px on desktop for readability
            'md:max-w-[570px]',
          )}
        >
          {description}
        </p>
      </div>
    </>
  );

  return (
    <article className={cn('flex flex-col max-md:h-[calc(100svh-var(--card-top-offset-mobile,0px))] md:h-[calc(100vh-var(--card-top-offset,0px)-var(--card-bottom-offset,0px))] md:max-h-[calc(852px+var(--card-text-area-h,138px))]', className)}>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className={linkClasses} onClick={handleClick}>
          {inner}
        </Link>
      )}
    </article>
  );
}
