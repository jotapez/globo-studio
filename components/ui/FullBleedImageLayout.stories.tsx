import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { FullBleedImageLayout } from './FullBleedImageLayout';

// ─── decorators ───────────────────────────────────────────────────────────────

/**
 * Wraps the story in PageWrapper + project brand-color surround,
 * matching the exact context FullBleedImageLayout lives in on /work/[slug].
 */
const withPageWrapper: Decorator = (Story) => (
  <div className="min-h-screen bg-[#001db0] p-[32px] max-md:p-[12px]">
    <div className="rounded-[80px] bg-[var(--bg-page)] p-[32px] flex flex-col gap-[56px] max-md:rounded-[24px] max-md:p-[12px] max-md:gap-[32px]">
      <Story />
    </div>
  </div>
);

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof FullBleedImageLayout> = {
  title: 'UI/FullBleedImageLayout',
  component: FullBleedImageLayout,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The "Full-Bleed Image Layout" content block inside \`<PageWrapper />\` on a project page (\`/work/[slug]\`).

A full-screen UI screenshot rendered edge-to-edge inside a card — no padding, image fills every pixel.
The card background is a project-specific brand tint — not a semantic token — so it does **not** change between light and dark mode.
It shows through only if the image has transparent areas or leaves any gap at the card edges.

**Responsive layout (from Figma nodes 994:45203 / 1057:1296 / 994:45255)**

| Breakpoint | Padding | Border radius | Token | Image fit |
|---|---|---|---|---|
| Mobile (\`< 768px\`) | none | 16px | \`--radius-block-mobile\` | \`object-cover\` |
| Tablet / Desktop (\`≥ 768px\`) | none | 56px | \`--radius-block\` | \`object-cover\` |

**Background:** passed as \`color\` prop — e.g. \`"var(--bg-project-ow)"\` or \`"#e0e2e8"\`.
No semantic token; no dark-mode override.

**Image aspect ratio:** passed as \`aspectRatio\` prop (e.g. \`"4096/2808"\`) — varies per project.

**Key difference from \`SingleImageColorBackground\`:** no padding — the card IS the image container.
Image uses \`object-cover\` (not \`object-contain\`) so it fills every pixel.

**Animation** — slides up + fades in on scroll-into-view (\`once: true\`).
\`y: 30px → 0, opacity: 0 → 1\`, 500 ms ease-out.
Respects \`prefers-reduced-motion\`.

**Figma:** Desktop \`994:45203\` · Tablet \`1057:1296\` · Mobile \`994:45255\`

\`\`\`tsx
<FullBleedImageLayout
  src="/projects/officeworks/catalogue-intro.png"
  alt="Custom catalogues feature introduction screen"
  color="var(--bg-project-ow)"
  aspectRatio="4096/2808"
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
    alt: 'Full-screen UI screenshot',
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
type Story = StoryObj<typeof FullBleedImageLayout>;

// ─── default (desktop) ────────────────────────────────────────────────────────

/**
 * Default — desktop / tablet.
 * OW blue-grey card (`#e0e2e8`), no padding, 56px border radius.
 * Image fills the card edge-to-edge.
 * Resize the canvas to see border radius respond at the md: breakpoint.
 */
export const Default: Story = {
  name: 'Default',
};

// ─── tablet viewport ──────────────────────────────────────────────────────────

/**
 * Tablet — 1024px canvas.
 * No padding, 56px border radius (same as desktop).
 * Image fills card edge-to-edge.
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
 * No padding, 16px border radius.
 * Image still fills the card fully — no gap at the edges.
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
 * The color is visible at the card corners (where border-radius clips the image).
 * Use the Controls panel to try different project brand tints.
 */
export const CustomColor: Story = {
  name: 'Custom color',
  args: {
    color: '#c8d4e8',  // hypothetical cool-toned project
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
