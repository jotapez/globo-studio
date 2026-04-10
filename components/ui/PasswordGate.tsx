'use client';

/**
 * PasswordGate — full-page password interstitial for protected project pages.
 *
 * Figma: Password screen — frames 01–08
 * https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=1799-66572
 *
 * Layout (matches Figma):
 *   Fixed nav (rendered by WorkTransition, outside this component)
 *   ↓
 *   Gate content area — centers heading + input in remaining viewport height
 *   ↓
 *   ContactFooterV3 — full-width footer with project brand color
 *
 * Behaviour:
 *   - On mount, checks sessionStorage for a prior unlock (key: gs-unlocked-{slug})
 *   - Wrong password → input pill shakes (nav-wiggle keyframe), error message fades in
 *   - Correct password → gate fades + scales out, project content fades in
 *   - Unlock is cached in sessionStorage; refreshing within the same session skips the gate
 */

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useAnimation, useReducedMotion } from 'framer-motion';
import { ContactFooterV3 } from '@/components/ui/ContactFooterV3';

// ─── types ─────────────────────────────────────────────────────────────────────

interface PasswordGateProps {
  password: string;
  slug: string;
  /** CSS variable or hex for the gate page background, e.g. 'var(--bg-page-project-ow)' */
  bgColor: string;
  /** Raw hex for the submit arrow SVG stroke, e.g. '#001db0' */
  accentColor: string;
  footerBgColor?: string;
  footerTheme?: 'auto' | 'light' | 'dark';
  children: React.ReactNode;
}

// ─── component ─────────────────────────────────────────────────────────────────

export function PasswordGate({
  password,
  slug,
  bgColor,
  accentColor,
  footerBgColor,
  footerTheme,
  children,
}: PasswordGateProps) {
  const storageKey = `gs-unlocked-${slug}`;

  const [mounted, setMounted]   = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue]       = useState('');
  const [error, setError]       = useState(false);

  const inputRef     = useRef<HTMLInputElement>(null);
  const pillControls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  const headingAnim = shouldReduceMotion
    ? {}
    : {
        initial:    { opacity: 0, y: 20 },
        animate:    { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: 'easeOut' as const },
      };

  const bodyAnim = shouldReduceMotion
    ? {}
    : {
        initial:    { opacity: 0, y: 20 },
        animate:    { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: 'easeOut' as const, delay: 0.1 },
      };

  // ── hydration + sessionStorage check ──────────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(storageKey) === '1') setUnlocked(true);
    setMounted(true);
  }, [storageKey]);

  // ── pin html + body background to brand color before first paint ──────────
  // Ensures iOS overscroll rubber-band area matches the page, not white.
  useLayoutEffect(() => {
    document.documentElement.style.backgroundColor = accentColor;
    document.body.style.backgroundColor = accentColor;
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [accentColor]);

  // ── submit handler ─────────────────────────────────────────────────────────
  const attempt = useCallback(async () => {
    if (value === password) {
      sessionStorage.setItem(storageKey, '1');
      setUnlocked(true);
    } else {
      setValue('');
      setError(true);
      // Shake the pill (mirrors nav-wiggle timing)
      await pillControls.start({
        x: [0, -6, 6, -6, 6, -6, 6, -6, 6, 0],
        transition: { duration: 0.6, ease: 'easeInOut' },
      });
      inputRef.current?.focus();
    }
  }, [value, password, storageKey, pillControls]);

  // Don't render until client has run — avoids sessionStorage/SSR mismatch
  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div
          key="gate"
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25, ease: 'easeIn' } }}
          className="flex flex-col"
          style={{ backgroundColor: bgColor }}
        >
          {/* ── Gate content area — full viewport height, content centred ── */}
          <div className="min-h-svh flex items-center justify-center px-8 md:px-0">
            <div className="w-full md:w-max flex flex-col items-start md:items-center">

              {/* Mixed heading — Instrument Serif + Bricolage Grotesque Medium */}
              <motion.h1
                {...headingAnim}
                className="w-full md:whitespace-nowrap text-white font-serif text-[36px] md:text-[64px] leading-[50px] md:leading-[84px] m-0"
              >
                {'This '}
                <span className="font-sans font-medium [letter-spacing:-0.03em]">work</span>
                {' is '}
                <br className="md:hidden" aria-hidden="true" />
                <span className="font-sans font-medium [letter-spacing:-0.03em]">password-</span>
                {'protected.'}
              </motion.h1>

              {/* Input section — full width mobile, 480px centered on desktop */}
              <motion.div {...bodyAnim} className="flex flex-col gap-4 w-full md:w-[480px] mt-6">
                <p className="text-white text-base leading-6 m-0">
                  Enter the password to continue
                </p>

                <div className="flex flex-col gap-4">
                  {/* Input pill */}
                  <motion.div
                    animate={pillControls}
                    className="flex items-center h-[54px] w-full pl-5 pr-1 py-1 rounded-full bg-white/[0.08] border border-white/40 focus-within:border-white transition-colors duration-150 overflow-hidden"
                  >
                    <input
                      ref={inputRef}
                      type="password"
                      autoComplete="current-password"
                      value={value}
                      onChange={e => {
                        setValue(e.target.value);
                        if (error) setError(false);
                      }}
                      onKeyDown={e => { if (e.key === 'Enter') attempt(); }}
                      placeholder="Enter password"
                      className="
                        flex-1 min-w-0 bg-transparent outline-none
                        text-white/90 placeholder:text-[#bebebe]
                        text-base leading-6
                      "
                    />
                    <button
                      onClick={attempt}
                      aria-label="Submit password"
                      className="shrink-0 size-9 md:size-[46px] rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                    >
                      <svg
                        width="16" height="16" viewBox="0 0 16 16"
                        fill="none" aria-hidden="true"
                        stroke={accentColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 8h10M10 5l3 3-3 3" />
                      </svg>
                    </button>
                  </motion.div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-white text-base leading-6 m-0"
                      >
                        Wrong password. Try again.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Contact CTA */}
              <p className="mt-20 text-white text-base leading-6 m-0 whitespace-nowrap md:whitespace-normal md:text-center">
                Do you want a password?{' '}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="underline underline-offset-2 cursor-pointer"
                >
                  Contact me
                </a>
              </p>

            </div>
          </div>

          {/* ── Footer ── */}
          <ContactFooterV3 bgColor={footerBgColor} theme={footerTheme} />
        </motion.div>
      ) : (
        <motion.div
          key="project"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
