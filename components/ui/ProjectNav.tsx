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
 * disabled     — disables all items (use during page transitions)
 * className    — extra classes forwarded to both <nav> wrappers
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Nav, type NavItem } from '@/components/ui/Nav';
import { useProjectTransition } from '@/components/ui/ProjectTransitionContext';
import { BG_PAGE_LIGHT } from '@/lib/utils';

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
  /** bgColor of the next project — used as exit target on the mobile "Next" button. */
  nextBgColor: string;
  /** Override the mobile right-hand item label. Defaults to "Next project". */
  nextLabel?: string;
  /** Disables all items — use during page transitions. */
  disabled?: boolean;
  /** Extra classes forwarded to the <nav> element via Nav's className prop. */
  className?: string;
}

// ─── local type ───────────────────────────────────────────────────────────────

type NavItemWithBg = NavItem & { targetBg: string };

// ─── component ────────────────────────────────────────────────────────────────

export const ProjectNav = React.forwardRef<HTMLElement, ProjectNavProps>(
  function ProjectNav(
    {
      clientName,
      activeSlug,
      nextHref,
      nextBgColor,
      allProjects,
      nextLabel = 'Next project',
      disabled,
      className,
    },
    ref,
  ) {
    const [desktopActive, setDesktopActive] = useState(activeSlug);
    const [mobileActive, setMobileActive]   = useState<string>('client');
    const { startExit, isExiting } = useProjectTransition();

    useEffect(() => { setDesktopActive(activeSlug); }, [activeSlug]);
    useEffect(() => { setMobileActive('client'); }, [activeSlug]);

    function handleNavClick(
      itemId: string,
      items: NavItemWithBg[],
      setActive: (id: string) => void,
    ) {
      const item = items.find((i) => i.id === itemId);
      if (!item?.href) return;
      setActive(itemId);
      startExit(item.targetBg, item.href);
    }

    // Desktop: Globo + one item per project, all navigable except the active one.
    const desktopItems = useMemo<NavItemWithBg[]>(
      () => [
        { id: 'home', label: 'Globo', href: '/', targetBg: BG_PAGE_LIGHT },
        ...allProjects.map((p) => ({
          id: p.slug,
          label: p.clientName,
          href: `/work/${p.slug}`,
          targetBg: p.bgColor,
        })),
      ],
      [allProjects],
    );

    // Mobile: unchanged — Globo, active client name, Next project.
    const mobileItems = useMemo<NavItemWithBg[]>(
      () => [
        { id: 'home',   label: 'Globo',    href: '/',      targetBg: BG_PAGE_LIGHT },
        { id: 'client', label: clientName, href: '',       targetBg: ''        },
        { id: 'next',   label: nextLabel,  href: nextHref, targetBg: nextBgColor },
      ],
      [clientName, nextLabel, nextHref, nextBgColor],
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
            onItemClick={(id) => handleNavClick(id, desktopItems, setDesktopActive)}
            disabled={disabled}
            isExiting={isExiting}
            className={className}
            cursorActive
          />
        </div>

        {/* ── Mobile nav (<md): 3 items ──────────────────────────────────── */}
        <div className="md:hidden">
          <Nav
            variant="project"
            items={mobileItems}
            activeSection={mobileActive}
            onItemClick={(id) => handleNavClick(id, mobileItems, setMobileActive)}
            disabled={disabled}
            isExiting={isExiting}
            className={className}
            cursorActive
          />
        </div>
      </>
    );
  },
);

ProjectNav.displayName = 'ProjectNav';
