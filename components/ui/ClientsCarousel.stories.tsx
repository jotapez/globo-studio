import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ClientsCarousel, PLACEHOLDER_LOGOS } from './ClientsCarousel';

// ─── decorators ───────────────────────────────────────────────────────────────

const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ClientsCarousel> = {
  title: 'UI/ClientsCarousel',
  component: ClientsCarousel,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Infinite horizontal marquee of client logos — fills the full container width.

**Figma:** [clients-caroussel (994:1567)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=994-1567)

Track height \`52 px\` (\`--carousel-height\`). Logo height \`40 px\` (\`--carousel-logo-h\`).
Gap between logos \`48 px\` (\`--carousel-logo-gap\`). One full-track cycle: \`40 s\`.

Left/right edges fade to transparent via CSS \`mask-image\` gradient.
Animation pauses automatically for \`prefers-reduced-motion: reduce\`.

**Theme prop**
| Value | Blend mode | Intended background |
|---|---|---|
| \`auto\` (default) | \`luminosity\` | Adapts to page background via CSS cascade |
| \`light\` | \`multiply\` | Light background |
| \`dark\` | \`screen\` | Dark background |

**Logo prop** — accepts a \`LogoItem[]\` array. When \`src\` is omitted a placeholder
block renders. Swap in real assets by setting \`src\` on each \`PLACEHOLDER_LOGOS\` entry
(exported from the module) or by passing a custom \`logos\` prop.
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
      table: { defaultValue: { summary: 'auto' } },
    },
    className: { control: 'text', table: { category: 'Layout' } },
  },
};

export default meta;
type Story = StoryObj<typeof ClientsCarousel>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — 12 placeholder logos, auto theme, light background.
 * Logos scroll continuously. Resize the canvas to verify full-width behaviour.
 */
export const Default: Story = {
  name: 'Default · Placeholders',
  args: { theme: 'auto' },
};

// ─── theme: forced light ──────────────────────────────────────────────────────

/**
 * Light — `theme="light"` forces blend: multiply (dark logos on light bg).
 * Use when the carousel is guaranteed to sit on a light-coloured section.
 */
export const ThemeLight: Story = {
  name: 'Theme · Light (forced)',
  args: { theme: 'light' },
};

// ─── theme: forced dark ───────────────────────────────────────────────────────

/**
 * Dark — `theme="dark"` forces blend: screen (light logos on dark bg).
 * Use when the carousel sits on a guaranteed dark-coloured section.
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
 * Dark mode — applies `:root.dark` overrides so `theme="auto"` adapts via the
 * cascade. Switch the background to "dark" for the full visual effect.
 */
export const DarkModeAuto: Story = {
  name: 'Dark mode · Auto',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
  args: { theme: 'auto' },
};

// ─── custom logos ─────────────────────────────────────────────────────────────

/**
 * Custom logos — shows how to pass a custom `logos` prop once real assets
 * are ready. Some entries have `src` (simulated with a placeholder.svg data URL)
 * and some remain as placeholder blocks, reflecting a partial-asset state.
 */
export const CustomLogos: Story = {
  name: 'Custom logos (partial assets)',
  args: {
    theme: 'light',
    logos: PLACEHOLDER_LOGOS.map((logo, i) =>
      i % 3 === 0
        ? {
            ...logo,
            // Simulated asset: a simple grey rectangle SVG as stand-in
            src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${logo.width}' height='40' viewBox='0 0 ${logo.width} 40'%3E%3Crect width='${logo.width}' height='40' rx='4' fill='%23d4d4d4'/%3E%3C/svg%3E`,
          }
        : logo,
    ),
  },
};
