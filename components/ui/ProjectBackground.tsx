'use client';

import { useEffect, useLayoutEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useProjectTransition } from '@/components/ui/ProjectTransitionContext';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface ProjectBackgroundProps {
  bgColor: string;
}

export const ProjectBackground = function ProjectBackground({ bgColor }: ProjectBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isExiting, exitTargetBg } = useProjectTransition();

  // Force light mode before paint — prevents dark-mode flash on nav
  useIsomorphicLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.add('no-theme-transition');
    html.classList.remove('dark');
    requestAnimationFrame(() => {
      html.classList.remove('no-theme-transition');
    });
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

  // Remove the background immediately on exit — the nav slide-up covers this,
  // and a position:fixed z-index:0 element paints above normal-flow homepage
  // content, so we can't safely rely on an opacity fade after navigation starts.
  if (isExiting) return null;

  return (
    <motion.div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}
      initial={false}
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: prefersReducedMotion ? 0 : 1, ease: 'easeOut' }}
    />
  );
};

ProjectBackground.displayName = 'ProjectBackground';
