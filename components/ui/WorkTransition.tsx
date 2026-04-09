'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProjectTransition } from '@/components/ui/ProjectTransitionContext';
import { ProjectNav } from '@/components/ui/ProjectNav';
import { ProjectBackground } from '@/components/ui/ProjectBackground';
import { ProjectChapterContext } from '@/components/ui/ProjectChapterContext';
import { getNavProject, getNavProjects } from '@/lib/navProjects';
import { BG_PAGE_LIGHT } from '@/lib/utils';

export function WorkTransition({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { isPending, prefetch } = useProjectTransition();

  const project = getNavProject(slug);
  const navProjects = getNavProjects();

  const [chapterLabel, setChapterLabel] = useState<string | null>(null);

  // Reset chapter label when navigating to a different project
  useEffect(() => { setChapterLabel(null); }, [slug]);

  // Prefetch the next project page so it loads instantly on click
  useEffect(() => {
    if (project?.nextSlug) prefetch(`/work/${project.nextSlug}`);
  }, [project?.nextSlug, prefetch]);

  return (
    <ProjectChapterContext.Provider value={{ chapterLabel, setChapterLabel }}>
      <ProjectBackground bgColor={project?.bgColor ?? BG_PAGE_LIGHT} />
      {project && (
        <ProjectNav
          clientName={project.clientName}
          chapterLabel={chapterLabel}
          activeSlug={project.slug}
          nextHref={`/work/${project.nextSlug}`}
          allProjects={navProjects}
          isPending={isPending}
        />
      )}
      <div style={{ backgroundColor: project?.bgColor ?? BG_PAGE_LIGHT }}>
        {children}
      </div>
    </ProjectChapterContext.Provider>
  );
}
