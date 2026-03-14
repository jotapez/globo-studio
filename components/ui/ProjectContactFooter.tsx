'use client';

/**
 * ProjectContactFooter — ContactFooter variant without the clocks row.
 *
 * Figma: Contact section (1065:934) — Desktop 1065:1812, Tablet 1065:1813, Mobile 1065:1814
 *
 * Thin wrapper around ContactFooter with showClocks={false}.
 * All layout, tokens, dark mode, and FooterBar are inherited from ContactFooter.
 *
 * Props
 * ─────
 * theme     — forwarded to ContactFooter (→ Clock, unused but kept for API consistency). Default: 'auto'
 * className — extra classes on the root <section>
 */

import { forwardRef } from 'react';
import { ContactFooter } from '@/components/ui/ContactFooter';

// ─── types ────────────────────────────────────────────────────────────────────

export interface ProjectContactFooterProps {
  /** Forwarded to ContactFooter for Clock blend-mode theming. Default: 'auto' */
  theme?: 'auto' | 'light' | 'dark';
  /** Extra classes on the root <section>. */
  className?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export const ProjectContactFooter = forwardRef<HTMLElement, ProjectContactFooterProps>(
  function ProjectContactFooter({ theme = 'auto', className }, ref) {
    return (
      <ContactFooter
        showClocks={false}
        theme={theme}
        className={className}
        ref={ref}
      />
    );
  },
);

ProjectContactFooter.displayName = 'ProjectContactFooter';
