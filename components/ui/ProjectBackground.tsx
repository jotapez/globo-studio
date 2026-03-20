'use client';
import { useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = useLayoutEffect;

interface ProjectBackgroundProps {
  bgColor: string;
}

export const ProjectBackground = function ProjectBackground({ bgColor: _ }: ProjectBackgroundProps) {
  // Force light mode before paint — prevents dark-mode flash on nav
  useIsomorphicLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.add('no-theme-transition');
    html.classList.remove('dark');
    requestAnimationFrame(() => html.classList.remove('no-theme-transition'));
  }, []);

  // Restore user's theme before paint when leaving /work pages.
  // useIsomorphicLayoutEffect cleanup runs synchronously before the browser paints
  // the new page, preventing the white flash that useEffect (post-paint) would cause.
  useIsomorphicLayoutEffect(() => {
    return () => {
      try {
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
