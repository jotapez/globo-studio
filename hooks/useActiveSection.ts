'use client';

/**
 * useActiveSection — tracks the visible section and handles smooth-scroll nav
 *
 * Responsibilities:
 *   • IntersectionObserver over all SECTION_ORDER ids → drives the nav pill
 *   • Suppresses observer updates while a programmatic scroll is in flight
 *     (scrollingToRef lock, cleared 150 ms after the last scroll event)
 *   • Cleans up both the timer and any dangling scroll listener on unmount
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { NavSection } from '@/components/ui/Nav';

export const SECTION_ORDER: NavSection[] = ['hero', 'intro', 'work', 'about', 'contact'];

export interface UseActiveSectionReturn {
  activeSection: NavSection;
  setActiveSection: (id: NavSection) => void;
  scrollToSection: (id: string) => void;
}

export function useActiveSection(): UseActiveSectionReturn {
  const [activeSection, setActiveSection] = useState<NavSection>('hero');
  const scrollingToRef   = useRef<NavSection | null>(null);
  const scrollEndTimer   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrollListenerRef = useRef<(() => void) | null>(null);

  // ── Section visibility observer ───────────────────────────────────────────
  useEffect(() => {
    const intersecting = new Set<string>();

    const updateActive = () => {
      if (scrollingToRef.current) return;
      const visible = SECTION_ORDER.filter((id) => intersecting.has(id));
      setActiveSection(visible[visible.length - 1] ?? 'hero');
    };

    // All sections except 'work' and 'about' — threshold 0 (any pixel visible)
    const mainObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) intersecting.add(target.id);
          else intersecting.delete(target.id);
        });
        updateActive();
      },
      { threshold: 0 },
    );

    SECTION_ORDER.filter((id) => id !== 'work' && id !== 'about' && id !== 'contact').forEach((id) => {
      const el = document.getElementById(id);
      if (el) mainObs.observe(el);
    });

    // Shared sticky sentinel logic — keeps a section active once its sentinel
    // has scrolled above the viewport (we're past the trigger point).
    const makeSentinelObs = (sectionId: string, options: IntersectionObserverInit) =>
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            intersecting.add(sectionId);
          } else {
            intersecting.delete(sectionId);
          }
          updateActive();
        },
        options,
      );

    // 'work' — activates when the first card row crosses the viewport midpoint
    const workObs = makeSentinelObs('work', { threshold: 0, rootMargin: '0px 0px -50% 0px' });
    const workTrigger = document.getElementById('work-trigger');
    if (workTrigger) workObs.observe(workTrigger);

    // 'about' — activates in sync with the theme switch (about-sentinel enters viewport)
    const aboutObs = makeSentinelObs('about', { threshold: 0 });
    const aboutSentinel = document.getElementById('about-sentinel');
    if (aboutSentinel) aboutObs.observe(aboutSentinel);

    // 'contact' — activates when 20% of the section is revealed
    const contactObs = makeSentinelObs('contact', { threshold: 0.2 });
    const contactEl = document.getElementById('contact');
    if (contactEl) contactObs.observe(contactEl);

    return () => {
      mainObs.disconnect();
      workObs.disconnect();
      aboutObs.disconnect();
      contactObs.disconnect();
    };
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(scrollEndTimer.current);
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
      }
    };
  }, []);

  // ── Programmatic scroll ───────────────────────────────────────────────────
  const scrollToSection = useCallback((id: string) => {
    // Remove any previous dangling scroll listener before adding a new one
    if (scrollListenerRef.current) {
      window.removeEventListener('scroll', scrollListenerRef.current);
    }

    scrollingToRef.current = id as NavSection;
    clearTimeout(scrollEndTimer.current);
    setActiveSection(id as NavSection);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    const onScroll = () => {
      clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = setTimeout(() => {
        scrollingToRef.current = null;
        window.removeEventListener('scroll', onScroll);
        scrollListenerRef.current = null;
      }, 150);
    };

    scrollListenerRef.current = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
  }, []);

  return { activeSection, setActiveSection, scrollToSection };
}
