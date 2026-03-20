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
  | { id?: string; type: 'full-bleed';   src: string; alt: string; color: string; aspectRatio: string; objectFit?: 'cover' | 'contain' }
  | { id?: string; type: 'two-image';    srcA: string; altA: string; aspectRatioA: string; srcB: string; altB: string; aspectRatioB: string; color: string; colorB?: string; maxHeightB?: string }
  | { id?: string; type: 'caption'; alignment: CaptionAlignment; text: string | [string, string] }
  | { id?: string; type: 'video'; src: string; title: string; color?: string; aspectRatio?: string }

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
    nextSlug: 'open-insurance',
    bgColor: 'var(--bg-page-project-ow)',
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

  // ── Open Insurance ───────────────────────────────────────────────────────────
  {
    slug: 'open-insurance',
    clientName: 'Open Insurance',
    nextSlug: 'kicbox',
    bgColor: 'var(--bg-page-project-oi)',
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
      {
        type: 'hero',
        src: '/Open Insurance/OI-hero.png',
        alt: 'Open Insurance — Huddle app on mobile, select and customise your cover',
        priority: true,
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Huddle-1.png',
        alt: 'Open Insurance — Huddle car insurance — quote start and vehicle details screens',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Huddle-2.png',
        alt: 'Open Insurance — Huddle car insurance — cover selection and excess screens',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'single-color',
        src: '/Open Insurance/OI-Huddle-flow.png',
        alt: 'Open Insurance — Huddle full user flow diagram',
        color: 'var(--bg-project-oi)',
        aspectRatio: '4278/6029',
      },
      {
        type: 'single-color',
        src: '/Open Insurance/OI-Characters.png',
        alt: 'Open Insurance — Huddle brand character illustrations',
        color: 'var(--bg-project-oi)',
        aspectRatio: '4224/2896',
      },
      {
        type: 'two-image',
        srcA: '/Open Insurance/OI-continue.png',
        altA: 'Open Insurance — quote summary card for Mario Puzo',
        aspectRatioA: '1286/1820',
        srcB: '/Open Insurance/OI-telstra.png',
        altB: 'Open Insurance — Telstra Home Insurance promotion card',
        aspectRatioB: '1286/1820',
        color: 'var(--bg-project-oi)',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Huddle-3.png',
        alt: 'Open Insurance — Huddle car insurance — policy summary and confirmation screens',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'single-white',
        src: '/Open Insurance/OI-brand-icons.svg',
        alt: 'Open Insurance — full brand icon library',
        aspectRatio: '4536/3228',
      },
      {
        type: 'single-color',
        src: '/Open Insurance/OI-brand-icons-detail.png',
        alt: 'Open Insurance — brand icon detail, 12 insurance category icons',
        color: 'var(--bg-project-oi)',
        aspectRatio: '4224/2896',
      },
      {
        type: 'single-color',
        src: '/Open Insurance/OI-design-system-1.png',
        alt: 'Open Insurance — Open Design System component library',
        color: 'var(--bg-project-oi)',
        aspectRatio: '8727/11079',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-spec.png',
        alt: 'Open Insurance — Open Design System branding specifications',
        color: 'var(--bg-project-oi)',
        aspectRatio: '4224/2896',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Bupa-5.png',
        alt: 'Open Insurance — Bupa car insurance quote flow, payment step',
        color: 'var(--bg-project-oi)',
        aspectRatio: '4224/2320',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Bupa-1.png',
        alt: 'Open Insurance — Bupa car insurance quote flow, personal details step',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Bupa-2.png',
        alt: 'Open Insurance — Bupa car insurance quote flow, vehicle details step',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Bupa-3.png',
        alt: 'Open Insurance — Bupa car insurance quote flow, cover selection step',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Bupa-4.png',
        alt: 'Open Insurance — Bupa car insurance quote flow, excess and extras step',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-Bupa-6.png',
        alt: 'Open Insurance — Bupa car insurance quote flow, confirmation step',
        color: 'var(--bg-project-oi)',
        aspectRatio: '4224/2896',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-ahm.png',
        alt: 'Open Insurance — AHM home and contents insurance quote screens',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-polestar.png',
        alt: 'Open Insurance — Polestar Insurance quote and policy screens',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
      {
        type: 'full-bleed',
        src: '/Open Insurance/OI-slingshot.png',
        alt: 'Open Insurance — Slingshot home insurance quote screens',
        color: 'var(--bg-project-oi)',
        aspectRatio: '2112/1448',
      },
    ],
  },

  // ── kicbox ───────────────────────────────────────────────────────────────────
  {
    slug: 'kicbox',
    clientName: 'kicbox',
    nextSlug: 'multipleprojects',
    bgColor: 'var(--bg-page-project-kicbox)',
    intro: {
      heading: (
        <>
          <span className="font-serif">kicbox - </span>
          <span className="font-serif text-[var(--text-muted)]">What </span>
          <span className="font-sans text-[var(--text-muted)]">matters</span>
          <span className="font-serif text-[var(--text-muted)]"> most to </span>
          <span className="font-sans text-[var(--text-muted)]">kids</span>
          <span className="font-serif text-[var(--text-muted)]"> in </span>
          <span className="font-sans text-[var(--text-muted)]">care</span>
          <span className="font-serif text-[var(--text-muted)]">?</span>
        </>
      ),
      body: "Young people in care don't always have the things kids in more stable homes take for granted. kicbox gives them a safe and secure place to keep important information and documents that can help them get ahead in education and employment. It also helps them keep photos, memorabilia and other childhood memories of growing up that help with their sense of identity through life.",
      description: 'UX and product design for kicbox — a safe digital home for young people in care to store important documents, memories, and build their sense of identity.',
    },
    contentBlocks: [
      // 1. Hero
      {
        type: 'hero',
        src: '/kicbox/kicbox-hero.png',
        alt: 'kicbox app on iPhone — home screen showing saved documents and memories',
        priority: true,
      },

      // 2. Full-Bleed — logo wherever
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-logo-wherever.png',
        alt: 'kicbox — logo in context across brand touchpoints',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '4224/2366',
      },

      // 2b. Caption
      {
        type: 'caption',
        alignment: 'left',
        text: 'Working closely with UX design on a variety of activities designed to uncover the needs, habits, thoughts and feelings of the app\'s users, which ranged from the youth, their carers and the Child Safety team. These included ethnographic research, interviews and workshops. Rapid prototype testing and pilots. Led the design of the app\'s interface, visual identity and the related promotional material.',
      },

      // 3+4. Two-Image — ethnographic research + ideation
      {
        type: 'two-image',
        srcA: '/kicbox/kicbox-etnographic-research.png',
        altA: 'kicbox — ethnographic research process',
        aspectRatioA: '1223/1070',
        srcB: '/kicbox/kicbox-ideation.png',
        altB: 'kicbox — ideation workshop',
        aspectRatioB: '1223/1070',
        color: 'var(--bg-project-kicbox)',
      },

      // Caption
      {
        type: 'caption',
        alignment: 'left',
        text: 'Without a preconceived idea of what kicbox could be we wanted to make the most of the fixed time and funding available for an initial pilot by designing and building the features that would make the biggest difference to Young People.',
      },

      // 5+6. Two-Image — moodboard + rapid prototype
      {
        type: 'two-image',
        srcA: '/kicbox/kicbox-moodboard.png',
        altA: 'kicbox — moodboard exploration',
        aspectRatioA: '1223/1070',
        srcB: '/kicbox/kicbox-rapid-prototype.png',
        altB: 'kicbox — rapid prototype testing',
        aspectRatioB: '1223/1070',
        color: 'var(--bg-project-kicbox)',
      },

      // Caption — rapid prototype
      {
        type: 'caption',
        alignment: 'left',
        text: "We put Young People in the driver's seat when it came to visual design. I ran moodboard and sticker exercises and took their direction through to the final design.",
      },

      // 7. Full-Bleed — backgrounds
      {
        type: 'full-bleed',
        src: '/kicbox/kickbox-backgrounds.png',
        alt: 'kicbox — background design explorations',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '2133/1252',
        objectFit: 'contain',
      },

      // 8+9. Two-Image — logo animated + animation
      {
        type: 'two-image',
        srcA: '/kicbox/kicbox-logo-animated.gif',
        altA: 'kicbox — animated logo reveal',
        aspectRatioA: '2880/2048',
        srcB: '/kicbox/kicbox-animation.gif',
        altB: 'kicbox — animated app UI transitions and micro-interactions',
        aspectRatioB: '408/732',
        color: 'var(--bg-project-kicbox)',
        colorB: '#ffffff',
        maxHeightB: '800px',
      },

      // 10. Full-Bleed — mobile screen 1
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-mobile-1.png',
        alt: 'kicbox app — documents and files management screen',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '4224/2896',
      },

      // 11. Full-Bleed — mobile screen 2
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-mobile-2.png',
        alt: 'kicbox app — memories and photo collection screen',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '4224/2896',
      },

      // 12. Full-Bleed — CSO desktop
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-cso-desktop.png',
        alt: 'kicbox — Child Safety Officer desktop dashboard',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '2625/1478',
      },

      // 13. Full-Bleed — CSO mobile
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-cso-mobile.png',
        alt: 'kicbox — Child Safety Officer mobile view',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '4224/2896',
      },

      // 14. Full-Bleed — posters
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-posters.png',
        alt: 'kicbox — promotional posters for care organisations',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '2133/1487',
      },

      // 15. Full-Bleed — ecosystem
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-ecosistem.png',
        alt: 'kicbox — product ecosystem showing app, web platform and touchpoints',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '2131/1251',
      },

      // 16. Video
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=t3NtV5vvXMQ',
        title: 'kicbox — product overview',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '16/9',
      },
    ],
  },

  // ── Multiple projects ─────────────────────────────────────────────────────────
  {
    slug: 'multipleprojects',
    clientName: 'Multiple projects',
    nextSlug: 'officeworks',
    bgColor: 'var(--bg-page-project-levo)',
    intro: {
      heading: (
        <>
          <span className="font-serif">Multiple projects</span>
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
