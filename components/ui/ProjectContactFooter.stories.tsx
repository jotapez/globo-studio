import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ProjectContactFooter } from './ProjectContactFooter';

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

const meta: Meta<typeof ProjectContactFooter> = {
  title: 'UI/ProjectContactFooter',
  component: ProjectContactFooter,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Contact section + footer bar for project pages (\`/work/[slug]\`).

Identical to \`ContactFooter\` but with the **clocks row omitted** (\`showClocks={false}\`).

Figma: Contact section (1065:934)
- Desktop (1065:1812) — 1664×322 px: contact links (2-col) + footer bar, gap 64 px
- Tablet (1065:1813) — 960×322 px: same structure
- Mobile (1065:1814) — 353×453 px: stacked contact links (centered) + footer bar (centered)

**Dark mode** — all color tokens auto-respond to \`.dark\` on \`<html>\` via \`tokens.css\`.
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
      description: 'Colour theme forwarded to ContactFooter.',
      table: { defaultValue: { summary: 'auto' } },
    },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectContactFooter>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — auto theme, light background.
 * No clocks row. Resize the canvas to verify responsive layout.
 */
export const Default: Story = {
  name: 'Default',
  args: { theme: 'auto' },
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
 * Mobile — 393 px viewport. Verifies centred contact text and stacked footer.
 * Matches Figma 1065:1814.
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
 * Tablet — 768 px viewport. Verifies contact columns switch to 2-col and
 * the footer becomes a row (logo left, tagline right). Matches Figma 1065:1813.
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
 */
export const Playground: Story = {
  name: 'Playground',
  args: { theme: 'auto' },
};
