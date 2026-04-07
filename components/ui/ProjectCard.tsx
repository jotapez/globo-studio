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

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
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
  /**
   * Second image revealed via cross-fade on hover (desktop).
   * When provided, the base image fades out and this image fades in on hover.
   */
  hoverImageSrc?: string;
  /**
   * Portrait-optimised second image shown by default on mobile.
   * When provided, replaces hoverImageSrc on viewports < md.
   */
  hoverMobileSrc?: string;
  /**
   * When true, disables the morph/scale/underline hover effects that normally
   * activate when no hoverImageSrc is provided. Use for cards with a single
   * static image that still need the pill and caption-text hover effects.
   */
  staticImage?: boolean;
  /**
   * When true, the description starts invisible and fades in on hover.
   * Pairs with hoverImageSrc. Uses opacity-only — layout height stays constant.
   */
  showDescriptionOnHover?: boolean;
  /**
   * Label shown in the cursor-following pill on hover (desktop only).
   * E.g. "See work" for case studies, "Check it out" for external projects.
   */
  cursorLabel?: string;
  /** When true, shows the arrow icon inside the cursor pill. Default: false. */
  cursorIcon?: boolean;
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
  hoverImageSrc,
  hoverMobileSrc,
  staticImage = false,
  showDescriptionOnHover = false,
  cursorLabel,
  cursorIcon = false,
}: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const wordVariants: Variants = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const containerVariants: Variants = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.03 } },
      };

  useEffect(() => setMounted(true), []);

  const enter = useCallback(() => setHovered(true), []);
  const leave = useCallback(() => { setHovered(false); setCursorPos(null); }, []);

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
        onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
        className={cn(
          'relative min-h-0 h-[390px] md:flex-1 md:h-auto md:max-h-[var(--card-image-max-h)] overflow-hidden pointer-events-auto cursor-pointer',
          // border-radius: morphs to circle on hover (standard variant only)
          !hoverImageSrc && !staticImage && hovered
            ? 'rounded-[var(--radius-card-circle)]'
            : 'rounded-[var(--radius-card-mobile)] md:rounded-[var(--radius-card)]',
          !hoverImageSrc && !staticImage && 'transition-[border-radius] duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
          // focus outline on the link shows via the image container (outline is not clipped by overflow-hidden, unlike ring/box-shadow)
          'group-focus-visible:outline-2 group-focus-visible:outline-[var(--text-primary)] group-focus-visible:outline-offset-4',
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          fill
          priority={priority}
          unoptimized={imageSrc.endsWith('.svg')}
          className={cn(
            'object-cover transition-[transform,opacity] motion-reduce:transition-none',
            hoverImageSrc ? 'duration-[200ms] ease-out' : 'duration-[400ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]',
            !hoverImageSrc && !staticImage && (hovered ? 'scale-105' : 'scale-100'),
            hoverImageSrc && (hovered ? 'opacity-0' : 'opacity-100'),
          )}
          // Mobile: full card width = 100vw − 2× --page-padding-mobile (20px). Avoids
          // under-sized srcset on wide phones + retina DPR. Desktop: column width.
          sizes="(max-width: 767px) calc(100vw - 40px), 812px"
        />

        {/* Hover image — mobile: always visible; desktop: cross-fades in on hover */}
        {hoverMobileSrc && (
          <Image
            src={hoverMobileSrc}
            alt=""
            fill
            priority={priority}
            className="object-cover md:hidden"
            sizes="calc(100vw - 40px)"
          />
        )}
        {hoverImageSrc && (
          <Image
            src={hoverImageSrc}
            alt=""
            fill
            priority={priority}
            className={cn(
              'object-cover transition-opacity duration-[200ms] ease-out motion-reduce:transition-none',
              'hidden md:block',
              hovered ? 'opacity-100' : 'opacity-0',
            )}
            sizes="812px"
          />
        )}

      </div>

      {/* ── text ──────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col gap-0 pt-[16px] md:h-[var(--card-text-area-h)] md:overflow-hidden">
        {/* Title — animated underline bar sweeps left-to-right on hover/focus */}
        <h3
          onMouseEnter={enter}
          onMouseLeave={leave}
          className={cn(
            'relative w-fit pointer-events-auto cursor-pointer',
            'font-sans [font-weight:var(--text-h2-weight)]',
            '[font-size:var(--text-body-mobile-size)] [line-height:var(--text-body-mobile-leading)]',
            'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
            '[color:var(--text-primary)]',
          )}
        >
          <span className="inline-flex items-baseline gap-[0.25em]">
            {title}
            {external && (
              <span
                aria-hidden="true"
                className={cn(
                  'inline-flex items-center self-center transition-opacity duration-300 ease-in-out',
                  hovered ? 'opacity-100' : 'opacity-0',
                )}
              >
                <svg
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
          </span>
          {!hoverImageSrc && !staticImage && (
            <span
              aria-hidden="true"
              className={cn(
                'absolute bottom-0 left-0 h-px bg-[var(--text-primary)]',
                'transition-[width] duration-300 ease-in-out',
                hovered ? 'w-full' : 'w-0 group-focus-visible:w-full',
              )}
            />
          )}
        </h3>

        {/* Description — mobile 14 / 21, desktop 16 / 24 */}
        {showDescriptionOnHover ? (
          <>
            {/* Mobile — always visible, no animation */}
            <p
              className={cn(
                'md:hidden',
                '[font-family:var(--font-sans)] [font-weight:var(--text-body-light-weight)]',
                '[font-size:var(--text-body-mobile-size)] [line-height:var(--text-body-mobile-leading)]',
                '[color:var(--text-primary)]',
              )}
            >
              {description}
            </p>
            {/* Desktop — word-by-word opacity fade on hover */}
            <motion.p
              variants={containerVariants}
              initial="hidden"
              animate={hovered ? 'visible' : 'hidden'}
              className={cn(
                'hidden md:block',
                '[font-family:var(--font-sans)] [font-weight:var(--text-body-light-weight)]',
                'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
                '[color:var(--text-primary)]',
              )}
            >
              {description.split(' ').map((word, i, arr) => (
                <motion.span key={i} variants={wordVariants}>
                  {word}{i < arr.length - 1 ? ' ' : ''}
                </motion.span>
              ))}
            </motion.p>
          </>
        ) : (
          <p
            className={cn(
              '[font-family:var(--font-sans)] [font-weight:var(--text-body-light-weight)]',
              '[font-size:var(--text-body-mobile-size)] [line-height:var(--text-body-mobile-leading)]',
              'md:[font-size:var(--text-body-size)] md:[line-height:var(--text-body-leading)]',
              '[color:var(--text-primary)]',
            )}
          >
            {description}
          </p>
        )}
      </div>
    </>
  );

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden',
        'md:h-[calc(100vh-var(--card-top-offset,0px)-var(--card-bottom-offset,0px))]',
        'md:max-h-[calc(var(--card-image-max-h)+var(--card-text-area-h,138px))]',
        disabled && 'opacity-40 pointer-events-none',
        className,
      )}
      aria-disabled={disabled || undefined}
    >
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} (opens in a new tab)`}
          className={linkClasses}
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className={linkClasses} onClick={handleClick}>
          {inner}
        </Link>
      )}

      {/* ── Cursor-following pill (portal — escapes Framer Motion transform) ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {cursorLabel && hovered && cursorPos && (
            <motion.div
              key="cursor-pill"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}
              className={cn(
                'fixed z-50 hidden md:flex items-center gap-2 pointer-events-none',
                'px-8 py-4 rounded-[var(--radius-pill)]',
                'bg-[var(--bg-page)] text-[var(--text-primary)]',
                'shadow-[var(--shadow-pill)]',
                '[font-family:var(--font-sans)]',
                '[font-size:var(--text-body-size)] [line-height:var(--text-body-leading)]',
              )}
            >
              <span>{cursorLabel}</span>
              {cursorIcon && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </article>
  );
}
