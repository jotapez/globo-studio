'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ScrollPaddingShellProps {
  bgColor: string;
  children: React.ReactNode;
  className?: string;
  /** Pre-computed content bottom (mobile). When set, bottom transition uses scroll-only math — same as top. */
  estimatedContentBottom?: number;
}

export function ScrollPaddingShell({
  bgColor,
  children,
  className,
}: ScrollPaddingShellProps) {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Pure math — no DOM reads in the scroll hot path
  const paddingMotionValue = useTransform(scrollY, (y) => {
    // Top: 0–120px of scroll → 20px down to 0px
    const topFade = Math.max(0, Math.min(20, 20 - (y / 120) * 20));
    return topFade;
  });

  // isMobile defaults false (= no animated style during SSR/hydration)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const applyMotion = isMobile && !prefersReducedMotion;

  return (
    <motion.div
      style={{
        backgroundColor: bgColor,
        paddingLeft:  applyMotion ? paddingMotionValue : undefined,
        paddingRight: applyMotion ? paddingMotionValue : undefined,
      }}
      className={cn(
        // CSS fallback — always present (covers SSR / reduced-motion / desktop)
        'px-[var(--page-padding-mobile)] md:px-[var(--page-padding-desktop)]',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
