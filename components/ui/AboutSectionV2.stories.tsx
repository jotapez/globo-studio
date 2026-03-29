import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { AboutSectionV2 } from './AboutSectionV2';

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
 * won't affect it — we set a data attribute and override motion detection instead.
 * The simplest Storybook-safe approach is to force it via a style tag targeting
 * the media feature at the document level.
 */
const withReducedMotion: Decorator = (Story) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'reduced-motion-override';
    style.textContent = `*, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }`;
    document.head.appendChild(style);
    // Also force the media query via the window object for matchMedia-based checks
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

const meta: Meta<typeof AboutSectionV2> = {
  title: 'UI/AboutAnimation',
  component: AboutSectionV2,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Alternative \`#about\` section featuring a scroll-driven metallic sphere convergence animation.

**Interaction**
Scroll the Storybook canvas to trigger the animation. Four \`LiquidMetal\` spheres start
scattered across the viewport and converge toward the centre over ~200vh of scroll distance.
As they merge, a single large sphere fades in. Once the animation completes the page scrolls
normally through the bio content below.

**Shader**
Each sphere uses \`LiquidMetal\` from \`@paper-design/shaders-react\` with \`shape="circle"\`
and a transparent background, so they float on the section background.

**Layout**
| Phase | What happens |
|---|---|
| 0–200vh scroll | Spheres animate toward centre (sticky viewport, 300vh wrapper) |
| After 200vh | Bio content (name, heading, paragraphs) scrolls normally |

**Reduced motion**
When \`prefers-reduced-motion: reduce\` is active the sticky animation is skipped entirely.
A single sphere is rendered statically above the bio.

**Theming**
Uses \`--bg-page\`, \`--text-primary\`, and \`--text-secondary\` tokens. Switches seamlessly
between light mode (white background, dark text) and dark mode (black background, white text)
via the \`:root.dark\` class.
        `,
      },
    },
    backgrounds: {
      default: 'white',
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
type Story = StoryObj<typeof AboutSectionV2>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — light mode, white background with dark text.
 * Scroll the canvas to trigger the convergence animation.
 */
export const Default: Story = {
  name: 'Default · Light',
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — applies `:root.dark` token overrides.
 * Black background with white text and metallic spheres.
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
 * Mobile — 393px viewport. Scroll to verify spheres scale correctly and bio
 * text wraps at mobile token sizes.
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

// ─── reduced motion ───────────────────────────────────────────────────────────

/**
 * Reduced motion — forces `prefers-reduced-motion: reduce` so Framer Motion
 * skips scroll-linked transforms. Verifies the static fallback: single sphere
 * above the bio, no animation.
 */
export const ReducedMotion: Story = {
  name: 'Reduced motion',
  decorators: [withReducedMotion],
};
