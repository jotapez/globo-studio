'use client';

/**
 * Homepage — Globo Studio
 *
 * Figma: 1016:1761 (home-page section, node 994:44022 desktop)
 * Spec:  docs/screens/homepage-spec.md
 *
 * Sections (scroll order):
 *   #hero     → <Hero>           full-viewport shader + Studio wordmark
 *   #intro    → <IntroSection>   large heading + client carousel
 *   #work     → inline JSX       2×2 main cards + interlude + 2 personal cards
 *   #about    → <AboutSection>   designer portrait + bio
 *   #contact  → <ContactFooter>  contact links + 4 clocks + footer
 *
 * Interactivity wired here:
 *   • Nav active pill      — useActiveSection (IntersectionObserver)
 *   • Dark mode toggle     — click on Hero area → manual toggle
 *   • Dark mode on scroll  — #about entering viewport inverts theme; restores on scroll-back
 *   • Theme persistence    — useTheme (localStorage 'gs-theme'; fallback: prefers-color-scheme)
 *
 * Layout notes from Figma (node 994:44022 desktop, 1728×7479):
 *   Main cards grid:   2-col desktop (~812px cards, 40px gap)  / 1-col mobile (48px gap)
 *   Row A → Row B gap: 40px on desktop (--card-gap); mobile: 48px vertical (--card-gap-mobile)
 *   Interlude spacing: 200px before + after on desktop / 100px mobile
 *   Interlude width:   1271px centred (≈ --content-width-heading: 1266px)
 */

import { useCallback, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { Nav } from '@/components/ui/Nav';
import { Hero } from '@/components/ui/Hero';
import { IntroSection } from '@/components/ui/IntroSection';
import { AboutSection } from '@/components/ui/AboutSection';
import { ContactFooterV3 } from '@/components/ui/ContactFooterV3';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useActiveSection } from '@/hooks/useActiveSection';

// ─── project data ──────────────────────────────────────────────────────────────

/**
 * Rows A + B — main case studies. Navigate to /work/[slug] in the same tab.
 * Add hero images to /public/images/ to replace the placeholder src values.
 */
const MAIN_PROJECTS = [
  {
    title: 'Officeworks',
    description:
      "Officeworks B2B customers were managing their accounts over the phone. I redesigned that into a self-service platform (custom catalogues, team and permissions management, address controls) and built the design system from 0 to 1. Support calls dropped 40%.",
    href: '/work/officeworks',
    imageSrc: '/Homepage/OW-project-card-first-desktop.svg',
    hoverImageSrc: '/Homepage/OW-project-card-second-desktop.png',
    showDescriptionOnHover: true,
    cursorLabel: 'See work',
    targetBg: '#001db0',
  },
  {
    title: 'Open',
    description:
      'Open builds white-label insurance for brands like Bupa, Polestar, and Slingshot. I redesigned the quote flows that cut drop-offs by 70% and lifted sales 20%, then built the multi-brand design system that let us deliver Bupa\'s full platform in 10 weeks, half the time a launch like that usually takes.',
    href: '/work/open-insurance',
    imageSrc: '/Homepage/OI-project-card-first-desktop.svg',
    hoverImageSrc: '/Homepage/OI-project-card-second-desktop.png',
    showDescriptionOnHover: true,
    cursorLabel: 'See work',
    targetBg: '#3638DE',
  },
  {
    title: 'kicbox',
    description:
      'Young people in out-of-home care often age out of the system without basic documents, sometimes without ever having seen their own birth certificate. kicbox gives them a safe place to keep what matters. I led design end-to-end, from co-design workshops with young people through to the app, identity, and promotional materials.',
    href: '/work/kicbox',
    imageSrc: '/Homepage/kicbox-project-card-first-desktop.svg',
    hoverImageSrc: '/Homepage/kicbox-project-card-second-desktop.png',
    hoverMobileSrc: '/Homepage/kicbox-project-card-first-mobile.png',
    showDescriptionOnHover: true,
    cursorLabel: 'See work',
    targetBg: '#D42929',
  },
  {
    title: 'Retro',
    description:
      'From Taronga Zoo to Coca-Cola Amatil to the NSW Electoral Commission, Retro is a decade of client work across sectors that demand very different things from design. Different stakes, different users, the same craft.',
    href: '/work/retro',
    imageSrc: '/Homepage/Retro-project-card-first-desktop.svg',
    hoverImageSrc: '/Homepage/Retro-project-card-second-desktop.png',
    showDescriptionOnHover: true,
    cursorLabel: 'See work',
    targetBg: '#F8F8F7',
  },
] as const;

/**
 * Row C — personal / side projects.
 * `external: true` opens in a new tab with an external-link icon.
 */
const PERSONAL_PROJECTS = [
  {
    title: 'Compaire',
    description:
      "Chile's 2025 presidential campaigns were polarised, jargon-heavy, and almost deliberately opaque for ordinary voters. I designed and built Compaire: an AI platform that let anyone query the official presidential programs in plain language, on any topic they cared about. 2,000+ users, 3,000+ questions answered, and a clearer picture of what Chilean voters actually wanted to know.",
    href: 'https://www.compaire.cl',
    imageSrc: '/Homepage/Compaire-project-card-second-desktop.png',
    staticImage: true,
    showDescriptionOnHover: true,
    cursorLabel: 'Check it out',
    cursorIcon: true,
    external: true,
  },
  {
    title: 'OnlyMe',
    description: "Every social platform has a stake in your data, your attention, or your behaviour. OnlyMe doesn't. I designed and built it as a private space to share images, thoughts, and links with friends and family: no algorithms, no metrics, no ads, no pressure to perform. No followers. No feed. Just yours.",
    href: 'https://onlyme.life/juanpablo',
    imageSrc: '/Homepage/OnlyMe-project-card-second-desktop.png',
    staticImage: true,
    showDescriptionOnHover: true,
    cursorLabel: 'Check it out',
    cursorIcon: true,
    external: true,
  },
] as const;

// ─── CardMotion ───────────────────────────────────────────────────────────────
// Must be module-level — defining this inside HomePage would create a new
// component type on every render, causing React to unmount/remount the card
// and replay the fade-in animation whenever activeSection changes.

function CardMotion({
  inView,
  reduceMotion,
  children,
}: {
  inView: boolean;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { theme, setTheme, toggleTheme, themeBeforeAboutRef, themeBeforeIntroRef } = useTheme();
  const { activeSection, scrollToSection } = useActiveSection();
  const shouldReduceMotion = useReducedMotion();

  // ── Project card grids — shared inView per grid so cards animate simultaneously ───
  const mainGridRef = useRef<HTMLDivElement>(null);
  const mainGridInView = useInView(mainGridRef, { once: false, amount: 0.1 });
  const personalGridRef = useRef<HTMLDivElement>(null);
  const personalGridInView = useInView(personalGridRef, { once: false, amount: 0.1 });

  // ── Interlude text animation ──────────────────────────────────────────────
  const interludeRef = useRef<HTMLDivElement>(null);
  const interludeInView = useInView(interludeRef, { once: true, amount: 0.2 });

  const interludeContainerVariants: Variants = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
      };

  const interludeWordVariants: Variants = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 10, filter: 'blur(10px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1.0] },
        },
      };

  // ── Scroll-triggered dark mode — #intro entering viewport ────────────────
  // Mirrors the #about pattern: inverts once on entry; restores when user
  // scrolls fully back above #intro (sentinel exits below viewport, top > 0).
  useEffect(() => {
    const intro = document.getElementById('intro-sentinel');
    if (!intro) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (themeBeforeIntroRef.current === null) {
          setTheme((current) => {
            themeBeforeIntroRef.current = current;
            return current === 'light' ? 'dark' : 'light';
          });
        }
      } else if (entry.boundingClientRect.top > 0) {
        // Sentinel below viewport — user scrolled back above #intro — restore
        if (themeBeforeIntroRef.current !== null) {
          setTheme(themeBeforeIntroRef.current);
          themeBeforeIntroRef.current = null;
        }
      }
      // top < 0 → sentinel above viewport (scrolled down past intro) → do nothing
    });

    obs.observe(intro);
    return () => obs.disconnect();
  }, [setTheme, themeBeforeIntroRef]);

  // ── Scroll-triggered dark mode — sentinel at top of #about ───────────────
  // Spec §5: inverts current theme once on entry; restores only when user scrolls
  // fully back above #about (sentinel exits below viewport, top > 0).
  // rootMargin shrinks the root by 50% from the bottom so the theme switches
  // in sync with the nav pill (both fire when #about is ~50% revealed).
  useEffect(() => {
    const sentinel = document.getElementById('about-sentinel');
    if (!sentinel) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Top of #about crossed viewport midpoint — only invert once per downward pass
        if (themeBeforeAboutRef.current === null) {
          setTheme((current) => {
            themeBeforeAboutRef.current = current;
            return current === 'light' ? 'dark' : 'light';
          });
        }
      } else if (entry.boundingClientRect.top > 0) {
        // Sentinel below viewport — user scrolled fully back above #about — restore
        if (themeBeforeAboutRef.current !== null) {
          setTheme(themeBeforeAboutRef.current);
          themeBeforeAboutRef.current = null;
        }
      }
      // top < 0 → sentinel above viewport (user scrolled down into about) → do nothing
    }, { rootMargin: '0px 0px -50% 0px' });

    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [setTheme, themeBeforeAboutRef]);


  // ── Hero click → manual dark mode toggle ─────────────────────────────────
  // `toggleTheme` resets themeBeforeAboutRef so the sentinel doesn't restore
  // a stale value if the user manually toggles while inside #about.
  const handleHeroClick = useCallback(() => {
    const currentTheme = theme;               // capture before toggle
    toggleTheme();                            // resets themeBeforeIntroRef → null
    themeBeforeIntroRef.current = currentTheme; // pre-seed so sentinel skips on scroll-in
    document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
  }, [toggleTheme, theme, themeBeforeIntroRef]);

  return (
    <>
      <style>{`:root:not(.dark) { --bg-page: var(--bg-page-home); }`}</style>
      {/* Fixed navigation — always on top */}
      <Nav
        activeSection={activeSection === 'intro' ? 'hero' : activeSection}
        onItemClick={scrollToSection}
        entranceDelay={0.4}
        cursorActive
        clickFeedback
      />

      <main id="main-content">

        {/* ── §1 Hero ──────────────────────────────────────────────────────── */}
        <Hero onToggle={handleHeroClick} onPortfolioClick={() => scrollToSection('intro')} />

        {/* ── §2 Intro ─────────────────────────────────────────────────────── */}
        <IntroSection theme={theme} carouselVariant="v2" />

        {/* ── §3 Work ──────────────────────────────────────────────────────── */}
        {/*
         * Internal layout (Figma desktop, node 994:44157 + 994:44165):
         *   Cards same row:  40px gap (--card-gap)
         *   Mobile card gap: 48px   (--card-gap-mobile)
         *   Row A → Row B:   40px   (--card-gap, same as column gap)
         *   Interlude:       200px before + after desktop / 100px mobile
         *   Row C:           same card gap as rows A + B
         *
         * On mobile all 4 main cards render as a single column (no row split).
         * The grid handles this automatically via grid-cols-1 / md:grid-cols-2.
         */}
        <section
          id="work"
          aria-label="Work"
          className="bg-[var(--bg-page)] text-[var(--text-primary)] px-8 lg:px-16 pt-[var(--section-padding-top-mobile)] md:pt-[var(--section-padding-top-desktop)]"
          style={{
            '--card-top-offset': 'var(--section-padding-top-desktop)',
            '--card-top-offset-mobile': 'var(--section-padding-top-mobile)',
            '--card-bottom-offset': 'var(--section-padding-bottom-desktop)',
          } as React.CSSProperties}
        >
          <div className="w-full">

            {/* ── Rows A + B — all 4 main case studies ───────────────────── */}
            {/*
             * grid-cols-2 creates the 2×2 layout on desktop.
             * On mobile: single column, 48px gap between every card.
             * Desktop: row and column gaps both use --card-gap (40px).
             */}
            <div id="work-trigger" />
            <div ref={mainGridRef} className="grid grid-cols-1 md:grid-cols-2 items-start gap-y-[var(--card-gap-mobile)] md:gap-y-[var(--card-gap)] md:gap-x-[var(--card-gap)]">
              {MAIN_PROJECTS.map((project, i) => (
                <CardMotion key={project.title} inView={mainGridInView} reduceMotion={!!shouldReduceMotion}>
                  <ProjectCard {...project} priority={i < 2} />
                </CardMotion>
              ))}
            </div>

            {/* ── Interlude text ──────────────────────────────────────────── */}
            {/*
             * Figma: x=196.5, width=1271 → centred ((1664-1271)/2 = 196.5).
             * Uses --content-width-heading (1266px ≈ 1271px) with mx-auto.
             * Mixed typeface: same sans/serif alternation as IntroSection heading.
             * Spec: "Large display", same font scale as #intro heading.
             */}
            <div ref={interludeRef} className="py-[var(--about-padding-y-mobile)] md:py-[var(--about-padding-y-desktop)]">
              <motion.div
                variants={interludeContainerVariants}
                initial="hidden"
                animate={interludeInView ? 'visible' : 'hidden'}
                className="flex flex-col gap-0 md:gap-[8px] items-start md:items-center"
              >

                <h2
                  className={cn(
                    'font-normal not-italic text-left md:text-center',
                    'max-w-[var(--content-width-heading)] mx-auto',
                    '[font-size:var(--text-h1-mobile-size)] [line-height:var(--text-h1-mobile-leading)]',
                    'md:[font-size:var(--text-h1-size)] md:[line-height:var(--text-h1-leading)]',
                    '[letter-spacing:var(--text-h1-tracking)]',
                  )}
                >
                  <motion.span variants={interludeWordVariants} className="font-sans">Designed</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif"> and </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">built</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif"> with the help of the </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">Globo</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif"> crew - Claude Code, </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">Cursor,{' '}</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif">Figma, </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">Paper</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif"> and others.</motion.span>
                </h2>
              </motion.div>
            </div>

            {/* ── Row C — personal / side projects ────────────────────────── */}
            {/*
             * Same grid structure as Rows A + B.
             * `external: true` on each project opens in a new tab.
             */}
            <div ref={personalGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-y-[var(--card-gap-mobile)] md:gap-y-[var(--card-gap)] md:gap-x-[var(--card-gap)]">
              {PERSONAL_PROJECTS.map((project) => (
                <CardMotion key={project.title} inView={personalGridInView} reduceMotion={!!shouldReduceMotion}>
                  <ProjectCard {...project} />
                </CardMotion>
              ))}
            </div>

          </div>
        </section>

        {/* ── §4 About ─────────────────────────────────────────────────────── */}
        <AboutSection />

        {/* ── §5 Contact + Footer ──────────────────────────────────────────── */}
        <ContactFooterV3 theme={theme} onLogoClick={() => scrollToSection('hero')} />

      </main>
    </>
  );
}
