'use client';
import { useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = useLayoutEffect;

interface ProjectBackgroundProps {
  bgColor: string;
}

export const ProjectBackground = function ProjectBackground({ bgColor: _ }: ProjectBackgroundProps) {
  // Force light mode and apply pre-seeded background before paint —
  // prevents dark-mode flash and wrong-colour flash on nav.
  useIsomorphicLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.add('no-theme-transition');
    html.classList.remove('dark');

    // Apply the background colour that ProjectCard seeded into sessionStorage
    // on click, so there's no flash of the default background before hydration.
    try {
      const seededBg = sessionStorage.getItem('entry-bg');
      if (seededBg) {
        html.style.backgroundColor = seededBg;
        sessionStorage.removeItem('entry-bg');
      }
    } catch {}

    requestAnimationFrame(() => html.classList.remove('no-theme-transition'));
  }, []);

  // Restore user's theme before paint when leaving /work pages.
  // useIsomorphicLayoutEffect cleanup runs synchronously before the browser paints
  // the new page, preventing the white flash that useEffect (post-paint) would cause.
  useIsomorphicLayoutEffect(() => {
    return () => {
      try {
        document.documentElement.style.backgroundColor = '';
        const stored = localStorage.getItem('gs-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
          const html = document.documentElement;
          html.classList.add('no-theme-transition');
          html.classList.add('dark');
          requestAnimationFrame(() => html.classList.remove('no-theme-transition'));
        }
      } catch {}
    };
  }, []);

  return null;
};

ProjectBackground.displayName = 'ProjectBackground';
