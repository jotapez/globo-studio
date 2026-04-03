'use client';

import { createContext, useContext, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectTransitionContextValue {
  startExit: (href: string) => void;
  prefetch: (href: string) => void;
  isPending: boolean;
}

const ProjectTransitionContext = createContext<ProjectTransitionContextValue | null>(null);

export function ProjectTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startPageTransition] = useTransition();

  const startExit = useCallback((href: string) => {
    startPageTransition(() => {
      router.push(href);
    });
  }, [router, startPageTransition]);

  const prefetch = useCallback((href: string) => {
    router.prefetch(href);
  }, [router]);

  return (
    <ProjectTransitionContext.Provider value={{ startExit, prefetch, isPending }}>
      {children}
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectTransition() {
  const ctx = useContext(ProjectTransitionContext);
  if (!ctx) throw new Error('useProjectTransition must be used within ProjectTransitionProvider');
  return ctx;
}
