import type { Meta, StoryObj } from '@storybook/react';
import { HeadSphere } from './HeadSphere';

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof HeadSphere> = {
  title: 'UI/HeadSphere',
  component: HeadSphere,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Interactive 3D globe with an equirectangular world-map texture mapped onto it.
**Click** the sphere to launch it to a random position — it rotates proportionally to the distance it travels.

Built with **Three.js** (WebGL renderer) + **GSAP** \`power4.out\` easing.

**Props**
| Prop | Default | Description |
|------|---------|-------------|
| \`imageSrc\` | \`/Homepage/head.jpg\` | Texture path (relative to /public) |
| \`size\` | \`300\` | Sphere diameter in pixels |
        `,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'white',      value: '#ffffff' },
        { name: 'light-gray', value: '#f5f5f5' },
        { name: 'dark',       value: '#171717' },
      ],
    },
  },

  argTypes: {
    imageSrc: { control: 'text' },
    size: {
      control: { type: 'range', min: 100, max: 600, step: 10 },
      table: { defaultValue: { summary: '300' } },
    },
  },

  // full-viewport stage so the sphere can wander freely
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeadSphere>;

// ─── stories ──────────────────────────────────────────────────────────────────

/**
 * Default size. Click the sphere to send it flying.
 */
export const Default: Story = {
  name: 'Default · 300 px',
  args: {
    imageSrc: '/world-map.jpg',
    size: 300,
  },
};

/**
 * Large variant — prominent, hero-scale.
 */
export const Large: Story = {
  name: 'Large · 500 px',
  args: {
    imageSrc: '/world-map.jpg',
    size: 500,
  },
};

/**
 * Small variant — thumbnail scale.
 */
export const Small: Story = {
  name: 'Small · 150 px',
  args: {
    imageSrc: '/world-map.jpg',
    size: 150,
  },
};
