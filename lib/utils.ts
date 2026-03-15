import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Matches --bg-page light-mode value. Used as the transition target background
 *  when navigating to a route without a project brand color (e.g. homepage). */
export const BG_PAGE_LIGHT = '#f8f8f7';
