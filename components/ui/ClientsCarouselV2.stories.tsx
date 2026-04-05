import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ClientsCarouselV2 } from './ClientsCarouselV2';

// ─── decorators ───────────────────────────────────────────────────────────────

const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ClientsCarouselV2> = {
  title: 'UI/ClientsCarouselV2',
  component: ClientsCarouselV2,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Card-style infinite horizontal marquee of client logos.

**Figma:** [994:43399](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=994-43399)

Each logo sits inside a fixed rounded card (\`258×151 px\` desktop, \`171×106 px\` mobile)
with a \`--bg-client-logo-card\` background fill. Cards scroll right-to-left continuously.
Left/right edges fade to transparent via CSS \`mask-image\`. Animation pauses for
\`prefers-reduced-motion: reduce\`.

**Card dimensions**
| | Desktop | Mobile |
|---|---|---|
| Card size | 258 × 151 px | 171 × 106 px |
| Radius | 24 px | 17 px |
| Inner logo area | 120 × 72 px | 84 × 50 px |
| Gap | 16 px | 8 px |

**Theme prop**
| Value | Logo treatment |
|---|---|
| \`auto\` (default) | Grayscale, inverts in dark mode via cascade |
| \`light\` | Grayscale, no invert |
| \`dark\` | Grayscale + inverted |
        `,
      },
    },
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'white',      value: '#ffffff' },
        { name: 'light-gray', value: '#f8f8f7' },
        { name: 'dark',       value: '#000000' },
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
type Story = StoryObj<typeof ClientsCarouselV2>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — auto theme on a light background.
 * Cards scroll continuously with fade gradients on both edges.
 */
export const Default: Story = {
  name: 'Default',
  args: { theme: 'auto' },
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — applies `:root.dark` so `theme="auto"` inverts logos
 * and card backgrounds switch to the dark token value.
 */
export const DarkModeAuto: Story = {
  name: 'Dark mode · Auto',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
  args: { theme: 'auto' },
};

// ─── mobile ───────────────────────────────────────────────────────────────────

/**
 * Mobile — 393 px viewport. Smaller cards (171×106 px), tighter gaps (8 px),
 * softer radius (17 px).
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'light-gray' },
  },
  args: { theme: 'auto' },
};
