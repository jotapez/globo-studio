'use client';

/**
 * Nav — pill-shaped navigation bar
 *
 * Figma: home-nav-desktop (999:45514) / home-nav-mobile (999:45433)
 *        project-nav-desktop (970:43877) / project-nav-mobile (954:40878)
 *
 * Layout
 * ──────
 * Fixed, centered horizontally, floating above page content.
 * Desktop: 54 px tall, 32 px from top, full content-width (1664 px)
 * Mobile:  48 px tall, 20 px from top, full content-width (353 px)
 *
 * Active pill
 * ───────────
 * AnimatedBackground (AnimatePresence + layoutId="animated-background") gives
 * the pill a spring fade+slide between items as the active section changes.
 *
 * Hover pill
 * ──────────
 * A motion.div with layoutId="nav-hover-pill" slides between inactive items
 * as the cursor moves. Hidden on the active item and suppressed on touch
 * devices (pointer: coarse / hover: none). Respects prefers-reduced-motion —
 * animations collapse to instant when the OS setting is on.
 *
 * Props
 * ─────
 * variant       — 'home' (4 anchor items, default) | 'project' (3 nav items)
 * items         — overrides the default NAV_ITEMS list (required for 'project')
 * activeSection — which item is highlighted (controlled)
 * onItemClick   — called with the section id when user clicks
 * disabled      — makes every item non-interactive (opacity 40 %)
 *
 * Project variant differences
 * ───────────────────────────
 * • 3 items instead of 4
 * • No anchor-scroll interception — hrefs navigate to pages directly
 * • Active item click is suppressed (no navigation, no scroll)
 * • Mobile: first and last items shrink to content width; middle item fills
 */

import React, { useId, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedBackground } from '@/components/ui/animated-tabs';

// ─── hover capability ─────────────────────────────────────────────────────────
// Evaluated once at module load — avoids creating a new MediaQueryList on
// every mouseenter. Null on SSR; matched lazily on the client.
const hoverQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(hover: hover) and (pointer: fine)')
    : null;

// ─── types ────────────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: 'hero',    label: 'Globo',   href: '#hero'    },
  { id: 'work',    label: 'Work',    href: '#work'    },
  { id: 'about',   label: 'About',   href: '#about'   },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;

export type NavSection = (typeof NAV_ITEMS)[number]['id'];

/** A single navigation item — used for both the home and project variants. */
export type NavItem = { id: string; label: string; href: string };

export interface NavProps {
  /**
   * 'home'    — 4 anchor items linked to page sections (default)
   * 'project' — 3 items: Globo (→ /), active client name, Next project
   */
  variant?: 'home' | 'project';
  /**
   * Overrides the default NAV_ITEMS list.
   * Required when variant="project"; ignored for variant="home".
   */
  items?: NavItem[];
  /** Controlled: which item id is currently active. Defaults to 'hero'. */
  activeSection?: string;
  /** Called when the user clicks an item. */
  onItemClick?: (sectionId: string) => void;
  /** Disables all items — use during page transitions / loading. */
  disabled?: boolean;
  /** Animate the nav sliding down on mount. Default true. Pass false to skip (project→project). */
  animateEntrance?: boolean;
  /** When true, animate the nav sliding back up (exit). Used on project pages. */
  isExiting?: boolean;
  /** Extra classes on the <nav> wrapper (e.g. for entrance animation). */
  className?: string;
  /** Delay (in seconds) before the entrance animation begins. Defaults to 0.1. */
  entranceDelay?: number;
  /** When true, the active pill follows the cursor on hover instead of a separate hover pill. */
  cursorActive?: boolean;
}

// ─── component ────────────────────────────────────────────────────────────────

export const Nav = React.forwardRef<HTMLElement, NavProps>(function Nav(
  {
    variant = 'home',
    items,
    activeSection = 'hero',
    onItemClick,
    disabled = false,
    animateEntrance = true,
    isExiting = false,
    className = '',
    entranceDelay,
    cursorActive = false,
  },
  ref,
) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Visual position of the active pill — follows cursor when cursorActive is on
  const displayedActiveId = cursorActive && hoveredId ? hoveredId : activeSection;
  const prefersReducedMotion = useReducedMotion();
  // Start hidden when we want to animate; useEffect triggers the slide-in after
  // the component mounts on the client. This avoids the SSR hydration issue where
  // Framer Motion renders the `animate` state on the server, causing `initial` to
  // be ignored on hydration.
  const [visible, setVisible] = useState(!animateEntrance);
  useEffect(() => { setVisible(true); }, []);
  // When reduced motion is on, treat the nav as already visible so the
  // animate prop resolves to { y: 0 } immediately — no invisible-then-snap flash.

  // Unique per Nav instance — prevents layoutId collisions when multiple Nav
  // components are mounted simultaneously (e.g. desktop + mobile variants).
  const navId = useId();

  const springTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 380, damping: 30, mass: 1 };

  const resolvedItems: NavItem[] = items ?? [...NAV_ITEMS];
  const isProject = variant === 'project';

  return (
    <motion.nav
      ref={ref}
      aria-label={isProject ? 'Project navigation' : 'Main navigation'}
      initial={animateEntrance && !prefersReducedMotion ? { y: -100 } : false}
      animate={
        isExiting
          ? { y: -100 }
          : (visible || !!prefersReducedMotion)
          ? { y: 0 }
          : { y: -100 }
      }
      transition={
        prefersReducedMotion || isExiting
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 28, delay: entranceDelay ?? 0.1 }
      }
      /**
       * Position: fixed at token-driven offsets.
       * Tailwind arbitrary values reference the CSS custom properties so
       * there are zero hardcoded pixel values here.
       */
      className={cn(
        'fixed z-50 left-0 right-0 flex justify-center pointer-events-none',
        'top-[var(--nav-top-mobile)] md:top-[var(--nav-top-desktop)]',
        'px-[var(--page-padding-mobile)] md:px-[var(--page-padding-desktop)]',
        className,
      )}
    >
      {/* ── pill container ──────────────────────────────────────────────── */}
      <ul
        role="list"
        onTouchStart={() => setHoveredId(null)}
        className={cn(
          'pointer-events-auto flex items-center w-full',
          'h-[var(--nav-height-mobile)] md:h-[var(--nav-height-desktop)]',
          // transition for disabled fade
          'transition-opacity duration-200',
          disabled ? 'opacity-40 pointer-events-none' : 'opacity-100',
        )}
        style={{
          background:   'var(--bg-nav)',
          border:       '1px solid var(--border-default-light)',
          borderRadius: 'var(--radius-pill)',
          boxShadow:    'var(--shadow-nav)',
          padding:      'var(--nav-inner-padding)',
        }}
      >
        <AnimatedBackground
          defaultValue={displayedActiveId}
          className="rounded-[var(--radius-pill)] bg-[var(--bg-nav-selected)]"
          transition={springTransition}
          layoutId={`nav-active-pill-${navId}`}
          animateOpacity={false}
        >
          {resolvedItems.map((item, index) => {
            const isActive = activeSection === item.id;
            const isVisuallyActive = cursorActive ? displayedActiveId === item.id : isActive;

            /**
             * Project variant mobile layout (Figma: 954-40878):
             *   First item ("Globo") and last item ("Next project") shrink to
             *   their label width; the middle item (client name) fills the
             *   remaining space. On desktop all items are equal-width (flex-1).
             *
             * Home variant: all items flex-1 at every breakpoint.
             */
            const liFlexClass =
              isProject && (index === 0 || index === resolvedItems.length - 1)
                ? 'flex shrink-0 md:flex-1'
                : 'flex flex-1';

            return (
              <li key={item.id} data-id={item.id} className={liFlexClass}>
                <a
                  href={item.href || undefined}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={disabled || (isProject && isActive) ? true : undefined}
                  tabIndex={
                    disabled    ? -1 :
                    !item.href  ? 0  :
                    undefined
                  }
                  onClick={(e) => {
                    // Project variant: active item (client name) is non-navigable.
                    if (isProject && isActive) {
                      e.preventDefault();
                      return;
                    }
                    // Project variant: animate pill first, then navigate after delay.
                    if (isProject && !isActive && item.href && onItemClick) {
                      e.preventDefault();
                      onItemClick(item.id);
                      return;
                    }
                    // Home variant: intercept click when JS handles scroll-nav.
                    if (!isProject && onItemClick) {
                      e.preventDefault();
                      onItemClick(item.id);
                    }
                  }}
                  /**
                   * Each item fills the li's flex space.
                   * focus-visible: ring outside the pill for keyboard nav (WCAG 2.4.7)
                   */
                  className={cn(
                    'relative flex flex-1 items-center justify-center',
                    'rounded-[var(--radius-pill)] select-none',
                    isProject && isActive ? 'cursor-default' : 'cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2',
                    cursorActive && "before:content-[''] before:absolute before:inset-x-0 before:top-[-20px] before:bottom-[-20px]",
                  )}
                  style={{ padding: 'var(--nav-item-padding)' }}
                  onMouseEnter={() => {
                    if (hoverQuery?.matches) setHoveredId(item.id);
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* ── hover pill (inactive items only) — hidden in cursorActive mode ── */}
                  {!cursorActive && (
                    <AnimatePresence>
                      {hoveredId === item.id && !isActive && (
                        <motion.div
                          layoutId={`nav-hover-pill-${navId}`}
                          className="absolute inset-0 rounded-[var(--radius-pill)]"
                          style={{ background: 'var(--bg-nav-hover)' }}
                          transition={springTransition}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>
                  )}

                  {/* ── label ───────────────────────────────────────────── */}
                  <span
                    className={cn(
                      'relative z-10 whitespace-nowrap',
                      // Figma: Helvetica Neue Regular — explicit family + weight
                      '[font-family:var(--font-sans)] font-normal',
                      // font size: Label-Small 14/18 on mobile → Label 16/24 on desktop
                      'text-[var(--text-label-sm-size)] leading-[var(--text-label-sm-leading)]',
                      'md:text-[var(--text-label-size)] md:leading-[var(--text-label-leading)]',
                      'transition-colors duration-100',
                    )}
                    style={{
                      color: isVisuallyActive
                        ? 'var(--text-nav-item-selected)'
                        : 'var(--text-nav-item)',
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </AnimatedBackground>
      </ul>
    </motion.nav>
  );
});

Nav.displayName = 'Nav';
