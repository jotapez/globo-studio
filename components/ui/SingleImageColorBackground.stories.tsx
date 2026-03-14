import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { SingleImageColorBackground } from './SingleImageColorBackground';

// ─── decorators ───────────────────────────────────────────────────────────────

/**
 * Wraps the story in PageWrapper + project brand-color surround,
 * matching the exact context SingleImageColorBackground lives in on /work/[slug].
 */
const withPageWrapper: Decorator = (Story) => (
  <div className="min-h-screen bg-[#001db0] p-[32px] max-md:p-[12px]">
    <div className="rounded-[80px] bg-[var(--bg-page)] p-[32px] flex flex-col gap-[56px] max-md:rounded-[24px] max-md:p-[12px] max-md:gap-[32px]">
      <Story />
    </div>
  </div>
);

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof SingleImageColorBackground> = {
  title: 'UI/SingleImageColorBackground',
  component: SingleImageColorBackground,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The "Single Image — Project Color Background" content block inside \`<PageWrapper />\` on a project page (\`/work/[slug]\`).

A design system export, illustration, or UI image rendered inside a card with the project's brand color as the background.
The background is a project-specific brand tint — not a semantic token — so it does **not** change between light and dark mode.

**Responsive layout (from Figma nodes 994:45192 / 994:45251)**

| Breakpoint | Padding | Border radius | Token |
|---|---|---|---|
| Mobile (\`< 768px\`) | 16px | 16px | \`--radius-block-mobile\` |
| Tablet / Desktop (\`≥ 768px\`) | 40px | 56px | \`--radius-block\` |

**Background:** passed as \`color\` prop — e.g. \`"var(--bg-project-ow)"\` or \`"#e0e2e8"\`.
No semantic token; no dark-mode override.

**Image aspect ratio:** passed as \`aspectRatio\` prop (e.g. \`"3614/4096"\`) — varies per project.

**Animation** — slides up + fades in on scroll-into-view (\`once: true\`).
\`y: 30px → 0, opacity: 0 → 1\`, 500 ms ease-out.
Respects \`prefers-reduced-motion\`.

**Figma:** Desktop/Tablet \`994:45192\` · Mobile \`994:45251\`

\`\`\`tsx
<SingleImageColorBackground
  src="/projects/officeworks/design-system.png"
  alt="Officeworks design system component library overview"
  color="var(--bg-project-ow)"
  aspectRatio="3614/4096"
/>
\`\`\`
        `,
      },
    },
    backgrounds: {
      default: 'project-ow',
      values: [
        { name: 'project-ow',  value: '#001db0' },
        { name: 'white',       value: '#ffffff' },
        { name: 'light-gray',  value: '#f5f5f5' },
        { name: 'dark',        value: '#171717' },
      ],
    },
  },

  args: {
    src: '/projects/project-1.png',
    alt: 'Design system component library overview',
    color: 'var(--bg-project-ow)',
    aspectRatio: '4034/2760',
    priority: false,
  },

  argTypes: {
    src:         { control: 'text' },
    alt:         { control: 'text' },
    color:       { control: 'color' },
    aspectRatio: { control: 'text' },
    priority:    { control: 'boolean' },
    className:   { table: { disable: true } },
  },

  decorators: [withPageWrapper],
};

export default meta;
type Story = StoryObj<typeof SingleImageColorBackground>;

// ─── default (desktop) ────────────────────────────────────────────────────────

/**
 * Default — desktop / tablet.
 * OW blue-grey card (`#e0e2e8`), 40px padding, 56px border radius.
 * Resize the canvas to see padding and radius respond at the md: breakpoint.
 */
export const Default: Story = {
  name: 'Default',
};

// ─── tablet viewport ──────────────────────────────────────────────────────────

/**
 * Tablet — 1024px canvas.
 * 40px padding, 56px border radius (same as desktop).
 */
export const Tablet: Story = {
  name: 'Tablet',
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

// ─── mobile viewport ──────────────────────────────────────────────────────────

/**
 * Mobile — 393px canvas.
 * 16px padding, 16px border radius.
 * Note: mobile radius is 16px here (--radius-block-mobile), not 24px
 * (--radius-card-mobile) as used in SingleImageWhiteCard.
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

// ─── custom color ─────────────────────────────────────────────────────────────

/**
 * CustomColor — demonstrates swapping the brand color via Controls.
 * Use the Controls panel to try different project brand tints.
 */
export const CustomColor: Story = {
  name: 'Custom color',
  args: {
    color: '#f0e6d3',  // hypothetical warm-toned project
  },
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — swap `src`, `alt`, `color`, `aspectRatio`, and `priority`
 * via the Controls panel.
 */
export const Playground: Story = {
  name: 'Playground',
};
