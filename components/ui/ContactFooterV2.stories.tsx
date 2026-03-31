import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ContactFooterV2 } from './ContactFooterV2';

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

const meta: Meta<typeof ContactFooterV2> = {
  title: 'UI/ContactFooterV2',
  component: ContactFooterV2,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Contact section + footer bar — **v2** with interactive clocks.

Fills \`min-h-lvh\` and contains three vertically distributed rows:
1. **Contact links** — 2-column desktop grid / 1-column mobile (centered). Email, phone, LinkedIn, OnlyMe.
2. **Interactive clocks row** — all 4 clocks visible at every breakpoint (v1 hides Barcelona + San Juan on mobile).
3. **Footer bar** — logo + copyright left, tagline right (desktop); stacked centered (mobile).

### Interactive clocks

Click or tap **anywhere on the clocks area** to toggle the clock theme between light and dark.

| State | Clock appearance |
|---|---|
| Initial (\`auto\`) | Follows the page theme via CSS token cascade |
| First click → \`light\` | Black strokes (forced, regardless of page theme) |
| Second click → \`dark\` | White strokes (forced, regardless of page theme) |
| Subsequent clicks | Toggle between \`light\` ↔ \`dark\` |

Keyboard accessible: Tab to the clocks container, press **Enter** or **Space** to toggle.

### Dark mode

All color tokens auto-respond to \`.dark\` on \`<html>\` via \`tokens.css\`. Use the **Dark mode · Auto** story to see the full effect.

### Differences from ContactFooter (v1)

| | v1 | v2 |
|---|---|---|
| Mobile clocks | 2 (Sydney + Rancagua) | 4 (all cities) |
| Clock area | Static | Interactive — click to toggle theme |
| \`showClocks\` prop | ✓ | — |
| \`clocksOnTop\` prop | ✓ | — |
| \`footerBarGap\` prop | ✓ | — |
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
    theme: {
      control: 'select',
      options: ['auto', 'light', 'dark'],
      description: 'Initial clock colour theme. The user can override it by clicking the clocks.',
      table: { defaultValue: { summary: 'auto' } },
    },
    className: {
      control: 'text',
      description: 'Extra classes on the root <section>.',
    },
    bgColor: {
      control: 'color',
      description: 'Background colour override. Defaults to var(--bg-page).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContactFooterV2>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — auto theme on a white background.
 * All 4 clocks update in real-time. Click the clocks area to toggle their theme.
 */
export const Default: Story = {
  name: 'Default',
  args: { theme: 'auto' },
};

// ─── dark mode (token cascade) ────────────────────────────────────────────────

/**
 * Dark mode auto — applies `:root.dark` token overrides so all color tokens
 * flip to dark values. Clocks start in white (auto on dark bg). Click to toggle.
 * Switch the Storybook background to "dark" for the full effect.
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
 * Mobile — 393 px viewport.
 * Verifies all 4 clocks are visible (v1 only shows 2), centered contact text,
 * and stacked footer bar.
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
 * Tablet — 768 px viewport.
 * Verifies 4 clocks, 2-col contact links, and row-layout footer bar.
 */
export const Tablet: Story = {
  name: 'Tablet',
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
  args: { theme: 'auto' },
};

// ─── interactive toggle demo ──────────────────────────────────────────────────

/**
 * Interactive toggle demo — mid-gray background so both light (black strokes)
 * and dark (white strokes) clock hands are clearly visible against it.
 *
 * Click anywhere on the clocks to see the theme switch. The first click always
 * goes to the opposite of the current page theme (auto-detected), then subsequent
 * clicks toggle between light ↔ dark.
 */
export const InteractiveToggle: Story = {
  name: 'Interactive · Toggle demo',
  args: {
    theme: 'auto',
    bgColor: '#808080',
  },
  parameters: {
    backgrounds: {
      default: 'mid-gray',
      values: [
        { name: 'mid-gray', value: '#808080' },
        { name: 'white',    value: '#ffffff' },
        { name: 'dark',     value: '#171717' },
      ],
    },
    docs: {
      description: {
        story:
          'Mid-gray background makes both light (black strokes) and dark (white strokes) ' +
          'clock hands clearly visible. Click the clocks to toggle — the contrast change ' +
          'is immediately apparent in either direction.',
      },
    },
  },
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — use the Controls panel to change the initial theme prop.
 * Remember the clocks can always be toggled independently by clicking them.
 */
export const Playground: Story = {
  name: 'Playground',
  args: { theme: 'auto' },
};
