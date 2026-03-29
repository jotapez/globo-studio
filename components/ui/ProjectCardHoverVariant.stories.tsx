import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from './ProjectCard';

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ProjectCard> = {
  title: 'UI/ProjectCard — Hover Variant',
  component: ProjectCard,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Hover-swap variant of ProjectCard. In the default state the card shows only the
title and a brand/illustration image. On hover of the **image or title**:

1. The first image cross-fades to the hero image (second image).
2. The description fades in.

On mouse leave both effects reverse.

Uses the existing \`ProjectCard\` component with two new optional props:
- \`hoverImageSrc\` — second image revealed on hover
- \`showDescriptionOnHover\` — description hidden until hover
        `,
      },
    },
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white',      value: '#ffffff' },
        { name: 'light-gray', value: '#f5f5f5' },
      ],
    },
  },

  decorators: [
    (Story) => (
      <div style={{ padding: '32px', maxWidth: '860px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

// ─── shared base props ─────────────────────────────────────────────────────────

const HOVER_VARIANT_BASE = {
  showDescriptionOnHover: true,
};

// ─── per-client stories ────────────────────────────────────────────────────────

/**
 * Officeworks — hover the image or title to cross-fade from the brand SVG to
 * the hero image and reveal the description.
 */
export const Officeworks: Story = {
  name: 'Officeworks',
  args: {
    ...HOVER_VARIANT_BASE,
    title:        'Officeworks B2B Digital Experience',
    description:  'End-to-end product design for Officeworks B2B — discovery to delivery — including their foundational design system and coaching designers on systematic workflows.',
    href:         '/work/officeworks',
    imageSrc:     '/Homepage/OW-project-card-first.svg',
    hoverImageSrc: '/Officeworks/OW-hero.png',
    targetBg:     '#001db0',
  },
};

/**
 * Open Insurance — hover to cross-fade from the brand SVG to the hero image
 * and reveal the description.
 */
export const OpenInsurance: Story = {
  name: 'Open Insurance',
  args: {
    ...HOVER_VARIANT_BASE,
    title:        'Open Insurance',
    description:  'Product design for car and home insurance products from strategy to delivery, while building and governing the design system at Open Insurance.',
    href:         '/work/open-insurance',
    imageSrc:     '/Homepage/OI-project-card-first.svg',
    hoverImageSrc: '/Open Insurance/OI-hero.png',
    targetBg:     '#1c1c3a',
  },
};

/**
 * kicbox — hover to cross-fade from the brand SVG to the hero image
 * and reveal the description.
 */
export const Kicbox: Story = {
  name: 'kicbox',
  args: {
    ...HOVER_VARIANT_BASE,
    title:        'kicbox',
    description:  "Product experience design for Taronga Zoo's new website, crafting an immersive and accessible digital presence for one of Australia's most iconic destinations.",
    href:         '/work/kicbox',
    imageSrc:     '/Homepage/kicbox-project-card.svg',
    hoverImageSrc: '/kicbox/kicbox-hero.png',
    targetBg:     '#1a3d2b',
  },
};

/**
 * Retro — hover to cross-fade from the brand SVG to the hero image
 * and reveal the description.
 */
export const Retro: Story = {
  name: 'Retro',
  args: {
    ...HOVER_VARIANT_BASE,
    title:        'Retro',
    description:  'Leading product design across multiple client engagements at Levo, a leading technology consultancy delivering impactful digital experiences.',
    href:         '/work/retro',
    imageSrc:     '/Homepage/Retro-project-card.svg',
    hoverImageSrc: '/Retro/retro-hero.png',
    targetBg:     '#2d1a00',
  },
};

// ─── all clients ───────────────────────────────────────────────────────────────

const ALL_CLIENTS = [
  {
    title:        'Officeworks B2B Digital Experience',
    description:  'End-to-end product design for Officeworks B2B — discovery to delivery — including their foundational design system and coaching designers on systematic workflows.',
    href:         '/work/officeworks',
    imageSrc:     '/Homepage/OW-project-card-first.svg',
    hoverImageSrc: '/Officeworks/OW-hero.png',
    targetBg:     '#001db0',
  },
  {
    title:        'Open Insurance',
    description:  'Product design for car and home insurance products from strategy to delivery, while building and governing the design system at Open Insurance.',
    href:         '/work/open-insurance',
    imageSrc:     '/Homepage/OI-project-card-first.svg',
    hoverImageSrc: '/Open Insurance/OI-hero.png',
    targetBg:     '#1c1c3a',
  },
  {
    title:        'kicbox',
    description:  "Product experience design for Taronga Zoo's new website, crafting an immersive and accessible digital presence for one of Australia's most iconic destinations.",
    href:         '/work/kicbox',
    imageSrc:     '/Homepage/kicbox-project-card.svg',
    hoverImageSrc: '/kicbox/kicbox-hero.png',
    targetBg:     '#1a3d2b',
  },
  {
    title:        'Retro',
    description:  'Leading product design across multiple client engagements at Levo, a leading technology consultancy delivering impactful digital experiences.',
    href:         '/work/retro',
    imageSrc:     '/Homepage/Retro-project-card.svg',
    hoverImageSrc: '/Retro/retro-hero.png',
    targetBg:     '#2d1a00',
  },
] as const;

/**
 * All clients — 2-column grid showing all 4 cards simultaneously.
 * Hover each card individually to verify the cross-fade and description reveal.
 */
export const AllClients: Story = {
  name: 'All clients',
  parameters: {
    docs: {
      description: {
        story: 'All 4 client cards in a 2-col grid. Hover each card to verify the image cross-fade and description fade-in.',
      },
    },
  },
  decorators: [
    () => (
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap:                 'var(--card-gap, 40px)',
          padding:             '32px',
          maxWidth:            '1728px',
          margin:              '0 auto',
        }}
      >
        {ALL_CLIENTS.map((project) => (
          <ProjectCard
            key={project.href}
            {...project}
            showDescriptionOnHover
          />
        ))}
      </div>
    ),
  ],
  render: () => <></>,
};
