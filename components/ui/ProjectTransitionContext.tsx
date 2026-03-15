'use client';

import { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectTransitionContextValue {
  startExit: (href: string) => void;
}

const ProjectTransitionContext = createContext<ProjectTransitionContextValue | null>(null);

export function ProjectTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const startExit = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <ProjectTransitionContext.Provider value={{ startExit }}>
      {children}
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectTransition() {
  const ctx = useContext(ProjectTransitionContext);
  if (!ctx) throw new Error('useProjectTransition must be used within ProjectTransitionProvider');
  return ctx;
}
