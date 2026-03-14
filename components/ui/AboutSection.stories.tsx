import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { AboutSection } from './AboutSection';

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

const meta: Meta<typeof AboutSection> = {
  title: 'UI/AboutSection',
  component: AboutSection,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The \`#about\` section of the Globo Studio homepage.

Contains a designer bio (heading + body copy) and a portrait photo.

**Layout**
| Breakpoint | Columns | Detail |
|---|---|---|
| Mobile (<768px) | 1 | Photo full-width above, text below. \`py-100px\` |
| Tablet (768–1023px) | 1 | Photo right-aligned (464px) above, text below. \`py-200px\` |
| Desktop (≥1024px) | 2 | Text 816px left, photo 533px right, \`justify-between\`. \`py-200px\` |

**Typography — Heading** \`"Rewriting the process right now"\`

Mixed serif/sans with a responsive type-family swap:
| Breakpoint | Base font | Override |
|---|---|---|
| Mobile | Helvetica Neue (sans) | "the", "right now" → Instrument Serif |
| Tablet/Desktop | Instrument Serif (serif) | "process" → Helvetica Neue |

**Typography — Bio**
| Breakpoint | First paragraph | Remaining |
|---|---|---|
| Mobile | \`--text-intro-mobile-size\` (24px) | \`--text-intro-sm-mobile-size\` (16px) |
| Tablet/Desktop | \`--text-intro-size\` (32px) | \`--text-intro-size\` (32px) |

**Scroll entrance animation** — photo slides in from right (\`x: 60→0\`), text from left (\`x: -40→0\`), staggered 150ms. Respects \`prefers-reduced-motion\`.

**Photo** — served from \`/portrait-jp.png\`. Rounded corners: \`--radius-card-mobile\` (24px) on mobile, \`--radius-card\` (40px) on tablet+.
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
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof AboutSection>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — light background, auto theme.
 * Scroll the canvas to trigger the entrance animation.
 */
export const Default: Story = {
  name: 'Default',
};

// ─── dark mode (token cascade) ────────────────────────────────────────────────

/**
 * Dark mode — applies `:root.dark` token overrides.
 * Switch the background to "dark" for the full effect.
 */
export const DarkModeAuto: Story = {
  name: 'Dark mode · Auto',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
};

// ─── mobile viewport ──────────────────────────────────────────────────────────

/**
 * Mobile — 393px viewport.
 * Verifies: photo full-width, caption at xs size, heading in sans-base
 * mixed type, bio first paragraph larger than rest.
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

// ─── mobile dark ──────────────────────────────────────────────────────────────

/**
 * Mobile dark — 393px viewport with dark mode tokens applied.
 */
export const MobileDark: Story = {
  name: 'Mobile · Dark',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
};

// ─── tablet viewport ──────────────────────────────────────────────────────────

/**
 * Tablet — 768px viewport.
 * Verifies: photo right-aligned at 464px, heading switches to serif-base,
 * bio text unified at 32px.
 */
export const Tablet: Story = {
  name: 'Tablet',
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — use the Controls panel and background switcher to explore.
 */
export const Playground: Story = {
  name: 'Playground',
};
