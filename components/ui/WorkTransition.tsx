'use client';
import { usePathname, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion, usePresence } from 'framer-motion';
import { ProjectTransitionProvider, useProjectTransition } from '@/components/ui/ProjectTransitionContext';
import { ProjectNav } from '@/components/ui/ProjectNav';
import { ProjectBackground } from '@/components/ui/ProjectBackground';
import { getProject, getNavProjects } from '@/lib/projects';

export function WorkTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';

  const project = getProject(slug);
  const navProjects = getNavProjects();
  const nextBgColor =
    navProjects.find((p) => p.slug === project?.nextSlug)?.bgColor ?? '#f8f8f7';

  // Nav slides down on layout mount (first visit from homepage or direct URL).
  // Between projects the layout stays mounted, so the nav never re-animates.

  return (
    <ProjectTransitionProvider>
      <ProjectBackground bgColor={project?.bgColor ?? '#f8f8f7'} />
      {project && (
        <ProjectNav
          clientName={project.clientName}
          activeSlug={project.slug}
          nextHref={`/work/${project.nextSlug}`}
          nextBgColor={nextBgColor}
          allProjects={navProjects}
        />
      )}
      <AnimatePresence mode="sync">
        <PageSlide key={pathname}>{children}</PageSlide>
      </AnimatePresence>
    </ProjectTransitionProvider>
  );
}

function PageSlide({ children }: { children: React.ReactNode }) {
  const [isPresent, safeToRemove] = usePresence();
  const [settled, setSettled] = useState(false);
  const { isExiting } = useProjectTransition();

  useEffect(() => {
    if (!isPresent) {
      const t = setTimeout(safeToRemove!, 650);
      return () => clearTimeout(t);
    }
  }, [isPresent, safeToRemove]);

  if (isExiting) return null;

  return (
    <motion.div
      style={{
        position: settled ? 'relative' : 'fixed',
        inset: settled ? undefined : 0,
        zIndex: isPresent ? 10 : 0,
        overflowY: settled ? undefined : 'auto',
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => { if (isPresent) setSettled(true); }}
    >
      {children}
    </motion.div>
  );
}
