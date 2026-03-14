'use client';

/**
 * useTheme — manages light/dark mode state
 *
 * Responsibilities:
 *   • Reads initial theme from localStorage / prefers-color-scheme on mount
 *   • Applies / removes `.dark` class on <html> and persists to localStorage
 *   • Exposes setTheme (accepts value OR functional updater) for fine-grained
 *     control (e.g. the sentinel observer in page.tsx)
 *   • Exposes toggleTheme which additionally resets themeBeforeAboutRef,
 *     preventing the scroll-inversion logic from restoring a stale value after
 *     a manual toggle while inside #about
 *   • Exposes themeBeforeAboutRef so page.tsx can capture the pre-#about theme
 */

import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('gs-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export interface UseThemeReturn {
  theme: 'light' | 'dark';
  /** Low-level setter — accepts a value or functional updater. */
  setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
  /** Toggles theme AND resets themeBeforeAboutRef to avoid stale restoration. */
  toggleTheme: () => void;
  /** Ref shared with page.tsx for the scroll-triggered theme inversion. */
  themeBeforeAboutRef: React.MutableRefObject<'light' | 'dark' | null>;
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const themeBeforeAboutRef = useRef<'light' | 'dark' | null>(null);

  // Read initial theme once on mount
  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  // Apply to <html> and persist on every change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('gs-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    // Discard any captured "before-about" value so the sentinel observer does
    // not restore a theme the user has already manually overridden.
    themeBeforeAboutRef.current = null;
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, setTheme, toggleTheme, themeBeforeAboutRef };
}
