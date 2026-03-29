import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { AboutSectionV3 } from './AboutSectionV3';

// ─── decorators ───────────────────────────────────────────────────────────────

/** Applies :root.dark so dark-mode tokens activate for the duration of the story. */
const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

/**
 * Simulates prefers-reduced-motion by injecting a stylesheet override.
 * Framer Motion reads the media query via matchMedia, so a CSS override alone
 * won't affect it — we patch window.matchMedia for the duration of the story.
 */
const withReducedMotion: Decorator = (Story) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'reduced-motion-override';
    style.textContent = `*, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }`;
    document.head.appendChild(style);
    const original = window.matchMedia;
    window.matchMedia = (query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return { matches: true, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true } as MediaQueryList;
      }
      return original(query);
    };
    return () => {
      style.remove();
      window.matchMedia = original;
    };
  }, []);
  return <Story />;
};

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof AboutSectionV3> = {
  title: 'UI/AboutSectionV3',
  component: AboutSectionV3,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`#about\` section variant — sphere convergence animation above a centered bio column with no portrait photo.

**Animation**
When the section enters the viewport, four \`LiquidMetal\` spheres animate from their spread
Frame 1 positions toward a single convergence point over 1.8 s (eased). No scroll distance
required — the animation fires once on entry.

**Bio section**
Single centered column (815px max-width). Layout top-to-bottom:
sphere → name / title → heading → bio paragraphs. No portrait image.

**Reduced motion**
A single static sphere renders at the convergence position above the bio. No animation.

**Theming**
Uses \`--bg-page\`, \`--text-primary\`, and \`--text-secondary\` tokens.
        `,
      },
    },
    backgrounds: {
      default: 'black',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'black', value: '#000000' },
      ],
    },
  },

  argTypes: {
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof AboutSectionV3>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — light mode. Scroll into view to trigger the sphere convergence animation.
 */
export const Default: Story = {
  name: 'Default · Light',
  parameters: {
    backgrounds: { default: 'white' },
  },
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — black background with white text and metallic spheres.
 * This is the intended production appearance.
 */
export const DarkMode: Story = {
  name: 'Dark mode',
  parameters: {
    backgrounds: { default: 'black' },
  },
  decorators: [withDarkMode],
};

// ─── mobile viewport ──────────────────────────────────────────────────────────

/**
 * Mobile — 393px viewport. Verifies sphere scaling, column padding clamps to 20px,
 * and bio text wraps at mobile token sizes.
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'black' },
  },
  decorators: [withDarkMode],
};

// ─── reduced motion ───────────────────────────────────────────────────────────

/**
 * Reduced motion — forces `prefers-reduced-motion: reduce`. Verifies the static
 * fallback: single sphere above the bio, no animation.
 */
export const ReducedMotion: Story = {
  name: 'Reduced motion',
  parameters: {
    backgrounds: { default: 'black' },
  },
  decorators: [withDarkMode, withReducedMotion],
};
