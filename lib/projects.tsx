/**
 * lib/projects.tsx
 *
 * Case study data for all project pages.
 * Extension .tsx because the `heading` prop contains JSX (mixed serif/sans).
 *
 * To add a new project:
 *   1. Add a Project entry to PROJECTS below.
 *   2. Update the nextSlug of the preceding project to point to the new slug.
 *   3. Add images to /public/projects/[slug]/ and update contentBlocks.
 */

import React from 'react';
import type { CaptionAlignment } from '@/components/ui/CaptionText';

// Re-export so callers can import CaptionAlignment from one place.
export type { CaptionAlignment };

// ─── types ────────────────────────────────────────────────────────────────────

export type ContentBlock =
  | { id?: string; type: 'hero';         src: string; alt: string; priority?: boolean }
  | { id?: string; type: 'single-white'; src: string; alt: string; aspectRatio: string }
  | { id?: string; type: 'single-color'; src: string; alt: string; color: string; aspectRatio: string }
  | { id?: string; type: 'full-bleed';   src: string; alt: string; color: string; aspectRatio: string }
  | { id?: string; type: 'two-image';    srcA: string; altA: string; aspectRatioA: string; srcB: string; altB: string; aspectRatioB: string; color: string }
  | { id?: string; type: 'caption'; alignment: CaptionAlignment; text: string | [string, string] }

export interface Project {
  slug: string;
  /** Label for the active ProjectNav center item */
  clientName: string;
  /** Slug of the next project in the cycle */
  nextSlug: string;
  /** Outer page background — raw hex, project-specific (not a token) */
  bgColor: string;
  /** Optional override for the PageWrapper background. Defaults to var(--bg-page).
   *  Use 'var(--bg-page-white)' for a pure white wrapper. */
  wrapperColor?: string;
  intro: {
    /** Mixed serif/sans JSX heading — defined inline per project */
    heading: React.ReactNode;
    body: string;
    /** 150-char max — used for <meta description> and Open Graph */
    description: string;
  };
  contentBlocks: ContentBlock[];
}

// ─── project data ─────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  // ── Officeworks ──────────────────────────────────────────────────────────────
  {
    slug: 'officeworks',
    clientName: 'Officeworks',
    nextSlug: 'taronga-zoo',
    bgColor: '#001db0',
    wrapperColor: 'var(--bg-page)',
    intro: {
      heading: (
        <>
          <span className="font-serif">Officeworks</span>
          <span className="font-sans"> — Manage your </span>
          <span className="font-serif">B2B account</span>
          <span className="font-sans"> efficiently and do more</span>
        </>
      ),
      body: "Officeworks is Australia's largest supplier of office products and services. I led the end-to-end UX and product design for their B2B digital platform — redesigning the account management experience to help business customers order smarter, track spending, and manage their teams with confidence.",
      description: "End-to-end UX and product design for Officeworks' B2B digital platform — redesigning account management to help businesses order smarter and manage teams with confidence.",
    },
    contentBlocks: [
      // Hero
      {
        type: 'hero',
        src: '/Officeworks/OW-hero.png',
        alt: 'Officeworks B2B platform overview — hand holding iPad showing catalogue management screen',
        priority: true,
      },
      {
        type: 'caption',
        alignment: 'space-between',
        text: ['Account management dashboard', 'Officeworks B2B — 2024'],
      },

      // White card — icon library
      {
        type: 'single-white',
        src: '/Officeworks/OW-icons-1.svg',
        alt: 'Officeworks B2B design system icon library — 200+ custom icons',
        aspectRatio: '2017/1380',
      },

      // Color background — design system
      {
        type: 'single-color',
        src: '/Officeworks/OW-DesignSystem-1.png',
        alt: 'Officeworks B2B design system — full component library overview',
        color: 'var(--bg-project-ow)',
        aspectRatio: '9665/10954',
      },

      // Full-bleed — UI screenshot
      {
        type: 'full-bleed',
        src: '/Officeworks/OW-CustomCatalogues-1.png',
        alt: 'Officeworks B2B custom catalogues — create and manage curated product lists',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // White card — colour palette
      {
        type: 'single-white',
        src: '/Officeworks/OW-colours.png',
        alt: 'Officeworks B2B design system colour palette',
        aspectRatio: '4296/3816',
      },

      // Two-image — custom catalogues detail + icons
      {
        type: 'two-image',
        srcA: '/Officeworks/OW-CustomCatalogues-card.png',
        altA: 'Officeworks B2B custom catalogues — product list detail view',
        aspectRatioA: '1929/2730',
        srcB: '/Officeworks/OW-icons-2.png',
        altB: 'Officeworks B2B design system icon set — second collection',
        aspectRatioB: '1929/2730',
        color: 'var(--bg-project-ow)',
      },

      // White card — icon library vol. 3
      {
        type: 'single-white',
        src: '/Officeworks/OW-Icons-3.svg',
        alt: 'Officeworks B2B design system icon library — third collection',
        aspectRatio: '1318/904',
      },

      // Full-bleed — account contacts
      {
        type: 'full-bleed',
        src: '/Officeworks/OW-AccountContacts-1.png',
        alt: 'Officeworks B2B — account contacts management screen',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — address management
      {
        type: 'full-bleed',
        src: '/Officeworks/OW-Address.png',
        alt: 'Officeworks B2B — organisation address management screen',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — cost centres
      {
        type: 'full-bleed',
        src: '/Officeworks/OW-CostCentres.png',
        alt: 'Officeworks B2B — cost centre permissions and delivery address management',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — custom catalogues step 2
      {
        type: 'full-bleed',
        src: '/Officeworks/OW-CustomCatalogues-2.png',
        alt: 'Officeworks B2B — custom catalogues product selection and CSV import',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — custom catalogues step 3
      {
        type: 'full-bleed',
        src: '/Officeworks/OW-CustomCatlogues-3.png',
        alt: 'Officeworks B2B — custom catalogues exclusive products and search',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — custom catalogues step 4
      {
        type: 'full-bleed',
        src: '/Officeworks/OW-CustomCatalogues-4.png',
        alt: 'Officeworks B2B — manage custom catalogue assignment and delete',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — mobile account management
      {
        type: 'full-bleed',
        src: '/Officeworks/OW-ManageMobile.png',
        alt: 'Officeworks B2B — mobile account settings, addresses and contact management',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },
    ],
  },

  // ── Taronga Zoo (stub) ───────────────────────────────────────────────────────
  {
    slug: 'taronga-zoo',
    clientName: 'Taronga Zoo',
    nextSlug: 'open-insurance',
    bgColor: '#1a3d2b',
    intro: {
      heading: (
        <>
          <span className="font-serif">Taronga Zoo</span>
          <span className="font-sans"> — Connecting visitors with </span>
          <span className="font-serif">wildlife</span>
        </>
      ),
      body: 'Content coming soon.',
      description: 'UX and digital design for Taronga Zoo — connecting visitors with wildlife through a reimagined digital experience.',
    },
    contentBlocks: [
      { type: 'hero', src: '/Officeworks/OW-hero.png', alt: 'Officeworks B2B platform overview — hand holding iPad showing catalogue management screen', priority: true },
      { type: 'single-white', src: '/Officeworks/OW-icons-1.svg', alt: 'Officeworks B2B design system icon library — 200+ custom icons', aspectRatio: '2017/1380' },
      { type: 'single-color', src: '/Officeworks/OW-DesignSystem-1.png', alt: 'Officeworks B2B design system — full component library overview', color: 'var(--bg-block-grey)', aspectRatio: '9665/10954' },
      { type: 'full-bleed', src: '/Officeworks/OW-CustomCatalogues-1.png', alt: 'Officeworks B2B custom catalogues — create and manage curated product lists', color: 'var(--bg-block-grey)', aspectRatio: '6336/4344' },
    ],
  },

  // ── Open Insurance (stub) ────────────────────────────────────────────────────
  {
    slug: 'open-insurance',
    clientName: 'Open Insurance',
    nextSlug: 'levo',
    bgColor: '#1c1c3a',
    intro: {
      heading: (
        <>
          <span className="font-serif">Open Insurance</span>
          <span className="font-sans"> — Making </span>
          <span className="font-serif">insurance</span>
          <span className="font-sans"> simple</span>
        </>
      ),
      body: 'Content coming soon.',
      description: 'Product design for Open Insurance — simplifying the insurance experience with a transparent, people-first digital product.',
    },
    contentBlocks: [
      { type: 'hero', src: '/Officeworks/OW-hero.png', alt: 'Officeworks B2B platform overview — hand holding iPad showing catalogue management screen', priority: true },
      { type: 'single-white', src: '/Officeworks/OW-icons-1.svg', alt: 'Officeworks B2B design system icon library — 200+ custom icons', aspectRatio: '2017/1380' },
      { type: 'single-color', src: '/Officeworks/OW-DesignSystem-1.png', alt: 'Officeworks B2B design system — full component library overview', color: 'var(--bg-block-grey)', aspectRatio: '9665/10954' },
      { type: 'full-bleed', src: '/Officeworks/OW-CustomCatalogues-1.png', alt: 'Officeworks B2B custom catalogues — create and manage curated product lists', color: 'var(--bg-block-grey)', aspectRatio: '6336/4344' },
    ],
  },

  // ── Levo (stub) ──────────────────────────────────────────────────────────────
  {
    slug: 'levo',
    clientName: 'Levo',
    nextSlug: 'officeworks',
    bgColor: '#2d1a00',
    intro: {
      heading: (
        <>
          <span className="font-serif">Levo</span>
          <span className="font-sans"> — Financial tools for </span>
          <span className="font-serif">modern teams</span>
        </>
      ),
      body: 'Content coming soon.',
      description: 'UX and product design for Levo — building financial tools that help modern teams spend, track, and grow with confidence.',
    },
    contentBlocks: [
      { type: 'hero', src: '/Officeworks/OW-hero.png', alt: 'Officeworks B2B platform overview — hand holding iPad showing catalogue management screen', priority: true },
      { type: 'single-white', src: '/Officeworks/OW-icons-1.svg', alt: 'Officeworks B2B design system icon library — 200+ custom icons', aspectRatio: '2017/1380' },
      { type: 'single-color', src: '/Officeworks/OW-DesignSystem-1.png', alt: 'Officeworks B2B design system — full component library overview', color: 'var(--bg-block-grey)', aspectRatio: '9665/10954' },
      { type: 'full-bleed', src: '/Officeworks/OW-CustomCatalogues-1.png', alt: 'Officeworks B2B custom catalogues — create and manage curated product lists', color: 'var(--bg-block-grey)', aspectRatio: '6336/4344' },
    ],
  },
];

// ─── lookup map ───────────────────────────────────────────────────────────────

const PROJECT_MAP = new Map<string, Project>(
  PROJECTS.map((p) => [p.slug, p]),
);

// ─── exports ──────────────────────────────────────────────────────────────────

/** Returns the project for the given slug, or undefined if not found. */
export function getProject(slug: string): Project | undefined {
  return PROJECT_MAP.get(slug);
}

/** Returns all known project slugs (used for generateStaticParams). */
export function getAllSlugs(): string[] {
  return PROJECTS.map((p) => p.slug);
}

/** Returns slug + clientName + bgColor for every project — used to build the desktop nav. */
export function getNavProjects(): Array<{ slug: string; clientName: string; bgColor: string }> {
  return PROJECTS.map((p) => ({ slug: p.slug, clientName: p.clientName, bgColor: p.bgColor }));
}
