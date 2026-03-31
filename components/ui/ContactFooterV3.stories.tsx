import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ContactFooterV3 } from './ContactFooterV3';

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

const meta: Meta<typeof ContactFooterV3> = {
  title: 'UI/ContactFooterV3',
  component: ContactFooterV3,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Contact section + footer bar — **v3** with shader clocks.

Contact section + footer bar — **v3** with 3-mode interactive clocks.

Click or tap anywhere on the clocks area to cycle through three modes:

| Mode | Clock appearance |
|---|---|
| **Shader** (default) | LiquidMetal WebGL shader per circle, black hands |
| **Light** | Solid white fill, black ring + hands |
| **Dark** | Solid black fill, white ring + hands |
| **Colour** | Each clock has its own pastel colour (yellow, red, blue, green) at 50% opacity, black hands |

Keyboard accessible: Tab to the clocks container, press **Enter** or **Space** to cycle.

Fills \`min-h-lvh\` and contains three vertically distributed rows:
1. **Contact links** — 2-column desktop grid / 1-column mobile. Email, phone, LinkedIn, OnlyMe.
2. **Interactive clocks row** — all 4 visible at every breakpoint, click to cycle mode.
3. **Footer bar** — logo + copyright left, tagline right (desktop); stacked (mobile).

### Differences from ContactFooterV2

| | v2 | v3 |
|---|---|---|
| Clock modes | light ↔ dark | shader → light → dark → shader |
| Default clock | Follows CSS token cascade | LiquidMetal shader |
| \`theme\` prop | Clock colour + text colour | Text colour only |
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
      description: 'Page colour theme — controls section text colour only.',
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
type Story = StoryObj<typeof ContactFooterV3>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — white background, all 4 shader clocks updating in real-time.
 */
export const Default: Story = {
  name: 'Default',
  args: { theme: 'auto' },
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — applies `:root.dark` token overrides.
 * Switch the Storybook background to "dark" for the full effect.
 */
export const DarkMode: Story = {
  name: 'Dark mode',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
  args: { theme: 'auto' },
};

// ─── mobile viewport ──────────────────────────────────────────────────────────

/**
 * Mobile — 393 px viewport.
 * All 4 shader clocks visible. Labels show city name only (no time).
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
 * 4 clocks, 2-col contact links, row-layout footer bar.
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
 * Playground — use the Controls panel to change theme and bgColor.
 */
export const Playground: Story = {
  name: 'Playground',
  args: { theme: 'auto' },
};
