import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Nav, type NavSection } from './Nav';

// NavSection is still exported for homepage-level typing; string is used
// internally now that Nav supports both home and project variants.

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Adds `class="dark"` to <html> for the duration of the story so that
 * the :root.dark token overrides in tokens.css activate.
 */
const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Nav> = {
  title: 'UI/Nav',
  component: Nav,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Pill-shaped navigation bar — fixed at the top of the viewport.

**Figma:** [home-nav-desktop (999:45514)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=999-45514) · [home-nav-mobile (999:45433)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=999-45433)

**Active pill** slides via \`AnimatedBackground\` (internal \`layoutId="animated-background"\`) with a spring transition (stiffness 380 / damping 30).

**Hover pill** uses \`layoutId="nav-hover-pill"\` on inactive items — spring-slides as the cursor moves between them. Suppressed on touch devices and when \`prefers-reduced-motion\` is on.

**Breakpoints**
| | Desktop | Mobile |
|---|---|---|
| Height | 54 px | 48 px |
| Font | Label 16/24 | Label-Small 14/18 |
| Top offset | 32 px | 20 px |
| Side padding | 32 px | 20 px |
        `,
      },
    },
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'light-gray', value: '#f0f0f0' },
        { name: 'white',      value: '#ffffff' },
        { name: 'dark',       value: '#111111' },
      ],
    },
  },

  argTypes: {
    activeSection: {
      control: 'select',
      options: ['hero', 'work', 'about', 'contact'],
      description: 'Which nav item is currently active.',
      table: { defaultValue: { summary: 'hero' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all items (use during loading or page transitions).',
      table: { defaultValue: { summary: 'false' } },
    },
    onItemClick: { action: 'itemClicked' },
  },

  /** Wrapper that gives the fixed nav room to breathe in the canvas */
  decorators: [
    (Story) => (
      <div style={{ height: '200px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Nav>;

// ─── active states ────────────────────────────────────────────────────────────

/** Default state — "Globo" active (hero section) */
export const GloboActive: Story = {
  name: 'Active · Globo',
  args: { activeSection: 'hero' },
};

/** "Work" section active */
export const WorkActive: Story = {
  name: 'Active · Work',
  args: { activeSection: 'work' },
};

/** "About" section active */
export const AboutActive: Story = {
  name: 'Active · About',
  args: { activeSection: 'about' },
};

/** "Contact" section active */
export const ContactActive: Story = {
  name: 'Active · Contact',
  args: { activeSection: 'contact' },
};

// ─── special states ───────────────────────────────────────────────────────────

/**
 * Disabled — all items are non-interactive.
 * Used during page transitions or while the loading screen is active.
 */
export const Disabled: Story = {
  name: 'State · Disabled',
  args: { activeSection: 'hero', disabled: true },
};

// ─── interactive ──────────────────────────────────────────────────────────────

/**
 * Interactive — click items to see the pill animate between positions.
 * This mirrors real in-page behaviour driven by IntersectionObserver.
 */
export const Interactive: Story = {
  name: 'Interactive (animated)',
  parameters: {
    docs: {
      description: {
        story:
          'Click any item to watch the active pill slide using Framer Motion `layoutId`. Hover an inactive item to see the subtle hover fill.',
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [active, setActive] = useState('hero');
    return (
      <div style={{ height: '200px' }}>
        <Nav activeSection={active} onItemClick={setActive} />
        <p
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm-size)',
            color: 'var(--text-secondary)',
          }}
        >
          Active section: <strong>{active}</strong>
        </p>
      </div>
    );
  },
};

// ─── dark mode ────────────────────────────────────────────────────────────────

/**
 * Dark mode — applies :root.dark to activate the dark token set.
 * Switch the Storybook background to "dark" to see the full effect.
 */
export const DarkMode: Story = {
  name: 'Dark mode · Globo active',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [withDarkMode],
  args: { activeSection: 'hero' },
};

/** Dark mode — interactive, click to animate the pill. */
export const DarkModeInteractive: Story = {
  name: 'Dark mode · Interactive',
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Dark token set active via `:root.dark`. Nav inverts to a solid dark background with white text; the active pill uses the dark selected token.',
      },
    },
  },
  decorators: [withDarkMode],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [active, setActive] = useState('hero');
    return (
      <div style={{ height: '200px' }}>
        <Nav activeSection={active} onItemClick={setActive} />
        <p
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm-size)',
            color: 'var(--text-secondary)',
          }}
        >
          Active section: <strong>{active}</strong>
        </p>
      </div>
    );
  },
};

// ─── project variant ──────────────────────────────────────────────────────────

/**
 * Project variant — three items with the client name always active.
 * Exercises the variant="project" prop and items override directly on Nav,
 * independent of the ProjectNav wrapper.
 */
export const ProjectVariant: Story = {
  name: 'Variant · Project',
  args: {
    variant: 'project',
    activeSection: 'client',
    items: [
      { id: 'home',   label: 'Globo',        href: '/'                 },
      { id: 'client', label: 'Officeworks',  href: ''                  },
      { id: 'next',   label: 'Next project', href: '/work/kicbox' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Three-item variant used on project pages. The client name pill is always active; ' +
          '"Globo" and "Next project" are navigable links. ' +
          'On mobile, outer items shrink to content width; the center item fills remaining space.',
      },
    },
  },
};

// ─── hover pill ───────────────────────────────────────────────────────────────

/**
 * Hover pill — move the cursor between "Work", "About", and "Contact" to see
 * the spring-animated pill slide. The active item ("Globo") shows no hover
 * pill. Click items to verify the active pill takes over cleanly.
 */
export const HoverPill: Story = {
  name: 'Hover pill (animated)',
  parameters: {
    docs: {
      description: {
        story:
          'Hover inactive items to see `layoutId="nav-hover-pill"` spring-slide between them. ' +
          'Pill is suppressed on the active item and on touch/stylus devices (`hover: hover` media query).',
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [active, setActive] = useState('hero');
    return (
      <div style={{ height: '200px' }}>
        <Nav activeSection={active} onItemClick={setActive} />
      </div>
    );
  },
};

// ─── cursor-active variation ──────────────────────────────────────────────────

/**
 * Active follows cursor — experimental interaction where the selected pill
 * chases the cursor across items. Springs back to the true active on mouse leave.
 * Click to commit. Enabled via the `cursorActive` prop on Nav.
 */
export const ActiveFollowsCursor: Story = {
  name: 'Variation · Active follows cursor',
  parameters: {
    docs: {
      description: {
        story:
          'Experimental: the active pill (bg-nav-selected) slides to whichever item ' +
          'the cursor is over, then springs back to the true active on mouse leave. ' +
          'Click to commit the active state. Uses `cursorActive` prop.',
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [active, setActive] = useState('hero');
    return (
      <div style={{ height: '200px' }}>
        <Nav activeSection={active} onItemClick={setActive} cursorActive />
        <p
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm-size)',
            color: 'var(--text-secondary)',
          }}
        >
          Active section: <strong>{active}</strong>
        </p>
      </div>
    );
  },
};

// ─── mobile viewport ──────────────────────────────────────────────────────────

/**
 * Mobile viewport — verifies the 3-item project variant layout, 14px label
 * size, and 48px nav height at narrow widths. Use the Storybook viewport
 * toolbar to toggle between breakpoints.
 */
export const MobileViewport: Story = {
  name: 'Mobile viewport · Home',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Rendered at mobile width. Checks: 48 px height, Label-Small 14/18, 20 px side padding, ' +
          '`--nav-top-mobile` top offset (tracks `env(safe-area-inset-top)`).',
      },
    },
  },
  args: { activeSection: 'hero' },
};

export const MobileViewportProject: Story = {
  name: 'Mobile viewport · Project variant',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Three-item layout at mobile width. First and last items shrink to content width; ' +
          'the centre item fills remaining space.',
      },
    },
  },
  args: {
    variant: 'project',
    activeSection: 'client',
    items: [
      { id: 'home',   label: 'Globo',        href: '/'                 },
      { id: 'client', label: 'Officeworks',  href: ''                  },
      { id: 'next',   label: 'Next project', href: '/work/kicbox' },
    ],
  },
};

// ─── entrance / exit animations ───────────────────────────────────────────────

/**
 * Entrance animation — the nav slides down from above on mount.
 * Remount the story (use the ↺ button) to replay the spring animation.
 */
export const EntranceAnimation: Story = {
  name: 'Animation · Entrance (slide-down)',
  parameters: {
    docs: {
      description: {
        story:
          'Nav slides down from `y: -100` on mount. ' +
          'Default `entranceDelay` is 0.1 s; spring stiffness 300 / damping 28. ' +
          'Remount the story to replay.',
      },
    },
  },
  args: { activeSection: 'hero', animateEntrance: true },
};

/**
 * Exit animation — pass `isExiting={true}` to watch the nav slide back up.
 * In production this is triggered by the project-page transition context.
 */
export const ExitAnimation: Story = {
  name: 'Animation · Exit (slide-up)',
  parameters: {
    docs: {
      description: {
        story:
          'When `isExiting` is `true` the nav animates to `y: -100` with `duration: 0` ' +
          '(instant, so the page-slide transition dominates). Toggle the control to preview.',
      },
    },
  },
  args: { activeSection: 'hero', isExiting: true },
};

/**
 * No entrance animation — used when the nav should appear immediately
 * (e.g. project→project navigation where the layout stays mounted).
 */
export const NoEntrance: Story = {
  name: 'Animation · No entrance',
  parameters: {
    docs: {
      description: {
        story: '`animateEntrance={false}` — nav is visible immediately with no slide-in.',
      },
    },
  },
  args: { activeSection: 'hero', animateEntrance: false },
};

// ─── all variants at a glance ─────────────────────────────────────────────────

/**
 * All four active-state variants stacked — useful for visual regression.
 */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'All four active-section states rendered in sequence for visual regression testing.',
      },
    },
  },
  decorators: [
    () => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 80,
          padding: '32px 0 32px',
          background: '#f0f0f0',
          minHeight: '100vh',
        }}
      >
        {(['hero', 'work', 'about', 'contact'] as const).map((section) => (
          <div key={section} style={{ position: 'relative', height: 80 }}>
            <p
              style={{
                position: 'absolute',
                top: -20,
                left: 32,
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs-size)',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              active: {section}
            </p>
            <Nav activeSection={section} />
          </div>
        ))}
        <div style={{ position: 'relative', height: 80 }}>
          <p
            style={{
              position: 'absolute',
              top: -20,
              left: 32,
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs-size)',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            disabled
          </p>
          <Nav activeSection="hero" disabled />
        </div>
      </div>
    ),
  ],
  render: () => <></>,
};
