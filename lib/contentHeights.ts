/**
 * lib/contentHeights.ts
 *
 * Hardcoded content-bottom values per project page (mobile).
 * Used by ScrollPaddingShell for accurate bottom transition.
 * Update when content changes — measure in browser console:
 *   document.querySelector('main > div')?.getBoundingClientRect().bottom + window.scrollY
 */

import { getProject } from '@/lib/projects';
import { estimateContentBottomMobile } from '@/lib/estimateContentHeight';

/** Measured content bottom (mobile, document Y). Update when content changes. */
export const CONTENT_BOTTOM_BY_SLUG: Record<string, number> = {
  officeworks: 5049,
  'open-insurance': 3785,
  'taronga-zoo': 1799,
  levo: 1799,
};

export function getContentBottom(slug: string): number {
  const project = getProject(slug);
  return (
    CONTENT_BOTTOM_BY_SLUG[slug] ??
    (project ? estimateContentBottomMobile(project.contentBlocks) : 0)
  );
}
