import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ProjectIntro } from './ProjectIntro';

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
 * Simulates how ProjectIntro sits inside PageWrapper on a project page.
 * The brand-blue background + rounded card mirrors the Figma context (994:45176).
 */
const withPageWrapper: Decorator = (Story) => (
  <div className="min-h-screen bg-[#001db0] p-[32px]">
    <div className="rounded-[80px] bg-[var(--bg-page)] p-[32px] max-md:rounded-[24px] max-md:p-[12px]">
      <Story />
    </div>
  </div>
);

// ─── shared heading ───────────────────────────────────────────────────────────

/**
 * Officeworks heading with the Figma-specified serif/sans split.
 * Base font: Instrument Serif (font-serif).
 * Sans overrides: "Manage", "efficiently", "more" → Helvetica Neue.
 */
const officeworksHeading = (
  <>
    Officeworks —{' '}
    <br />
    <span className="font-sans">Manage</span>
    {' '}your B2B account{' '}
    <span className="font-sans">efficiently</span>
    {' '}and do{' '}
    <span className="font-sans">more</span>
  </>
);

const officeworksBody = (
  <>
    <p className="mb-[1em]">
      Officeworks is a $3.4B Australian retailer with 170+ stores and a robust eCommerce
      platform serving consumers, businesses, schools, and government across tech,
      stationery, furniture, and print. The B2B Digital Experience program is a strategic
      5-year initiative designed to simplify operations and deliver seamless customer
      experiences that support B2B&apos;s continued profitable growth.
    </p>
    <p>
      I led product experience design for Officeworks&apos; B2B self-service platform,
      delivering streamlined account management features from discovery through to
      production. Working with business analysts, designers, engineers, and stakeholders,
      I established the team&apos;s foundational design system during their Adobe XD to
      Figma transition—introducing design variables and systematic workflows. This work
      created scalable, user-centred experiences that support ongoing B2B innovation.
    </p>
  </>
);

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ProjectIntro> = {
  title: 'UI/ProjectIntro',
  component: ProjectIntro,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Always the first block inside \`<PageWrapper />\` on a project page (\`/work/[slug]\`).

**Layout**
| Breakpoint | Columns | Padding | Gap |
|---|---|---|---|
| Mobile (<768px) | 1 (heading then body) | \`pt-8px px-8px\` | \`16px\` |
| Tablet / Desktop (≥768px) | 2 equal columns | \`pt-24px px-24px\` | \`32px\` |

**Typography — Heading** (\`<h1>\`)

Mixed serif/sans: base font is **Instrument Serif** (\`font-serif\`). Wrap individual
words in \`<span className="font-sans">\` to switch to Helvetica Neue.
The exact split is defined per case study and annotated in Figma.

| Breakpoint | Size | Line-height | Token |
|---|---|---|---|
| Mobile | 40px | 54px | \`--text-h1-mobile-size\` / \`--text-h1-mobile-leading\` |
| Desktop | 64px | 84px | \`--text-h1-size\` / \`--text-h1-leading\` |

**Typography — Body**

Helvetica Neue (\`font-sans\`), \`--text-primary\`.

| Breakpoint | Size | Line-height | Token |
|---|---|---|---|
| Mobile | 16px | 21px | \`--text-intro-sm-mobile-size\` / \`--text-intro-sm-mobile-leading\` |
| Desktop | 20px | 28px | \`--text-intro-sm-size\` / \`--text-intro-sm-leading\` |

**Animation** — heading and body slide up + fade in on scroll-into-view (\`once: true\`).
Respects \`prefers-reduced-motion\`.

**Figma:** Desktop \`1061:1441\` / Mobile \`1067:1816\`
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
    heading: officeworksHeading,
    body: officeworksBody,
  },

  argTypes: {
    heading:   { control: false },
    body:      { control: false },
    className: { table: { disable: true } },
  },

  decorators: [withPageWrapper],
};

export default meta;
type Story = StoryObj<typeof ProjectIntro>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default — desktop two-column layout with the Officeworks case study copy.
 * Resize the canvas to see columns stack on mobile.
 */
export const Default: Story = {
  name: 'Default',
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — applies `:root.dark` so `--text-primary` and `--bg-page` flip.
 * Switch the canvas background to "dark" for the full effect.
 */
export const DarkModeAuto: Story = {
  name: 'Dark mode · Auto',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode, withPageWrapper],
};

// ─── mobile viewport ──────────────────────────────────────────────────────────

/**
 * Mobile — 393px canvas.
 * Columns stack: heading first (40px/54px), then body (16px/21px).
 */
export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'project-ow' },
  },
};

// ─── mobile dark ──────────────────────────────────────────────────────────────

/**
 * Mobile · Dark — 393px canvas with dark-mode tokens.
 */
export const MobileDark: Story = {
  name: 'Mobile · Dark',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode, withPageWrapper],
};

// ─── tablet viewport ──────────────────────────────────────────────────────────

/**
 * Tablet — 768px canvas.
 * Two-column layout activates; heading at 64px/84px.
 */
export const Tablet: Story = {
  name: 'Tablet',
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

// ─── playground ───────────────────────────────────────────────────────────────

/**
 * Playground — swap in custom heading / body via the Controls panel.
 */
export const Playground: Story = {
  name: 'Playground',
};
