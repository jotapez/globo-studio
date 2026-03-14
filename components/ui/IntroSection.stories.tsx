import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { IntroSection } from './IntroSection';

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

const meta: Meta<typeof IntroSection> = {
  title: 'UI/IntroSection',
  component: IntroSection,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The \`#intro\` section of the Globo Studio homepage.

Fills \`min-h-svh\` with content vertically centred. Two stacked rows:
1. **Heading** — large mixed-typeface paragraph alternating Instrument Serif and Helvetica Neue. Font-size \`--text-h1-size\` (64px) on desktop, \`--text-h1-mobile-size\` (40px) on mobile.
2. **Client carousel** — reuses \`<ClientsCarousel />\` with infinite horizontal loop.

**Typography pattern** — matches Figma:
| Words | Typeface |
|---|---|
| Globo, orchestrated, Product Designer, experiences, systems | Helvetica Neue (sans) |
| G'day., is an AI native design studio, by, Juan Pablo Castro, a, crafting, and, globally. | Instrument Serif (serif) |

**Scroll entrance** — text fades + slides up (\`y: 30→0, opacity: 0→1\`), carousel follows 200ms later. Respects \`prefers-reduced-motion\`.

**\`theme\` prop** — forwarded only to \`<ClientsCarousel>\` for blend-mode control.

| Value | Carousel blend mode |
|---|---|
| \`auto\` (default) | \`luminosity\` — adapts to cascade |
| \`light\` | \`multiply\` — dark logos on light bg |
| \`dark\` | \`screen\` — light logos on dark bg |

**TODO:** "Juan Pablo Castro" hover photo — pending \`<DesignerPhoto />\` component (homepage-spec.md §4).
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
      description: 'Colour theme forwarded to ClientsCarousel.',
      table: { defaultValue: { summary: 'auto' } },
    },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof IntroSection>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — auto theme, white background.
 * Scroll the canvas to trigger the entrance animation.
 */
export const Default: Story = {
  name: 'Default',
  args: { theme: 'auto' },
};

// ─── theme: forced light ──────────────────────────────────────────────────────

/**
 * Light theme — forced via `theme="light"`.
 * Carousel logos render in multiply blend mode for dark logos on a light background.
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
 * Carousel logos render in screen blend mode for light logos on a dark background.
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
 * Dark mode auto — applies `:root.dark` token overrides.
 * Switch the background to "dark" for the full effect.
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
 * Mobile — 393px viewport. Verifies 40px heading size and centred text layout.
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
 * Tablet — 768px viewport. Verifies 64px heading size, full-width text block,
 * and carousel at tablet scale.
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
 * Playground — use the Controls panel to explore props.
 */
export const Playground: Story = {
  name: 'Playground',
  args: { theme: 'auto' },
};
