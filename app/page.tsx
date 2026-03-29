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
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Nav } from '@/components/ui/Nav';
import { Hero } from '@/components/ui/Hero';
import { IntroSection } from '@/components/ui/IntroSection';
import { AboutSection } from '@/components/ui/AboutSection';
import { ContactFooter } from '@/components/ui/ContactFooter';
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
    title: 'Officeworks B2B',
    description:
      'Product design for car and home insurance products from strategy to delivery, while building and governing the design system at Open Insurance.',
    href: '/work/officeworks',
    imageSrc: '/Homepage/OW-project-card-first-desktop.svg',
    hoverImageSrc: '/Homepage/OW-project-card-second-desktop.png',
    hoverMobileSrc: '/Homepage/OW-project-card-second-mobile.png',
    showDescriptionOnHover: true,
    cursorLabel: 'See work',
    targetBg: '#001db0',
  },
  {
    title: 'Open Insurance',
    description:
      'Product design for car and home insurance products from strategy to delivery, while building and governing the design system at Open Insurance.',
    href: '/work/open-insurance',
    imageSrc: '/Homepage/OI-project-card-first-desktop.svg',
    hoverImageSrc: '/Homepage/OI-project-card-second-desktop.png',
    hoverMobileSrc: '/Homepage/OI-project-card-second-mobile.png',
    showDescriptionOnHover: true,
    cursorLabel: 'See work',
    targetBg: '#3638DE',
  },
  {
    title: 'kicbox',
    description:
      'Product design for car and home insurance products from strategy to delivery, while building and governing the design system at Open Insurance.',
    href: '/work/kicbox',
    imageSrc: '/Homepage/kicbox-project-card-first-desktop.svg',
    hoverImageSrc: '/Homepage/kicbox-project-card-second-desktop.png',
    hoverMobileSrc: '/Homepage/kicbox-project-card-second-mobile.png',
    showDescriptionOnHover: true,
    cursorLabel: 'See work',
    targetBg: '#D42929',
  },
  {
    title: 'Retro',
    description:
      'Product design for car and home insurance products from strategy to delivery, while building and governing the design system at Open Insurance.',
    href: '/work/retro',
    imageSrc: '/Homepage/Retro-project-card-first-desktop.svg',
    hoverImageSrc: '/Homepage/Retro-project-card-second-desktop.png',
    hoverMobileSrc: '/Homepage/Retro-project-card-second-mobile.png',
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
      'A personal exploration in design and creativity.',
    href: 'https://www.compaire.cl',
    imageSrc: '/Homepage/Compaire-project-card-second-desktop.png',
    staticImage: true,
    showDescriptionOnHover: true,
    cursorLabel: 'Check it out',
    cursorIcon: true,
    external: true,
  },
  {
    title: 'Only Me',
    description: 'A personal exploration in design and creativity.',
    href: 'https://onlyme.life/',
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
  index,
  reduceMotion,
  children,
}: {
  index: number;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const delay = (index % 2) * 0.15;
  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
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

  // ── Interlude text animation ──────────────────────────────────────────────
  const interludeRef = useRef<HTMLDivElement>(null);
  const interludeInView = useInView(interludeRef, { once: false, amount: 0.2 });

  const interludeContainerVariants = shouldReduceMotion
    ? {}
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0 } },
      };

  const interludeWordVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
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
  useEffect(() => {
    const sentinel = document.getElementById('about-sentinel');
    if (!sentinel) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Top of #about entered viewport — only invert once per downward pass
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
    });

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
      {/* Fixed navigation — always on top */}
      <Nav
        activeSection={activeSection === 'intro' ? 'hero' : activeSection}
        onItemClick={scrollToSection}
        entranceDelay={0.4}
        cursorActive
        clickFeedback
      />

      <main>

        {/* ── §1 Hero ──────────────────────────────────────────────────────── */}
        <Hero onToggle={handleHeroClick} onPortfolioClick={() => scrollToSection('intro')} />

        {/* ── §2 Intro ─────────────────────────────────────────────────────── */}
        <IntroSection theme={theme} />

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
          className="bg-[var(--bg-page)] text-[var(--text-primary)] px-[var(--page-padding-mobile)] md:px-[var(--page-padding-desktop)] pt-[var(--section-padding-top-mobile)] md:pt-[var(--section-padding-top-desktop)]"
          style={{
            '--card-top-offset': 'var(--section-padding-top-desktop)',
            '--card-top-offset-mobile': 'var(--section-padding-top-mobile)',
            '--card-bottom-offset': 'var(--section-padding-bottom-desktop)',
          } as React.CSSProperties}
        >
          <h2 className="sr-only">Work</h2>
          <div className="w-full">

            {/* ── Rows A + B — all 4 main case studies ───────────────────── */}
            {/*
             * grid-cols-2 creates the 2×2 layout on desktop.
             * On mobile: single column, 48px gap between every card.
             * Desktop: row and column gaps both use --card-gap (40px).
             */}
            <div id="work-trigger" />
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-y-[var(--card-gap-mobile)] md:gap-y-[var(--card-gap)] md:gap-x-[var(--card-gap)]">
              {MAIN_PROJECTS.map((project, i) => (
                <CardMotion key={project.title} index={i} reduceMotion={!!shouldReduceMotion}>
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
              >
                <p
                  className={cn(
                    'font-normal not-italic text-center',
                    'max-w-[var(--content-width-heading)] mx-auto',
                    '[font-size:var(--text-h1-mobile-size)] [line-height:var(--text-h1-mobile-leading)]',
                    'md:[font-size:var(--text-h1-size)] md:[line-height:var(--text-h1-leading)]',
                  )}
                >
                  <motion.span variants={interludeWordVariants} className="font-sans">Designed</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif"> and </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">built</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif"> with the help of the </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">globo</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif"> crew – </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">Claude code, </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">Cursor, </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">Figma Make, </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">Lovable</motion.span>
                  <motion.span variants={interludeWordVariants} className="font-serif"> and </motion.span>
                  <motion.span variants={interludeWordVariants} className="font-sans">Paper</motion.span>
                </p>
              </motion.div>
            </div>

            {/* ── Row C — personal / side projects ────────────────────────── */}
            {/*
             * Same grid structure as Rows A + B.
             * `external: true` on each project opens in a new tab.
             */}
            <div className="grid grid-cols-1 md:grid-cols-2 pb-[var(--about-padding-y-mobile)] md:pb-[var(--about-padding-y-desktop)] gap-y-[var(--card-gap-mobile)] md:gap-y-[var(--card-gap)] md:gap-x-[var(--card-gap)]">
              {PERSONAL_PROJECTS.map((project, i) => (
                <CardMotion key={project.title} index={i} reduceMotion={!!shouldReduceMotion}>
                  <ProjectCard {...project} />
                </CardMotion>
              ))}
            </div>

          </div>
        </section>

        {/* ── §4 About ─────────────────────────────────────────────────────── */}
        <AboutSection />

        {/* ── §5 Contact + Footer ──────────────────────────────────────────── */}
        <ContactFooter theme={theme} />

      </main>
    </>
  );
}
