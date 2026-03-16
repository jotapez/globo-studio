'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const LIGHT_BG = '#f8f8f7';

interface ProjectTransitionContextValue {
  isExiting: boolean;
  exitTargetBg: string;
  startExit: (targetBg: string, href: string) => void;
}

const ProjectTransitionContext = createContext<ProjectTransitionContextValue | null>(null);

export function ProjectTransitionProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [exitTargetBg, setExitTargetBg] = useState(LIGHT_BG);

  const startExit = useCallback((targetBg: string, href: string) => {
    if (prefersReducedMotion) {
      router.push(href);
      return;
    }
    if (href.startsWith('/work/')) {
      // Project → project: navigate immediately. PageSlide handles the slide-up.
      router.push(href);
      return;
    }
    // Project → homepage: hide everything instantly, then navigate.
    setExitTargetBg(targetBg);
    setIsExiting(true);
    router.push(href);
  }, [prefersReducedMotion, router]);

  return (
    <ProjectTransitionContext.Provider value={{ isExiting, exitTargetBg, startExit }}>
      {children}
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectTransition() {
  const ctx = useContext(ProjectTransitionContext);
  if (!ctx) throw new Error('useProjectTransition must be used within ProjectTransitionProvider');
  return ctx;
}
