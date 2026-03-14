import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { SingleImageWhiteCard } from './SingleImageWhiteCard';

// ─── decorators ───────────────────────────────────────────────────────────────

/** Applies :root.dark so dark-mode tokens activate for the duration of the story. */
const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

/**
 * Wraps the story in PageWrapper + project brand-color surround,
 * matching the exact context SingleImageWhiteCard lives in on /work/[slug].
 */
const withPageWrapper: Decorator = (Story) => (
  <div className="min-h-screen bg-[#001db0] p-[32px] max-md:p-[12px]">
    <div className="rounded-[80px] bg-[var(--bg-page)] p-[32px] flex flex-col gap-[56px] max-md:rounded-[24px] max-md:p-[12px] max-md:gap-[32px]">
      <Story />
    </div>
  </div>
);

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof SingleImageWhiteCard> = {
  title: 'UI/SingleImageWhiteCard',
  component: SingleImageWhiteCard,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The "Single Image — White Card" content block inside \`<PageWrapper />\` on a project page (\`/work/[slug]\`).

A UI screenshot or interface mockup rendered inside a white (light) or near-black (dark) rounded card.
The card provides padding and a neutral background for contrast — \`object-contain\` ensures the full
screenshot is always visible without cropping.

**Responsive layout (from Figma nodes 994:45188 / 994:45247)**

| Breakpoint | Padding | Border radius | Token |
|---|---|---|---|
| Mobile (\`< 768px\`) | 16px | 24px | \`--radius-card-mobile\` |
| Tablet / Desktop (\`≥ 768px\`) | 48px | 56px | \`--radius-block\` |

**Background token:** \`--bg-project-card\` — \`#ffffff\` light / \`#1a1a1a\` dark.

**Image aspect ratio:** passed as \`aspectRatio\` prop (e.g. \`"4034/2760"\`) — varies per project.

**Animation** — slides up + fades in on scroll-into-view (\`once: true\`).
\`y: 30px → 0, opacity: 0 → 1\`, 500 ms ease-out.
Respects \`prefers-reduced-motion\`.

**Figma:** Desktop/Tablet \`994:45188\` · Mobile \`994:45247\`

\`\`\`tsx
<SingleImageWhiteCard
  src="/projects/officeworks/ui-screenshot.png"
  alt="Officeworks B2B catalogue product listing page"
  aspectRatio="4034/2760"
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
    alt: 'UI screenshot showing the interface design',
    aspectRatio: '4034/2760',
    priority: false,
  },

  argTypes: {
    src:         { control: 'text' },
    alt:         { control: 'text' },
    aspectRatio: { control: 'text' },
    priority:    { control: 'boolean' },
    className:   { table: { disable: true } },
  },

  decorators: [withPageWrapper],
};

export default meta;
type Story = StoryObj<typeof SingleImageWhiteCard>;

// ─── default (desktop) ────────────────────────────────────────────────────────

/**
 * Default — desktop / tablet.
 * White card, 48px padding, 56px border radius.
 * Resize the canvas to see padding and radius respond at the md: breakpoint.
 */
export const Default: Story = {
  name: 'Default',
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — `--bg-project-card` flips to `#1a1a1a`.
 * Switch background to "dark".
 */
export const DarkModeAuto: Story = {
  name: 'Dark mode · Auto',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
};

// ─── tablet viewport ──────────────────────────────────────────────────────────

/**
 * Tablet — 1024px canvas.
 * 48px padding, 56px border radius (same as desktop).
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
 * 16px padding, 24px border radius.
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

// ─── mobile dark ──────────────────────────────────────────────────────────────

/**
 * Mobile · Dark — 393px canvas with dark-mode tokens applied.
 * Card background: `#1a1a1a`.
 */
export const MobileDark: Story = {
  name: 'Mobile · Dark',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — swap `src`, `alt`, and `priority` via the Controls panel.
 */
export const Playground: Story = {
  name: 'Playground',
};
