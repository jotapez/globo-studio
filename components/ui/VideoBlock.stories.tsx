import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { VideoBlock } from './VideoBlock';

// ─── decorators ───────────────────────────────────────────────────────────────

/**
 * Wraps the story in PageWrapper + project brand-color surround,
 * matching the exact context VideoBlock lives in on /work/[slug].
 */
const withPageWrapper: Decorator = (Story) => (
  <div className="min-h-screen bg-[#001db0] p-[32px] max-md:p-[12px]">
    <div className="rounded-[80px] bg-[var(--bg-page)] p-[32px] flex flex-col gap-[56px] max-md:rounded-[24px] max-md:p-[12px] max-md:gap-[32px]">
      <Story />
    </div>
  </div>
);

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof VideoBlock> = {
  title: 'UI/VideoBlock',
  component: VideoBlock,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The "Video Block" content block inside \`<PageWrapper />\` on a project page (\`/work/[slug]\`).

Embeds a YouTube video inside an aspect-ratio container.
Accepts a YouTube watch URL, youtu.be short URL, embed URL, or bare video ID.

Optionally wraps the iframe in a project brand-color card with responsive border-radius.
When \`color\` is omitted, the iframe renders directly with no card wrapper.

**Responsive layout**

| Breakpoint | Border radius | Token |
|---|---|---|
| Mobile (\`< 768px\`) | 16px | \`--radius-block-mobile\` |
| Tablet / Desktop (\`≥ 768px\`) | 56px | \`--radius-block\` |

**Background:** passed as \`color\` prop — e.g. \`"var(--bg-project-ow)"\` or \`"#e0e2e8"\`.
No semantic token; no dark-mode override.
If omitted, no card wrapper is rendered — the iframe fills the block directly.

**Aspect ratio:** passed as \`aspectRatio\` prop (defaults to \`"16/9"\`).

**Animation** — slides up + fades in on scroll-into-view (\`once: true\`).
\`y: 30px → 0, opacity: 0 → 1\`, 500 ms ease-out.
Respects \`prefers-reduced-motion\`.

\`\`\`tsx
<VideoBlock
  src="https://www.youtube.com/watch?v=t3NtV5vvXMQ"
  title="Placeholder video"
  color="var(--bg-project-ow)"
  aspectRatio="16/9"
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
    src: 'https://www.youtube.com/watch?v=t3NtV5vvXMQ',
    title: 'Placeholder video',
    color: 'var(--bg-project-ow)',
    aspectRatio: '16/9',
  },

  argTypes: {
    src:         { control: 'text' },
    title:       { control: 'text' },
    color:       { control: 'color' },
    aspectRatio: { control: 'text' },
    className:   { table: { disable: true } },
  },

  decorators: [withPageWrapper],
};

export default meta;
type Story = StoryObj<typeof VideoBlock>;

// ─── default (desktop) ────────────────────────────────────────────────────────

/**
 * Default — desktop / tablet.
 * OW blue-grey card (`var(--bg-project-ow)`), 16/9 aspect ratio, 56px border radius.
 * Resize the canvas to see border radius respond at the md: breakpoint.
 */
export const Default: Story = {
  name: 'Default',
};

// ─── tablet viewport ──────────────────────────────────────────────────────────

/**
 * Tablet — 1024px canvas.
 * Same brand-color card, 56px border radius.
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
 * Brand-color card, 16px border radius.
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

// ─── no background ────────────────────────────────────────────────────────────

/**
 * NoBackground — `color` prop omitted.
 * The iframe renders directly with no card wrapper — no border radius, no background tint.
 */
export const NoBackground: Story = {
  name: 'No background',
  args: {
    color: undefined,
  },
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — swap `src`, `title`, `color`, and `aspectRatio`
 * via the Controls panel.
 */
export const Playground: Story = {
  name: 'Playground',
};
