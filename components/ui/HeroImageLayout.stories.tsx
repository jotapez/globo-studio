import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { HeroImageLayout } from './HeroImageLayout';

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
 * matching the exact context HeroImageLayout lives in on /work/[slug].
 */
const withPageWrapper: Decorator = (Story) => (
  <div className="min-h-screen bg-[#001db0] p-[32px] max-md:p-[12px]">
    <div className="rounded-[80px] bg-[var(--bg-page)] p-[32px] flex flex-col gap-[56px] max-md:rounded-[24px] max-md:p-[12px] max-md:gap-[32px]">
      <Story />
    </div>
  </div>
);

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof HeroImageLayout> = {
  title: 'UI/HeroImageLayout',
  component: HeroImageLayout,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The first content block inside \`<PageWrapper />\` on a project page (\`/work/[slug]\`).

A full-width composited hero image — typically a device-mockup scene (iPad, MacBook, phone)
pre-exported from Figma. The image fills the block edge-to-edge via \`object-cover\`.
No padding, no background colour.

**Responsive aspect ratios (from Figma frame dimensions)**

| Breakpoint | Width | Aspect ratio | Shape | Border radius |
|---|---|---|---|---|
| Mobile (\`< 768px\`) | 353px | 329 / 470 | Portrait | \`--radius-block-mobile\` (16px) |
| Tablet (\`768–1023px\`) | 960px | 896 / 853 | Near-square | \`--radius-block\` (56px) |
| Desktop (\`≥ 1024px\`) | 1664px | 1600 / 853 | Landscape | \`--radius-block\` (56px) |

**Animation** — slides up + fades in on scroll-into-view (\`once: true\`).
\`y: 30px → 0, opacity: 0 → 1\`, 500 ms ease-out.
Respects \`prefers-reduced-motion\`.

**Figma:** Desktop \`1067:37126\` · Tablet \`1067:37127\` · Mobile \`1067:37128\`

\`\`\`tsx
<HeroImageLayout
  src="/projects/officeworks/hero.jpg"
  alt="iPad and MacBook showing the Officeworks B2B catalogue interface"
  priority
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
    alt: 'iPad on a wooden desk showing the Otherhomes property listings interface',
    priority: false,
  },

  argTypes: {
    src:       { control: 'text' },
    alt:       { control: 'text' },
    priority:  { control: 'boolean' },
    className: { table: { disable: true } },
  },

  decorators: [withPageWrapper],
};

export default meta;
type Story = StoryObj<typeof HeroImageLayout>;

// ─── default (desktop) ────────────────────────────────────────────────────────

/**
 * Default — desktop landscape (1600 × 853).
 * Resize the canvas to see the aspect ratio transition through tablet and mobile.
 */
export const Default: Story = {
  name: 'Default',
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — `--bg-page` in the surrounding PageWrapper flips to `#000000`.
 * The hero image itself is unaffected. Switch background to "dark".
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
 * Aspect ratio: 896 / 853 (near-square). Border radius: 56px.
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
 * Aspect ratio: 329 / 470 (portrait). Border radius: 16px.
 * The image crops to the centre of the landscape source photo.
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
 */
export const MobileDark: Story = {
  name: 'Mobile · Dark',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
};

// ─── priority (above fold) ────────────────────────────────────────────────────

/**
 * Priority — demonstrates `priority={true}` for above-the-fold use.
 * Functionally identical visually; next/image skips lazy-loading.
 */
export const Priority: Story = {
  name: 'Priority (above fold)',
  args: {
    priority: true,
  },
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — swap `src`, `alt`, and `priority` via the Controls panel.
 */
export const Playground: Story = {
  name: 'Playground',
};
