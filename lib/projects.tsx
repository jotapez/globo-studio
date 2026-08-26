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
  | { id?: string; chapterLabel?: string; type: 'hero';         src: string; mobileSrc?: string; alt: string; priority?: boolean }
  | { id?: string; chapterLabel?: string; type: 'single-white'; src: string; alt: string; aspectRatio: string }
  | { id?: string; chapterLabel?: string; type: 'single-color'; src: string; alt: string; color: string; aspectRatio: string }
  | { id?: string; chapterLabel?: string; type: 'full-bleed';   src: string; alt: string; color: string; aspectRatio: string; objectFit?: 'cover' | 'contain' }
  | { id?: string; chapterLabel?: string; type: 'two-image';    srcA: string; altA: string; aspectRatioA: string; srcB: string; altB: string; aspectRatioB: string; color: string; colorB?: string; maxHeightB?: string }
  | { id?: string; chapterLabel?: string; type: 'caption'; alignment: CaptionAlignment; text: string | [string, string] }
  | { id?: string; chapterLabel?: string; type: 'video'; src: string; title: string; color?: string; aspectRatio?: string }

export interface Project {
  slug: string;
  /** Label for the active ProjectNav center item */
  clientName: string;
  /** Slug of the next project in the cycle */
  nextSlug: string;
  /** When true, renders a password gate before the project content. */
  passwordProtected?: boolean;
  /** Password required to unlock this project. Only used when passwordProtected is true. */
  password?: string;
  /** Outer page background — raw hex, project-specific (not a token) */
  bgColor: string;
  /** Optional override for the PageWrapper background. Defaults to var(--bg-page).
   *  Use 'var(--bg-page-white)' for a pure white wrapper. */
  wrapperColor?: string;
  /** Background color token for the ContactFooter on this project page. */
  footerBgColor?: string;
  /** Clock and text theme for the ContactFooter. Default: 'auto'. */
  footerTheme?: 'auto' | 'light' | 'dark';
  /** Actual hex color for the iOS Safari theme-color meta tag. Matches footerBgColor. */
  footerThemeColor?: string;
  intro: {
    /** Mixed serif/sans JSX heading — defined inline per project */
    heading: React.ReactNode;
    /** Short intro paragraph — always visible. */
    body: React.ReactNode;
    /** Extra paragraphs revealed via "Read more" toggle. */
    extraBody?: React.ReactNode;
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
    passwordProtected: true,
    password: '2026',
    bgColor: 'var(--bg-page-project-ow)',
    wrapperColor: 'var(--bg-page)',
    footerBgColor: 'var(--bg-footer-project-ow)',
    footerTheme: 'dark',
    footerThemeColor: '#001db0',
    intro: {
      heading: (
        <>
          <span className="font-sans font-medium [letter-spacing:-0.03em]">Officeworks</span>
          {' — '}
          <br aria-hidden="true" />
          {'Less '}
          <span className="font-sans font-medium [letter-spacing:-0.03em]">admin,</span>
          {' more '}
          <span className="font-sans font-medium [letter-spacing:-0.03em]">control.</span>
        </>
      ),
      body: "Managing a business account at Officeworks (adding team members, assigning product catalogues, controlling who could order to which address and under which cost centre) meant calling customer support. There was no way to do it yourself. The B2B Digital Experience program set out to change that: a 5-year initiative to give business customers real autonomy over how they buy.",
      extraBody: (
        <>
          <p className="mb-[1em]">
            I joined as Lead Product Designer and led the work end-to-end, from discovery through to production. The challenge wasn&apos;t just designing individual features: it was understanding how a purchasing manager, a finance lead, and a branch buyer all experience the same account differently, and making sure the platform worked for all of them. The result: a self-service suite covering custom product catalogues, contact and role management, cost centre permissions, and delivery addresses, for desktop and mobile. Customer support dependency dropped by 40%.
          </p>
          <p>
            Running alongside the product work, I built the team&apos;s design system from scratch: an accessible visual language covering hundreds of components, colour tokens, and icon libraries. It became the foundation every new feature is built on. I also coached the design team on system thinking, governance, and variables, so the work wouldn&apos;t depend on me to continue.
          </p>
        </>
      ),
      description: "Officeworks — Less admin, more control. Officeworks B2B customers were managing their accounts over the phone. I redesigned that into a self-service platform — custom catalogues, team and permissions management, address controls — and built the design system from 0 to 1. Support calls dropped 40%.",
    },
    contentBlocks: [
      // Hero
      {
        type: 'hero',
        src: '/Officeworks/Desktop/OW-hero.png',
        mobileSrc: '/Officeworks/Mobile/OW-hero-mobile.png',
        alt: 'Officeworks B2B platform overview — hand holding iPad showing catalogue management screen',
        priority: true,
      },
      // Full-bleed — UI screenshot
      {
        type: 'full-bleed',
        src: '/Officeworks/Desktop/OW-CustomCatalogues-1.png',
        alt: 'Officeworks B2B custom catalogues — create and manage curated product lists',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — custom catalogues step 2
      {
        type: 'full-bleed',
        src: '/Officeworks/Desktop/OW-CustomCatalogues-2.png',
        alt: 'Officeworks B2B — custom catalogues product selection and CSV import',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — custom catalogues step 3
      {
        type: 'full-bleed',
        src: '/Officeworks/Desktop/OW-CustomCatlogues-3.png',
        alt: 'Officeworks B2B — custom catalogues exclusive products and search',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Two-image — custom catalogues detail + icons
      {
        type: 'two-image',
        srcA: '/Officeworks/Desktop/OW-CustomCatalogues-card.png',
        altA: 'Officeworks B2B custom catalogues — product list detail view',
        aspectRatioA: '1929/2730',
        srcB: '/Officeworks/Desktop/OW-icons-2.png',
        altB: 'Officeworks B2B design system icon set — second collection',
        aspectRatioB: '1929/2730',
        color: 'var(--bg-project-ow)',
      },

      // Full-bleed — custom catalogues step 4
      {
        type: 'full-bleed',
        src: '/Officeworks/Desktop/OW-CustomCatalogues-4.png',
        alt: 'Officeworks B2B — manage custom catalogue assignment and delete',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // White card — icon library
      {
        type: 'single-white',
        src: '/Officeworks/Desktop/OW-icons-1.svg',
        alt: 'Officeworks B2B design system icon library — 200+ custom icons',
        aspectRatio: '2017/1380',
      },

      // Color background — design system
      {
        type: 'single-color',
        src: '/Officeworks/Desktop/OW-DesignSystem-1.png',
        alt: 'Officeworks B2B design system — full component library overview',
        color: 'var(--bg-project-ow)',
        aspectRatio: '9665/10954',
      },

      // White card — colour palette
      {
        type: 'single-white',
        src: '/Officeworks/Desktop/OW-colours.png',
        alt: 'Officeworks B2B design system colour palette',
        aspectRatio: '4296/3816',
      },

      // Full-bleed — account contacts
      {
        type: 'full-bleed',
        src: '/Officeworks/Desktop/OW-AccountContacts-1.png',
        alt: 'Officeworks B2B — account contacts management screen',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // White card — icon library vol. 3
      {
        type: 'single-white',
        src: '/Officeworks/Desktop/OW-Icons-3.svg',
        alt: 'Officeworks B2B design system icon library — third collection',
        aspectRatio: '1318/904',
      },

      // Full-bleed — address management
      {
        type: 'full-bleed',
        src: '/Officeworks/Desktop/OW-Address.png',
        alt: 'Officeworks B2B — organisation address management screen',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — cost centres
      {
        type: 'full-bleed',
        src: '/Officeworks/Desktop/OW-CostCentres.png',
        alt: 'Officeworks B2B — cost centre permissions and delivery address management',
        color: 'var(--bg-project-ow)',
        aspectRatio: '6336/4344',
      },

      // Full-bleed — mobile account management
      {
        type: 'full-bleed',
        src: '/Officeworks/Desktop/OW-ManageMobile.png',
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
    footerBgColor: 'var(--bg-footer-project-oi)',
    footerTheme: 'dark',
    footerThemeColor: '#3638DE',
    intro: {
      heading: (
        <>
          <span className="font-sans font-medium [letter-spacing:-0.03em]">Open Insurance</span>
          {' — '}
          <br aria-hidden="true" />
          <span className="font-sans font-medium [letter-spacing:-0.03em]">Making</span>
          {' insurance '}
          <span className="font-sans font-medium [letter-spacing:-0.03em]">simple.</span>
        </>
      ),
      body: "Insurance has a conversion problem. At Open Insurance (an AirTree-backed insuretech building white-label insurance for businesses), analytics showed most users were dropping off before they ever saw a price. Not because the product was bad, but because the value wasn't visible early enough. That was the first thing I fixed.",
      extraBody: (
        <>
          <p className="mb-[1em]">
            Working with product and marketing, we moved the price to the front of the quote flow, letting people see exactly what they&apos;d pay and customise their cover before committing to the full journey. We tested it in Huddle, Open&apos;s own car insurance brand, before rolling it out to partners including Bupa, ahm, Polestar, and Slingshot. Sales went up 20% in the first month. Drop-offs fell by 70%.
          </p>
          <p>
            The bigger challenge was building at scale. Open&apos;s platform had to feel native to every partner&apos;s brand (from Huddle&apos;s warm, illustrated consumer product to Bupa&apos;s clinical precision) while being fast to deploy. I built the Open Design System: a token-based, multi-brand component library designed to configure and launch quote flows in weeks rather than months. It worked: time-to-market dropped by 50%, and the Bupa partnership went live in 10 weeks, half the time a launch like that typically takes. Throughout, I ran weekly customer interviews using the jobs-to-be-done framework, turning what we heard into specific flow improvements that kept drop-off rates falling long after launch.
          </p>
        </>
      ),
      description: 'Open Insurance — Making insurance simple. Open Insurance builds white-label insurance for brands like Bupa, Polestar, and Slingshot. I redesigned the quote flows that cut drop-offs by 70% and lifted sales 20% — then built the multi-brand design system that let us deliver Bupa\'s full platform in 10 weeks, half the time a launch like that usually takes.',
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
    nextSlug: 'retro',
    bgColor: 'var(--bg-page-project-kicbox)',
    footerBgColor: 'var(--bg-footer-project-kicbox)',
    footerTheme: 'dark',
    footerThemeColor: '#D42929',
    intro: {
      heading: (
        <>
          <span className="font-sans font-medium [letter-spacing:-0.03em]">kicbox</span>
          {' — '}
          <br aria-hidden="true" />
          {'What '}
          <span className="font-sans font-medium [letter-spacing:-0.03em]">matters</span>
          {' most '}
          <br aria-hidden="true" />
          {'to '}
          <span className="font-sans font-medium [letter-spacing:-0.03em]">kids</span>
          {' in '}
          <span className="font-sans font-medium [letter-spacing:-0.03em]">care?</span>
        </>
      ),
      body: "Young people in out-of-home care often move between placements, schools, and support workers. In the process, things get lost: documents, photos, memories, the small things that help you know who you are. kicbox was built to fix that: a safe, personal digital space where young people can store important documents, record their life story, set goals, and stay connected with their Child Safety Officer.",
      extraBody: (
        <>
          <p className="mb-[1em]">
            The project started with ethnographic research and co-design workshops with young people, carers, and Child Safety Officers across Queensland. Rather than designing for them, we designed with them, running moodboard exercises and dot-voting sessions where young people chose the look and feel themselves. They voted for playful, colourful, and personal: custom backgrounds, their own photos, emoji to log how they&apos;re feeling. The visual identity reflects exactly what they asked for.
          </p>
          <p>
            The result was a full product ecosystem: a cross-platform app for young people, a companion app for carers, and a dashboard for Child Safety Staff to monitor activity and keep in touch. Pilot feedback was immediate. Many young people uploaded their birth certificate on first use. For some, it was the first time they&apos;d ever seen it. Several, according to the evaluation report, couldn&apos;t stop grinning.
          </p>
        </>
      ),
      description: 'kicbox — What matters most to kids in care? Young people in out-of-home care often age out of the system without basic documents — sometimes without ever having seen their own birth certificate. kicbox gives them a safe place to keep what matters. I led design end-to-end, from co-design workshops with young people through to the app, identity, and promotional materials.',
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
        src: '/kicbox/kicbox-app-icon.png',
        alt: 'kicbox — app icon',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '4224/2366',
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

      // 12. Full-Bleed — ecosystem
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-ecosistem.png',
        alt: 'kicbox — product ecosystem showing app, web platform and touchpoints',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '2131/1251',
      },

      // 13. Full-Bleed — CSO desktop
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-cso-desktop.png',
        alt: 'kicbox — Child Safety Officer desktop dashboard',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '2625/1478',
      },

      // 14. Full-Bleed — CSO mobile
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-cso-mobile.png',
        alt: 'kicbox — Child Safety Officer mobile view',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '4224/2896',
      },

      // 15. Full-Bleed — carers
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-carers.png',
        alt: 'kicbox — carers app screens',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '4224/2896',
      },

      // 16. Full-Bleed — posters
      {
        type: 'full-bleed',
        src: '/kicbox/kicbox-posters.png',
        alt: 'kicbox — promotional posters for care organisations',
        color: 'var(--bg-project-kicbox)',
        aspectRatio: '2133/1487',
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

  // ── Retro ─────────────────────────────────────────────────────────────────────
  {
    slug: 'retro',
    clientName: 'Retro',
    nextSlug: 'officeworks',
    bgColor: 'var(--bg-page-project-retro)',
    footerBgColor: 'var(--bg-footer-project-retro)',
    footerTheme: 'light',
    footerThemeColor: '#F8F8F7',
    intro: {
      heading: (
        <>
          <span className="font-sans font-medium [letter-spacing:-0.03em]">Retrospective</span>
          {' — '}
          <br aria-hidden="true" />
          {'Different sectors, '}
          <span className="font-sans font-medium [letter-spacing:-0.03em]">same standard.</span>
        </>
      ),
      body: "Retro is a collection of client work from the past decade, not a single project, but a record of what it looks like to show up to very different briefs with the same standard of care. Government agencies. Enterprise platforms. Conservation charities. Global brands. The variety isn't incidental; it's the point.",
      extraBody: (
        <>
          <p className="mb-[1em]">
            At Taronga Zoo, I led the UX process for a website redesign centred on the zoo&apos;s conservation mission, running gut tests, moodboard workshops, and mobile-first usability sessions to establish what content needed to land before visitors scrolled anywhere. At the NSW Electoral Commission, I built a design system from the ground up using atomic design methodology, now used across all of the commission&apos;s digital properties. And at Coca-Cola Amatil, I led interaction and visual design for MYCCA: their B2B e-commerce platform serving business customers across Australia and New Zealand.
          </p>
          <p>
            The full list also includes Fidelity Life, Toyota, Infrastructure Australia, and the National Library of Australia. What connects them isn&apos;t the sector or the scale; it&apos;s the same starting point: understand the problem properly, then make something that genuinely works for the people who have to use it.
          </p>
        </>
      ),
      description: 'Retrospective — Different sectors, same standard. From Taronga Zoo to Coca-Cola Amatil to the NSW Electoral Commission — Retro is a decade of client work across sectors that demand very different things from design. Different stakes, different users, the same craft.',
    },
    contentBlocks: [
      { chapterLabel: 'Taronga Zoo',                type: 'full-bleed', src: '/Retro/Taronga-hero.png',               alt: 'Taronga Zoo — hero',              color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'full-bleed', src: '/Retro/Taronga-elephants-1.png',        alt: 'Taronga Zoo — elephants 1',       color: 'var(--bg-block-project-retro)', aspectRatio: '4224/2896' },
      { type: 'full-bleed', src: '/Retro/Taronga-elephants-2.png',        alt: 'Taronga Zoo — elephants 2',       color: 'var(--bg-block-project-retro)', aspectRatio: '4250/2904' },
      { chapterLabel: 'Coca-Cola MyCCA',            type: 'full-bleed', src: '/Retro/mycca-homepage.png',             alt: 'Mycca — homepage',                color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'two-image',  srcA: '/Retro/mycca-invoices.png', altA: 'Mycca — invoices', aspectRatioA: '1561/1361', srcB: '/Retro/mycca-mobile.png', altB: 'Mycca — mobile', aspectRatioB: '1561/1361', color: 'var(--bg-block-project-retro)' },
      { type: 'full-bleed', src: '/Retro/mycca-catalogue.png',            alt: 'Mycca — catalogue',               color: 'var(--bg-block-project-retro)', aspectRatio: '2112/1448' },
      { chapterLabel: 'NSW Electoral Commission',   type: 'full-bleed', src: '/Retro/NSWEC-homepage.png',             alt: 'NSWEC — homepage',                color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'two-image',  srcA: '/Retro/NSWEC-mobile-hero.png', altA: 'NSWEC — mobile hero', aspectRatioA: '1688/1832', srcB: '/Retro/NSWEC-icons.png', altB: 'NSWEC — icons', aspectRatioB: '2522/2735', color: 'var(--bg-block-project-retro)' },
      { type: 'full-bleed', src: '/Retro/NSWEC-mobile.png',               alt: 'NSWEC — mobile',                  color: 'var(--bg-block-project-retro)', aspectRatio: '2303/1579' },
      { chapterLabel: 'Achiever',                   type: 'full-bleed', src: '/Retro/Achiever-homepage.png',          alt: 'Achiever — homepage',             color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'full-bleed', src: '/Retro/Achiever-logo.png',              alt: 'Achiever — logo',                 color: 'var(--bg-block-project-retro)', aspectRatio: '3455/1883' },
      { type: 'full-bleed', src: '/Retro/Achiever-1.png',                 alt: 'Achiever — screen 1',             color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'full-bleed', src: '/Retro/Achiever-2.png',                 alt: 'Achiever — screen 2',             color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { chapterLabel: 'Fidelity Life',              type: 'full-bleed', src: '/Retro/FidelityLife-homepage.png',      alt: 'FidelityLife — homepage',         color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'full-bleed', src: '/Retro/FidelityLife-application.png',   alt: 'FidelityLife — application',     color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'full-bleed', src: '/Retro/FidelityLife-illustration.png',  alt: 'FidelityLife — illustration',    color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { chapterLabel: 'Toyota',                     type: 'full-bleed', src: '/Retro/Toyota-homepage.png',            alt: 'Toyota — homepage',               color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'two-image',  srcA: '/Retro/Toyota-make-mobile.png', altA: 'Toyota — make mobile', aspectRatioA: '797/1020', srcB: '/Retro/Toyota-nav-laptop.png', altB: 'Toyota — nav laptop', aspectRatioB: '797/1020', color: 'var(--bg-block-project-retro)' },
      { type: 'two-image',  srcA: '/Retro/Toyota-nav-mobile.png',  altA: 'Toyota — nav mobile',  aspectRatioA: '797/1020', srcB: '/Retro/Toyota-service.png',    altB: 'Toyota — service',    aspectRatioB: '797/1020', color: 'var(--bg-block-project-retro)' },
      { chapterLabel: 'Queensland Government',      type: 'full-bleed', src: '/Retro/CC-hero.png',              alt: 'CC — hero',               color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
      { type: 'full-bleed', src: '/Retro/CC-mobile.png',            alt: 'CC — mobile',             color: 'var(--bg-block-project-retro)', aspectRatio: '3318/2172' },
      { type: 'full-bleed', src: '/Retro/Domestic-hero.png',        alt: 'Domestic — hero',         color: 'var(--bg-block-project-retro)', aspectRatio: '2733/1874' },
      { type: 'full-bleed', src: '/Retro/Domestic-home.png',        alt: 'Domestic — home',         color: 'var(--bg-block-project-retro)', aspectRatio: '3168/3747' },
      { chapterLabel: 'National Library of Australia', type: 'full-bleed', src: '/Retro/Trove-hero.png',           alt: 'Trove — hero',            color: 'var(--bg-block-project-retro)', aspectRatio: '3168/2172' },
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
