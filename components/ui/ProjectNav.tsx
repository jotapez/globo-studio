'use client';

/**
 * ProjectNav — project-page variant of the pill navigation bar
 *
 * Figma: project-nav-desktop (970:43877) / project-nav-mobile (954:40878)
 * Spec:  docs/screens/project-page-spec.md § 1. Navigation (Project Variant)
 *
 * Layout
 * ──────
 * Renders two <Nav> instances toggled by breakpoint:
 *
 * Desktop (md+) — 5 equal-width items:
 *   [ Globo ]  [ Officeworks ]  [ Taronga Zoo ]  [ Open Insurance ]  [ Levo ]
 *                      ↑ active item filled; click suppressed
 *
 * Mobile (<md) — 3 items (unchanged):
 *   [ Globo ]  [ <Client name> ]  [ Next project ]
 *                    ↑ always active (filled pill)
 *   First and last shrink to content width; middle fills remaining space.
 *
 * Behaviour
 * ─────────
 * • "Globo"        → navigates to `/`               (page link, same tab)
 * • Active item    → click is suppressed             (no navigation)
 * • Other projects → navigate to their /work/[slug] (page link, same tab)
 * • "Next project" → navigates to `nextHref`         (mobile only, same tab)
 * • On mobile, pill stays on the clicked item until the new page has loaded
 *   (minimum 300 ms). The client label does not update until the pill returns.
 *
 * Dark / light mode
 * ─────────────────
 * Inherits all colour tokens from Nav — no additional token work needed.
 *
 * Props
 * ─────
 * clientName   — label for the active item (e.g. "Officeworks")
 * activeSlug   — slug of the current project (used as activeSection on desktop)
 * nextHref     — href for the "Next project" item (mobile nav only)
 * allProjects  — ordered list of all projects for the desktop nav items
 * nextLabel    — override the "Next project" label (default: "Next project")
 * isPending    — true while the next page is loading (from useTransition)
 * disabled     — disables all items (use during page transitions)
 * className    — extra classes forwarded to both <nav> wrappers
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Nav, type NavItem } from '@/components/ui/Nav';
import { useProjectTransition } from '@/components/ui/ProjectTransitionContext';

// ─── types ────────────────────────────────────────────────────────────────────

export interface ProjectNavProps {
  /** Label for the active item — should match the case study name. */
  clientName: string;
  /** Slug of the current project — determines the active pill on desktop. */
  activeSlug: string;
  /** href for the "Next project" link (e.g. "/work/taronga-zoo"). Mobile only. */
  nextHref: string;
  /** Ordered list of all projects, used to build the desktop nav items. */
  allProjects: Array<{ slug: string; clientName: string; bgColor: string }>;
  /** Override the mobile right-hand item label. Defaults to "Next". */
  nextLabel?: string;
  /** True while the next page is loading — controls when the pill returns. */
  isPending?: boolean;
  /** Disables all items — use during page transitions. */
  disabled?: boolean;
  /** Extra classes forwarded to the <nav> element via Nav's className prop. */
  className?: string;
}

// ─── constants ────────────────────────────────────────────────────────────────

const MIN_PILL_MS = 300;
const NEXT_NAV_DELAY_MS = 500; // 300 ms spring settle + 200 ms hold

// ─── component ────────────────────────────────────────────────────────────────

export const ProjectNav = React.forwardRef<HTMLElement, ProjectNavProps>(
  function ProjectNav(
    {
      clientName,
      activeSlug,
      nextHref,
      allProjects,
      nextLabel = 'Next',
      isPending = false,
      disabled,
      className,
    },
    ref,
  ) {
    // Desktop active tracks activeSlug directly — no buffering needed.
    const [desktopActive, setDesktopActive] = useState(activeSlug);

    // Mobile active pill position.
    const [mobileActive, setMobileActive] = useState<string>('client');

    // Displayed client name — only updates when page is ready + 300 ms min.
    const [displayedClientName, setDisplayedClientName] = useState(clientName);

    const { startExit } = useProjectTransition();

    // ── navigation tracking refs ──────────────────────────────────────────────
    const isNavigatingMobileRef = useRef(false);
    const applyTimeoutRef       = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Always-current snapshot of the latest clientName prop (no effect deps needed).
    const clientNameRef = useRef(clientName);
    clientNameRef.current = clientName;

    // Desktop: update immediately whenever slug changes.
    useEffect(() => { setDesktopActive(activeSlug); }, [activeSlug]);

    // Mobile label + pill: only update when NOT in a mobile navigation.
    // Handles direct URL changes (e.g. browser back/forward).
    useEffect(() => {
      if (!isNavigatingMobileRef.current) {
        setDisplayedClientName(clientName);
        setMobileActive('client');
      }
    }, [clientName, activeSlug]);

    // Cleanup on unmount.
    useEffect(() => {
      return () => {
        if (applyTimeoutRef.current) clearTimeout(applyTimeoutRef.current);
      };
    }, []);

    // ── click handler ─────────────────────────────────────────────────────────

    function handleNavClick(
      itemId: string,
      items: NavItem[],
      setActive: (id: string) => void,
      isMobile: boolean,
    ) {
      const item = items.find((i) => i.id === itemId);
      if (!item?.href) return;

      // Cancel any in-flight pill/nav timeout from a previous tap.
      if (applyTimeoutRef.current) {
        clearTimeout(applyTimeoutRef.current);
        applyTimeoutRef.current = null;
      }

      setActive(itemId); // pill starts moving immediately in all cases

      if (isMobile && itemId === 'home') {
        // Wait for pill to reach Globo before navigating away.
        applyTimeoutRef.current = setTimeout(() => {
          applyTimeoutRef.current = null;
          startExit(item.href);
        }, MIN_PILL_MS);
        return;
      }

      if (isMobile && itemId === 'next') {
        // Hold pill on 'next' (300 ms settle + 200 ms hold), then return.
        // The label update is intentionally left to the natural prop change
        // when the new page loads (~10 ms after startExit) — updating it here
        // would recalculate mobileItems mid-animation and cause a double pill.
        isNavigatingMobileRef.current = true;
        applyTimeoutRef.current = setTimeout(() => {
          applyTimeoutRef.current = null;
          isNavigatingMobileRef.current = false;
          setActive('client'); // pill returns to center

          applyTimeoutRef.current = setTimeout(() => {
            applyTimeoutRef.current = null;
            startExit(item.href); // navigate after return animation completes
          }, MIN_PILL_MS); // ~270 ms spring + buffer
        }, NEXT_NAV_DELAY_MS);
        return;
      }

      // Wait for the pill spring to settle before navigating.
      // On mouse, cursorActive pre-positions the pill so the wait is imperceptible.
      // On touch (tablet), this gives the full spring animation time to complete.
      applyTimeoutRef.current = setTimeout(() => {
        applyTimeoutRef.current = null;
        startExit(item.href);
      }, MIN_PILL_MS);
    }

    // Desktop: Globo + one item per project, all navigable except the active one.
    const desktopItems = useMemo<NavItem[]>(
      () => [
        { id: 'home', label: 'Globo', href: '/' },
        ...allProjects.map((p) => ({
          id: p.slug,
          label: p.clientName,
          href: `/work/${p.slug}`,
        })),
      ],
      [allProjects],
    );

    // Mobile: unchanged — Globo, active client name, Next project.
    const mobileItems = useMemo<NavItem[]>(
      () => [
        { id: 'home',   label: 'Globo',               href: '/'      },
        { id: 'client', label: displayedClientName,    href: ''       },
        { id: 'next',   label: nextLabel,              href: nextHref },
      ],
      [displayedClientName, nextLabel, nextHref],
    );

    return (
      <>
        {/* ── Desktop nav (md+): 5 items ─────────────────────────────────── */}
        <div className="hidden md:block">
          <Nav
            ref={ref}
            variant="project"
            items={desktopItems}
            activeSection={desktopActive}
            onItemClick={(id) => handleNavClick(id, desktopItems, setDesktopActive, false)}
            disabled={disabled}
            className={className}
            cursorActive
            clickFeedback
          />
        </div>

        {/* ── Mobile nav (<md): 3 items ──────────────────────────────────── */}
        <div className="md:hidden">
          <Nav
            variant="project"
            items={mobileItems}
            activeSection={mobileActive}
            onItemClick={(id) => handleNavClick(id, mobileItems, setMobileActive, true)}
            disabled={disabled}
            className={className}
            cursorActive
            clickFeedback
          />
        </div>
      </>
    );
  },
);

ProjectNav.displayName = 'ProjectNav';
