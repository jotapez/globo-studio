'use client';
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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

  // Restore user's theme preference on unmount (navigating away from /work)
  useEffect(() => {
    return () => {
      try {
        const stored = localStorage.getItem('gs-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      } catch {}
    };
  }, []);

  return null;
};

ProjectBackground.displayName = 'ProjectBackground';
