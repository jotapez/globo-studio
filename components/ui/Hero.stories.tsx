import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { Hero } from './Hero';

// ─── decorators ───────────────────────────────────────────────────────────────

/** Applies :root.dark so dark-mode tokens activate for the duration of the story. */
const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Hero> = {
  title: 'UI/Hero',
  component: Hero,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full-viewport hero section — the first impression of Globo Studio.

**Figma:** [Hero (1010:38630)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=1010-38630)

**Shader** — LiquidMetal from [@paper-design/shaders-react](https://paper.design) rendered in a 1431:940 aspect-ratio container that scales to fit the viewport.

**Studio wordmark** — SVG overlaid at the bottom-right of the shader (~50% from left, ~75% from top).

**Entrance animation** — \`scale 0.98 → 1, opacity 0 → 1\`, 600 ms, 100 ms delay. Respects \`prefers-reduced-motion\`.

**Breakpoints**
| | Desktop | Mobile |
|---|---|---|
| Label font | 42 px | 24 px |
| Top padding (nav clearance) | 118 px | 104 px |
        `,
      },
    },
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white',      value: '#ffffff' },
        { name: 'light-gray', value: '#f5f5f5' },
        { name: 'dark',       value: '#111111' },
      ],
    },
  },

  argTypes: {
    animate: {
      control: 'boolean',
      description: 'Play entrance animation on mount.',
      table: { defaultValue: { summary: 'true' } },
    },
    showWordmark: {
      control: 'boolean',
      description: 'Render the "Studio" SVG wordmark over the shader.',
      table: { defaultValue: { summary: 'true' } },
    },
    wordmarkVariant: {
      control: 'radio',
      options: ['v1', 'v2'],
      description: 'Which "Studio" artwork to render: v1 (original, 1010:38630) or v2 (new hand-lettered lockup, Hero-2 1992:58507).',
      table: { defaultValue: { summary: 'v1' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — animated entrance, white background.
 * The LiquidMetal shader streams from the Paper CDN.
 * Toggle "animate" in the Controls panel to skip the entrance.
 */
export const Default: Story = {
  name: 'Default',
  args: { animate: true },
};

// ─── no animation ─────────────────────────────────────────────────────────────

/**
 * Static — entrance animation disabled.
 * Useful for visual regression snapshots.
 */
export const Static: Story = {
  name: 'Static (no animation)',
  args: { animate: false },
};

// ─── mobile ───────────────────────────────────────────────────────────────────

/**
 * Mobile — 393 px viewport, 24 px labels.
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: { animate: false },
};

// ─── tablet ───────────────────────────────────────────────────────────────────

/**
 * Tablet — 1024 px viewport. Verifies padding switches to desktop tokens
 * (32 px) and the shader scales proportionally between mobile and desktop.
 */
export const Tablet: Story = {
  name: 'Tablet',
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
  args: { animate: false },
};

// ─── wordmark v2 ──────────────────────────────────────────────────────────────

/**
 * WordmarkV2 — new hand-lettered "STUDIO" logotype from Figma (Hero-2, 1992:58507).
 * Compare against Default (v1, the original serif-style wordmark) to see both
 * artwork options side by side.
 */
export const WordmarkV2: Story = {
  name: 'Wordmark V2 (new)',
  args: { animate: false, wordmarkVariant: 'v2' },
};

// ─── no wordmark ──────────────────────────────────────────────────────────────

/**
 * NoWordmark — the "Studio" SVG wordmark hidden, shader only.
 * For comparing look and feel against the default with the wordmark shown.
 */
export const NoWordmark: Story = {
  name: 'No wordmark',
  args: { animate: false, showWordmark: false },
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — applies :root.dark token overrides.
 * Switch the background to "dark" to see the full effect.
 */
export const DarkMode: Story = {
  name: 'Dark mode',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
  args: { animate: false },
};
