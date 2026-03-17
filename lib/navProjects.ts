/**
 * lib/navProjects.ts
 *
 * Nav-only project data — no JSX, safe to import from Client Components.
 * Full project data (including mixed-typeface headings) lives in lib/projects.tsx.
 */

export interface NavProject {
  slug: string;
  clientName: string;
  bgColor: string;
  nextSlug: string;
}

const NAV_PROJECTS: NavProject[] = [
  { slug: 'officeworks',    clientName: 'Officeworks',    bgColor: '#001db0', nextSlug: 'open-insurance' },
  { slug: 'open-insurance', clientName: 'Open Insurance', bgColor: '#3638DE', nextSlug: 'taronga-zoo'   },
  { slug: 'taronga-zoo',    clientName: 'kicbox',         bgColor: '#1a3d2b', nextSlug: 'levo'           },
  { slug: 'levo',           clientName: 'Multiple projects', bgColor: '#2d1a00', nextSlug: 'officeworks' },
];

/** Returns all projects — used to build the desktop nav item list. */
export function getNavProjects(): NavProject[] {
  return NAV_PROJECTS;
}

/** Returns the nav-safe project record for a slug, or undefined if not found. */
export function getNavProject(slug: string): NavProject | undefined {
  return NAV_PROJECTS.find((p) => p.slug === slug);
}
