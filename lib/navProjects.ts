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
  { slug: 'officeworks',    clientName: 'Officeworks',    bgColor: 'var(--bg-page-project-ow)',     nextSlug: 'open-insurance' },
  { slug: 'open-insurance',   clientName: 'Open Insurance',   bgColor: 'var(--bg-page-project-oi)',     nextSlug: 'kicbox'          },
  { slug: 'kicbox',           clientName: 'kicbox',           bgColor: 'var(--bg-page-project-kicbox)', nextSlug: 'multipleprojects' },
  { slug: 'multipleprojects', clientName: 'Multiple projects', bgColor: 'var(--bg-page-project-levo)', nextSlug: 'officeworks'     },
];

/** Returns all projects — used to build the desktop nav item list. */
export function getNavProjects(): NavProject[] {
  return NAV_PROJECTS;
}

/** Returns the nav-safe project record for a slug, or undefined if not found. */
export function getNavProject(slug: string): NavProject | undefined {
  return NAV_PROJECTS.find((p) => p.slug === slug);
}
