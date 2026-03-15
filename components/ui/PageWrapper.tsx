/**
 * PageWrapper — rounded inset-card container for project page content
 *
 * Figma: Project page outer frame (994:45176 desktop, 994:45235 mobile)
 *
 * Layout
 * ──────
 * All project page content (ProjectIntro + ContentBlocks) lives inside this
 * wrapper. It creates the rounded "card" appearance inset against the project
 * brand-color background.
 *
 * | Breakpoint | Max width | Border radius | Padding | Gap between children |
 * |------------|-----------|--------------|---------|----------------------|
 * | Mobile     | —         | 24px         | 12px    | 32px                 |
 * | Tablet+    | 1664px    | 80px         | 32px    | 56px                 |
 *
 * Dark mode
 * ─────────
 * Uses `--bg-page` which auto-responds to `.dark` on <html> via tokens.css.
 * Light: #f8f8f7 · Dark: #000000
 *
 * Props
 * ─────
 * children  — project page content (ProjectIntro, ContentBlocks, etc.)
 * className — extra classes on the root <div>
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────────────────

export interface PageWrapperProps {
  children: React.ReactNode;
  /** Extra classes on the root <div>. */
  className?: string;
  /** Overrides --bg-page when set. Pass a hex or CSS variable string. */
  bgColor?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export const PageWrapper = forwardRef<HTMLDivElement, PageWrapperProps>(
  function PageWrapper({ children, className, bgColor }, ref) {
    return (
      <div
        ref={ref}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
        className={cn(
          'flex flex-col',
          'bg-[var(--bg-page)] text-[var(--text-primary)]',
          // Mobile
          'rounded-[var(--radius-wrapper-mobile)] p-[var(--wrapper-padding-mobile)] gap-[var(--wrapper-gap-mobile)]',
          // Tablet / Desktop
          'md:rounded-[var(--radius-wrapper-desktop)] md:p-[var(--page-padding-desktop)] md:gap-[var(--page-padding-desktop)] md:max-w-[var(--content-width-desktop)] md:mx-auto',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

PageWrapper.displayName = 'PageWrapper';
