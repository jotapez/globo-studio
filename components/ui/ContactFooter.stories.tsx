import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ContactFooter } from './ContactFooter';

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

const meta: Meta<typeof ContactFooter> = {
  title: 'UI/ContactFooter',
  component: ContactFooter,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Contact section + footer bar for the Globo Studio homepage.

Fills \`min-h-svh\` and contains three vertically distributed rows:
1. **Contact links** — 2-column desktop grid / 1-column mobile. Email, phone, LinkedIn, and OnlyMe links.
2. **Clocks row** — 4 analogue clocks on desktop/tablet, 2 on mobile (Sydney + Rancagua). Reuses the \`Clock\` component.
3. **Footer bar** — logo placeholder + copyright on the left, tagline on the right. Use \`footerBarGap\` to add 80px separation above it (project page only).

**Dark mode** — all color tokens auto-respond to \`.dark\` on \`<html>\` via \`tokens.css\`. No extra logic needed.

**\`theme\` prop** — forwarded only to \`<Clock>\` to control SVG blend mode.

| Value | Clock effect |
|---|---|
| \`auto\` (default) | Follows the CSS token cascade |
| \`light\` | Forces black strokes via \`--color-black\` |
| \`dark\` | Forces white strokes via \`--color-white\` |

**Breakpoints**
| Breakpoint | Clocks | Layout |
|---|---|---|
| Mobile (<768px) | 2 | Stacked, centered text |
| Tablet (768px+) | 4 | 2-col contact, 4-col clocks, row footer |
| Desktop (1024px+) | 4 | Same as tablet, \`max-w-desktop\` centered |
        `,
      },
    },
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white',      value: '#ffffff' },
        { name: 'light-gray', value: '#f5f5f5' },
        { name: 'dark',       value: '#171717' },
      ],
    },
  },

  argTypes: {
    showClocks: {
      control: 'boolean',
      description: 'When false, the clocks row is not rendered (project page variant).',
      table: { defaultValue: { summary: 'true' } },
    },
    footerBarGap: {
      control: 'boolean',
      description: 'When true, adds 80px top margin above the footer bar. Use on project pages.',
      table: { defaultValue: { summary: 'false' } },
    },
    theme: {
      control: 'select',
      options: ['auto', 'light', 'dark'],
      description: 'Colour theme forwarded to each Clock.',
      table: { defaultValue: { summary: 'auto' } },
    },
    className: {
      control: 'text',
      description: 'Extra classes on the root element. Use `min-h-0` on project pages to prevent viewport-height fill.',
    },
    clocksOnTop: {
      control: 'boolean',
      description: 'When true, renders ClocksRow above ContactLinks.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContactFooter>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — auto theme, light background.
 * Clocks update in real-time. Resize the canvas to verify responsive layout.
 */
export const Default: Story = {
  name: 'Default',
  args: { theme: 'auto' },
};

// ─── theme: forced light ──────────────────────────────────────────────────────

/**
 * Light theme — forced via `theme="light"`.
 * Clock hands render in black strokes regardless of the page background.
 */
export const ThemeLight: Story = {
  name: 'Theme · Light (forced)',
  parameters: {
    backgrounds: { default: 'white' },
  },
  args: { theme: 'light' },
};

// ─── theme: forced dark ───────────────────────────────────────────────────────

/**
 * Dark theme — forced via `theme="dark"`.
 * Clock hands render in white strokes on a dark background.
 */
export const ThemeDark: Story = {
  name: 'Theme · Dark (forced)',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: { theme: 'dark' },
};

// ─── dark mode (token cascade) ────────────────────────────────────────────────

/**
 * Dark mode auto — applies `:root.dark` token overrides so all color tokens
 * flip to dark values. Switch the background to "dark" for the full effect.
 */
export const DarkModeAuto: Story = {
  name: 'Dark mode · Auto',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
  args: { theme: 'auto' },
};

// ─── mobile viewport ──────────────────────────────────────────────────────────

/**
 * Mobile — 393 px viewport. Verifies 2-clock layout, centred contact text,
 * and stacked footer (copyright + tagline on separate lines, built-with below).
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: { theme: 'auto' },
};

// ─── tablet viewport ──────────────────────────────────────────────────────────

/**
 * Tablet — 768 px viewport. Verifies all 4 clocks appear, contact columns
 * switch to 2-col, and the footer becomes a row (logo left, tagline right).
 */
export const Tablet: Story = {
  name: 'Tablet',
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
  args: { theme: 'auto' },
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — use the Controls panel to toggle the theme prop.
 * The background should be switched manually to match the selected theme.
 */
export const Playground: Story = {
  name: 'Playground',
  args: { theme: 'auto' },
};

// ─── no clocks (project page) ─────────────────────────────────────────────────

/**
 * Project page variant — clocks hidden, footer does not fill the viewport.
 *
 * Two differences from the homepage version:
 *   1. `showClocks={false}` — clocks row not rendered
 *   2. `className="min-h-0"` — overrides `min-h-svh` so the section sizes
 *      to its content at all breakpoints (mobile, tablet, desktop)
 */
export const NoClocksRow: Story = {
  name: 'No clocks · Project page',
  args: { showClocks: false, footerBarGap: true, className: 'min-h-0', theme: 'auto' },
  parameters: {
    docs: {
      description: {
        story:
          'Used on project pages (`/work/[slug]`). ' +
          'Clocks row is hidden, `min-h-svh` is overridden with `min-h-0` so the ' +
          'footer sizes to its content, and `footerBarGap` adds 80px above the footer bar. ' +
          'All contact links and the footer bar are unchanged.',
      },
    },
  },
};

// ─── clocks on top (layout variation) ────────────────────────────────────────

/**
 * Clocks on top — ClocksRow above ContactLinks.
 * Layout variation for review; not used on the homepage.
 */
export const ClocksOnTop: Story = {
  name: 'Clocks on top · Variation',
  args: { clocksOnTop: true, theme: 'auto' },
  parameters: {
    docs: {
      description: {
        story:
          'Layout variation with the clocks row above the contact links. ' +
          'Use the Controls panel to test with light/dark theme and mobile viewport.',
      },
    },
  },
};
