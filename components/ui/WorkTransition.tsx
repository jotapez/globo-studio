'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProjectTransition } from '@/components/ui/ProjectTransitionContext';
import { ProjectNav } from '@/components/ui/ProjectNav';
import { ProjectBackground } from '@/components/ui/ProjectBackground';
import { getNavProject, getNavProjects } from '@/lib/navProjects';
import { BG_PAGE_LIGHT } from '@/lib/utils';

export function WorkTransition({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { isPending, prefetch } = useProjectTransition();

  const project = getNavProject(slug);
  const navProjects = getNavProjects();

  // Prefetch the next project page so it loads instantly on click
  useEffect(() => {
    if (project?.nextSlug) prefetch(`/work/${project.nextSlug}`);
  }, [project?.nextSlug, prefetch]);

  return (
    <>
      <ProjectBackground bgColor={project?.bgColor ?? BG_PAGE_LIGHT} />
      {project && (
        <ProjectNav
          clientName={project.clientName}
          activeSlug={project.slug}
          nextHref={`/work/${project.nextSlug}`}
          allProjects={navProjects}
          isPending={isPending}
        />
      )}
      <div style={{ backgroundColor: project?.bgColor ?? BG_PAGE_LIGHT }}>
        {children}
      </div>
    </>
  );
}
