'use client';

import { useEffect, useRef } from 'react';
import { useProjectChapter } from '@/components/ui/ProjectChapterContext';

/**
 * ChapterTracker — zero-UI client component that watches [data-chapter-sentinel]
 * elements and updates the ProjectChapterContext as the user scrolls.
 *
 * A sentinel fires when its top edge crosses 35% from the top of the viewport,
 * which feels natural: the chapter content is clearly the dominant thing on screen
 * by that point.
 */
export function ChapterTracker() {
  const { setChapterLabel } = useProjectChapter();
  const currentRef = useRef<string | null>(null);

  useEffect(() => {
    const THRESHOLD = 0.35; // 35% from top of viewport

    const update = () => {
      const sentinels = Array.from(
        document.querySelectorAll<HTMLElement>('[data-chapter-sentinel]'),
      );

      let active: string | null = null;
      const cutoff = window.innerHeight * THRESHOLD;

      for (const el of sentinels) {
        if (el.getBoundingClientRect().top <= cutoff) {
          active = el.dataset.chapterSentinel || null;
        }
      }

      if (active !== currentRef.current) {
        currentRef.current = active;
        setChapterLabel(active);
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    update(); // sync on mount in case page is pre-scrolled

    return () => window.removeEventListener('scroll', update);
  }, [setChapterLabel]);

  return null;
}
