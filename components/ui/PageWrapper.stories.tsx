import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { PageWrapper } from './PageWrapper';

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
 * Wraps the story in a project-brand-color background to simulate how
 * the wrapper sits against the OW blue used in Figma (994:45176).
 */
const withProjectBackground: Decorator = (Story) => (
  <div className="min-h-screen bg-[#001db0] p-[32px]">
    <Story />
  </div>
);

// ─── placeholder blocks ───────────────────────────────────────────────────────

function PlaceholderBlock({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <div
      className={`w-full rounded-[56px] bg-black/10 flex items-center justify-center font-sans text-[var(--text-muted)] text-sm ${tall ? 'h-[320px]' : 'h-[160px]'}`}
    >
      {label}
    </div>
  );
}

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof PageWrapper> = {
  title: 'UI/PageWrapper',
  component: PageWrapper,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Rounded inset-card container for the project page (\`/work/[slug]\`).

All project page content — **ProjectIntro** + **ContentBlocks** — lives inside this wrapper.
It creates the visual "card" appearance set against the project brand-color background.

**Token:** uses \`--bg-page\` (\`#f8f8f7\` light / \`#000000\` dark) — no new tokens needed.

**Figma:** Desktop wrapper \`994:45176\`, Mobile wrapper \`994:45235\`

| Breakpoint | Border radius | Padding | Gap between children |
|---|---|---|---|
| Mobile (<768px) | 24px | 12px | 32px |
| Tablet / Desktop (768px+) | 80px | 32px | 56px |
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

  argTypes: {
    className: { table: { disable: true } },
  },

  decorators: [withProjectBackground],
};

export default meta;
type Story = StoryObj<typeof PageWrapper>;

// ─── shared children ──────────────────────────────────────────────────────────

const placeholderChildren = (
  <>
    <PlaceholderBlock label="ProjectIntro" />
    <PlaceholderBlock label="ContentBlock · hero" tall />
    <PlaceholderBlock label="ContentBlock · single-white" />
    <PlaceholderBlock label="ContentBlock · single-color" />
    <PlaceholderBlock label="ContentBlock · two-image" />
  </>
);

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — light background, project-OW brand color surround.
 * Resize the canvas to verify responsive border-radius and padding.
 */
export const Default: Story = {
  name: 'Default',
  render: (args) => <PageWrapper {...args}>{placeholderChildren}</PageWrapper>,
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — applies `:root.dark` so `--bg-page` flips to `#000000`.
 * Switch the canvas background to "dark" for the full effect.
 */
export const DarkModeAuto: Story = {
  name: 'Dark mode · Auto',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
  render: (args) => <PageWrapper {...args}>{placeholderChildren}</PageWrapper>,
};

// ─── mobile viewport ──────────────────────────────────────────────────────────

/**
 * Mobile — 393px viewport.
 * Border radius collapses to 24px, padding to 12px, gap to 32px.
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: (args) => <PageWrapper {...args}>{placeholderChildren}</PageWrapper>,
};

// ─── tablet viewport ──────────────────────────────────────────────────────────

/**
 * Tablet — 768px viewport.
 * Border radius expands to 80px, padding to 32px, gap to 56px.
 */
export const Tablet: Story = {
  name: 'Tablet',
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
  render: (args) => <PageWrapper {...args}>{placeholderChildren}</PageWrapper>,
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — use the Controls panel to add a custom className.
 */
export const Playground: Story = {
  name: 'Playground',
  render: (args) => <PageWrapper {...args}>{placeholderChildren}</PageWrapper>,
};
