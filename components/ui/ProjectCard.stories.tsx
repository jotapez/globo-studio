import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from './ProjectCard';

// ─── placeholder image ────────────────────────────────────────────────────────

const PLACEHOLDER_DESKTOP = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1520" height="672">' +
  '<rect width="1520" height="672" fill="#e5e5e5"/>' +
  '<text x="760" y="336" font-family="Helvetica Neue,sans-serif" font-size="28" ' +
  'fill="#999" text-anchor="middle" dominant-baseline="middle">Project image</text>' +
  '</svg>'
)}`;

const PLACEHOLDER_MOBILE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="353" height="284">' +
  '<rect width="353" height="284" fill="#e5e5e5"/>' +
  '<text x="176" y="142" font-family="Helvetica Neue,sans-serif" font-size="16" ' +
  'fill="#999" text-anchor="middle" dominant-baseline="middle">Project image</text>' +
  '</svg>'
)}`;

// ─── shared args ──────────────────────────────────────────────────────────────

const BASE_ARGS = {
  title: 'Officeworks',
  description:
    'MetaCell Cloud is the suite of products powered by MetaCell. For building those products more efficiently and quickly, I led the creation of MetaCell Design System, our in-house design system based on our brand.',
  href: '/work/officeworks',
};

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ProjectCard> = {
  title: 'UI/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Case study preview card used in the homepage work grid.

**Figma:** [project-card-desktop (1000:4834)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=1000-4834) · [project-card-mobile (1000:4851)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=1000-4851)

**Hover** — hovering the **image or heading** morphs border-radius from card → circle (500 ms ease) and sweeps a left-to-right underline bar under the title (300 ms). Hovering description or empty space has no effect. Keyboard focus also triggers the underline.

**Disabled** — renders at 40 % opacity with \`pointer-events: none\`. Use for "Coming Soon" case studies.

**Breakpoints**
| | Desktop | Mobile |
|---|---|---|
| Image height | 672 px | 284 px |
| Image radius | \`--radius-card\` 40 px | \`--radius-card-mobile\` 24 px |
| Hover radius | \`--radius-card-circle\` 1000 px | \`--radius-card-circle\` 1000 px |
| Body font | 16 / 24 | 14 / 21 |
| Desc. max-width | 570 px | full width |
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

  argTypes: {
    title:       { control: 'text' },
    description: { control: 'text' },
    href:        { control: 'text' },
  },

  decorators: [
    (Story) => (
      <div style={{ padding: '32px', maxWidth: '1584px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

// ─── desktop ──────────────────────────────────────────────────────────────────

/**
 * Desktop default — full-width image, 40 px radius.
 * Hover the image or heading to see the circle morph + animated underline sweep.
 */
export const DesktopDefault: Story = {
  name: 'Desktop · Default',
  args: {
    ...BASE_ARGS,
    imageSrc: PLACEHOLDER_DESKTOP,
  },
};

/**
 * Desktop disabled — "Coming Soon" state: faded, non-interactive.
 */
export const DesktopDisabled: Story = {
  name: 'Desktop · Disabled',
  args: {
    ...BASE_ARGS,
    imageSrc:    PLACEHOLDER_DESKTOP,
    disabled:    true,
    title:       'Coming Soon',
    description: 'This case study is currently in progress. Check back soon.',
    href:        '#',
  },
};

// ─── mobile ───────────────────────────────────────────────────────────────────

/**
 * Mobile default — 353 px wide, 24 px radius image.
 */
export const MobileDefault: Story = {
  name: 'Mobile · Default',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '353px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    ...BASE_ARGS,
    imageSrc: PLACEHOLDER_MOBILE,
  },
};

/**
 * Mobile disabled.
 */
export const MobileDisabled: Story = {
  name: 'Mobile · Disabled',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '353px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    ...BASE_ARGS,
    imageSrc:    PLACEHOLDER_MOBILE,
    disabled:    true,
    title:       'Coming Soon',
    description: 'This case study is currently in progress.',
    href:        '#',
  },
};

// ─── all states ───────────────────────────────────────────────────────────────

/**
 * All states — desktop cards stacked for visual regression.
 * Hover each card to verify the morph animation.
 */
export const AllStates: Story = {
  name: 'All states',
  parameters: {
    docs: {
      description: {
        story:
          'All card states rendered at desktop width. Hover the image or heading on each card to verify the circle-morph and animated underline sweep.',
      },
    },
  },
  decorators: [
    () => (
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           'var(--card-gap)',
          padding:       '32px',
          maxWidth:      '1584px',
          margin:        '0 auto',
        }}
      >
        {/* Default */}
        <div>
          <p
            style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      'var(--text-xs-size)',
              color:         'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom:  '16px',
            }}
          >
            Default — hover to see morph
          </p>
          <ProjectCard
            {...BASE_ARGS}
            imageSrc={PLACEHOLDER_DESKTOP}
          />
        </div>

        {/* Disabled */}
        <div>
          <p
            style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      'var(--text-xs-size)',
              color:         'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom:  '16px',
            }}
          >
            Disabled (Coming Soon)
          </p>
          <ProjectCard
            title="Coming Soon"
            description="This case study is currently in progress. Check back soon."
            href="#"
            imageSrc={PLACEHOLDER_DESKTOP}
            disabled
          />
        </div>
      </div>
    ),
  ],
  render: () => <></>,
};
