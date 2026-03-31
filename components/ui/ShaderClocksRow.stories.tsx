import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ShaderClocksRow } from './ShaderClocksRow';

// ─── decorators ───────────────────────────────────────────────────────────────

const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

const withPadding: Decorator = (Story) => (
  <div style={{ padding: '40px' }}>
    <Story />
  </div>
);

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ShaderClocksRow> = {
  title: 'UI/ShaderClocksRow',
  component: ShaderClocksRow,
  tags: ['autodocs'],
  decorators: [withPadding],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
4 overlapping clock circles with a **single continuous LiquidMetal shader** as background.

### How it works

A single WebGL shader canvas spans the full row width. An SVG \`<clipPath>\` with
4 dynamically-measured circles clips the shader so it only shows through each clock face.
Clock hands (SVG lines) are rendered on top. This uses **one WebGL context** and
produces the continuous shader flow from the Figma design.

### Proportional scaling

Each clock uses \`flex-1\` + \`aspect-square\` — both the shader and the hands scale
automatically with the container width. No fixed sizes.

### Overlap

Same 40 px overlap technique as ContactFooterV2: \`paddingRight: 40px\` on the row
plus \`marginRight: -40px\` on each clock wrapper.
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
};

export default meta;
type Story = StoryObj<typeof ShaderClocksRow>;

// ─── stories ──────────────────────────────────────────────────────────────────

/** Default — white background, full width. */
export const Default: Story = {
  name: 'Default',
};

/** Dark page background. */
export const DarkMode: Story = {
  name: 'Dark mode',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
};

/** Mobile — 393 px viewport. All 4 clocks visible. */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

/** Tablet — 768 px viewport. */
export const Tablet: Story = {
  name: 'Tablet',
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

/** Narrow container — tests proportional scaling at a fixed max-width. */
export const Narrow: Story = {
  name: 'Narrow (600px)',
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};
