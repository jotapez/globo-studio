import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ProjectNav } from './ProjectNav';
import { ProjectTransitionProvider } from './ProjectTransitionContext';

// ─── shared fixture data ──────────────────────────────────────────────────────

const ALL_PROJECTS = [
  { slug: 'officeworks',    clientName: 'Officeworks',    bgColor: '#001db0' },
  { slug: 'taronga-zoo',    clientName: 'Taronga Zoo',    bgColor: '#1a3d2b' },
  { slug: 'open-insurance', clientName: 'Open Insurance', bgColor: '#1c1c3a' },
  { slug: 'levo',           clientName: 'Levo',           bgColor: '#2d1a00' },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

/** Wrapper that gives the fixed nav room to breathe in the Storybook canvas. */
const withNavCanvas: Decorator = (Story) => (
  <ProjectTransitionProvider>
    <div style={{ height: '160px', position: 'relative' }}>
      <Story />
    </div>
  </ProjectTransitionProvider>
);

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ProjectNav> = {
  title: 'UI/ProjectNav',
  component: ProjectNav,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Project-page variant of the pill navigation bar — used on \`/work/[slug]\` routes.

**Figma:** [project-nav-desktop (970:43877)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=970-43877) · [project-nav-mobile (954:40878)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=954-40878)

Renders three items instead of four:

\`\`\`
[ Globo ]  [ <Client name> ]  [ Next project ]
                 ↑ always active
\`\`\`

**Item behaviour**
| Item | Action |
|------|--------|
| Globo | Navigates to \`/\` (same tab) |
| Client name | Active — click suppressed, no navigation |
| Next project | Navigates to \`nextHref\` (same tab) |

**Mobile layout** — "Globo" and "Next project" shrink to content width;
client name fills remaining space. Desktop: all three equal-width.

**Tokens** — inherits all \`--bg-nav\`, \`--bg-nav-selected\`, \`--bg-nav-hover\`,
\`--text-nav-item\`, \`--text-nav-item-selected\` tokens from \`Nav\`. No new tokens.
        `,
      },
    },
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'light-gray', value: '#f0f0f0' },
        { name: 'white',      value: '#ffffff'  },
        { name: 'dark',       value: '#111111'  },
      ],
    },
  },

  argTypes: {
    clientName: {
      control: 'text',
      description: 'Label for the active center item.',
      table: { defaultValue: { summary: 'Officeworks' } },
    },
    nextHref: {
      control: 'text',
      description: 'href for the "Next project" link.',
      table: { defaultValue: { summary: '/work/taronga-zoo' } },
    },
    nextLabel: {
      control: 'text',
      description: 'Override the right-hand item label.',
      table: { defaultValue: { summary: 'Next project' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all items.',
      table: { defaultValue: { summary: 'false' } },
    },
  },

  args: {
    clientName:   'Officeworks',
    activeSlug:   'officeworks',
    nextHref:     '/work/taronga-zoo',
    nextBgColor:  '#1a3d2b',
    allProjects:  ALL_PROJECTS,
  },

  decorators: [withNavCanvas],
};

export default meta;
type Story = StoryObj<typeof ProjectNav>;

// ─── default ──────────────────────────────────────────────────────────────────

/**
 * Default state — client name ("Officeworks") is active.
 * This is the standard appearance on any project page.
 */
export const Default: Story = {
  name: 'Default · Client active',
  parameters: {
    docs: {
      description: {
        story:
          'The client name pill is always active on the project page. ' +
          'Clicking it does nothing. "Globo" navigates to `/`, "Next project" navigates to `nextHref`.',
      },
    },
  },
};

// ─── label variants ───────────────────────────────────────────────────────────

/**
 * Short client name — e.g. a 1-word label like "Levo".
 * Verifies the pill fills the center slot evenly on desktop.
 */
export const ShortClientName: Story = {
  name: 'Client name · Short',
  args: { clientName: 'Levo' },
};

/**
 * Long client name — verifies no overflow or layout break at desktop width.
 */
export const LongClientName: Story = {
  name: 'Client name · Long',
  args: { clientName: 'Taronga Conservation Society' },
};

/**
 * Custom next-project label — useful when "See next" or a project name
 * is preferred over the default "Next project".
 */
export const CustomNextLabel: Story = {
  name: 'Next label · Custom',
  args: { nextLabel: 'Taronga Zoo' },
};

// ─── states ───────────────────────────────────────────────────────────────────

/**
 * Disabled — all items are non-interactive at 40 % opacity.
 * Used during page transitions or route loading.
 */
export const Disabled: Story = {
  name: 'State · Disabled',
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story: 'All items are non-interactive. The pill bar fades to 40 % opacity.',
      },
    },
  },
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — applies :root.dark to activate the dark token set.
 * Switch the Storybook background to "dark" for the full effect.
 *
 * Light → Dark token mapping:
 * --bg-nav:          #000000 → #ffffff
 * --bg-nav-selected: #f8f8f7 → #000000
 * --bg-nav-hover:    #484b53 → #bfc4cc
 * --text-nav-item:   #ffffff → #000000
 * --text-nav-item-selected: #000000 → #ffffff
 */
export const DarkMode: Story = {
  name: 'Dark mode',
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Dark token set via `:root.dark`. ' +
          'Pill inverts to white background with black text; selected item uses black background with white text.',
      },
    },
  },
  decorators: [withDarkMode],
};

/**
 * Dark mode disabled — verify opacity works correctly on dark background.
 */
export const DarkModeDisabled: Story = {
  name: 'Dark mode · Disabled',
  parameters: { backgrounds: { default: 'dark' } },
  decorators: [withDarkMode],
  args: { disabled: true },
};

// ─── all variants at a glance ─────────────────────────────────────────────────

/**
 * All variants — light + dark, default + disabled, stacked for visual regression.
 */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'All states rendered in sequence. Use for visual regression testing.',
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            minHeight: '100vh',
          }}
        >
          {/* ── Light rows ── */}
          {[
            { label: 'Light · Default (Officeworks active)', clientName: 'Officeworks', activeSlug: 'officeworks',    disabled: false },
            { label: 'Light · Short client name (Levo)',     clientName: 'Levo',        activeSlug: 'levo',           disabled: false },
            { label: 'Light · Long client name',             clientName: 'Taronga Conservation Society', activeSlug: 'taronga-zoo', disabled: false },
            { label: 'Light · Disabled',                     clientName: 'Officeworks', activeSlug: 'officeworks',    disabled: true  },
          ].map(({ label, clientName, activeSlug, disabled }) => (
            <div
              key={label}
              style={{
                position: 'relative',
                height: 120,
                background: '#f0f0f0',
                paddingTop: 32,
              }}
            >
              <p
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 32,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-xs-size)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {label}
              </p>
              <ProjectNav
                clientName={clientName}
                activeSlug={activeSlug}
                nextHref="/work/taronga-zoo"
                nextBgColor="#1a3d2b"
                allProjects={ALL_PROJECTS}
                disabled={disabled}
              />
            </div>
          ))}

          {/* ── Dark rows ── */}
          {[
            { label: 'Dark · Default (Officeworks active)', clientName: 'Officeworks', activeSlug: 'officeworks', disabled: false },
            { label: 'Dark · Disabled',                     clientName: 'Officeworks', activeSlug: 'officeworks', disabled: true  },
          ].map(({ label, clientName, activeSlug, disabled }) => (
            <DarkRow key={label} label={label} clientName={clientName} activeSlug={activeSlug} disabled={disabled} />
          ))}
        </div>
      );
    },
  ],
  render: () => <></>,
};

// ─── internal helper (AllVariants only) ───────────────────────────────────────

function DarkRow({
  label,
  clientName,
  activeSlug,
  disabled,
}: {
  label: string;
  clientName: string;
  activeSlug: string;
  disabled: boolean;
}) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: 120,
        background: '#111111',
        paddingTop: 32,
      }}
    >
      <p
        style={{
          position: 'absolute',
          top: 8,
          left: 32,
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xs-size)',
          color: '#888',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </p>
      <ProjectNav
        clientName={clientName}
        activeSlug={activeSlug}
        nextHref="/work/taronga-zoo"
        nextBgColor="#1a3d2b"
        allProjects={ALL_PROJECTS}
        disabled={disabled}
      />
    </div>
  );
}
