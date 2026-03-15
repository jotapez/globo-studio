'use client';
import { usePathname, useParams } from 'next/navigation';
import { ProjectTransitionProvider } from '@/components/ui/ProjectTransitionContext';
import { ProjectNav } from '@/components/ui/ProjectNav';
import { ProjectBackground } from '@/components/ui/ProjectBackground';
import { getProject, getNavProjects } from '@/lib/projects';
import { BG_PAGE_LIGHT } from '@/lib/utils';

export function WorkTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';

  const project = getProject(slug);
  const navProjects = getNavProjects();
  const nextBgColor =
    navProjects.find((p) => p.slug === project?.nextSlug)?.bgColor ?? BG_PAGE_LIGHT;

  return (
    <ProjectTransitionProvider>
      <ProjectBackground bgColor={project?.bgColor ?? BG_PAGE_LIGHT} />
      {project && (
        <ProjectNav
          clientName={project.clientName}
          activeSlug={project.slug}
          nextHref={`/work/${project.nextSlug}`}
          nextBgColor={nextBgColor}
          allProjects={navProjects}
        />
      )}
      <div style={{ backgroundColor: project?.bgColor ?? BG_PAGE_LIGHT }}>
        {children}
      </div>
    </ProjectTransitionProvider>
  );
}
