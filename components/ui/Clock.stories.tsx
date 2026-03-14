import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { Clock } from './Clock';

// ─── clock data ───────────────────────────────────────────────────────────────

const CLOCKS = [
  { timezone: 'Australia/Sydney',  city: 'Sydney, Australia'      },
  { timezone: 'America/Santiago',  city: 'Rancagua, Chile'        },
  { timezone: 'Asia/Manila',       city: 'Siargao, Philippines'   },
  { timezone: 'Asia/Tokyo',        city: 'Tokyo, Japan'           },
] as const;

// ─── decorators ───────────────────────────────────────────────────────────────

const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Clock> = {
  title: 'UI/Clock',
  component: Clock,
  tags: ['autodocs'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Real-time analogue clock showing the current time in a given timezone.

**Figma:** [clock (809:42708)](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=809-42708)

Used in the Contact section — 4 clocks in a row on desktop/tablet, 2×2 grid on mobile.

**Face** — minimal SVG: circular border + hour and minute hands. No numerals or tick marks.

**Timezones used in production**
| Clock | City | IANA key |
|---|---|---|
| 1 | Sydney, Australia | \`Australia/Sydney\` |
| 2 | Rancagua, Chile | \`America/Santiago\` |
| 3 | Siargao, Philippines | \`Asia/Manila\` |
| 4 | Tokyo, Japan | \`Asia/Tokyo\` |

**Theme prop**
| Value | Effect |
|---|---|
| \`auto\` (default) | Follows the CSS token cascade — adapts to page light/dark mode |
| \`light\` | Forces black strokes via \`--color-black\` token |
| \`dark\` | Forces white strokes via \`--color-white\` token |

**Accessibility** — \`role="img"\` with \`aria-label="[city]: [HH:MM]"\` updated every second.
        `,
      },
    },
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white',      value: '#ffffff' },
        { name: 'light-gray', value: '#f5f5f5' },
        { name: 'dark',       value: '#171717' },
      ],
    },
  },

  argTypes: {
    timezone: { control: 'text' },
    city:     { control: 'text' },
    theme: {
      control: 'select',
      options: ['auto', 'light', 'dark'],
      table: { defaultValue: { summary: 'auto' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Clock>;

// ─── single clock ─────────────────────────────────────────────────────────────

/**
 * Default — single Sydney clock, auto theme.
 * Hands update in real-time. Switch the Controls panel to test other timezones.
 */
export const Default: Story = {
  name: 'Default · Sydney',
  decorators: [
    (Story) => (
      <div style={{ width: 392 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    timezone: 'Australia/Sydney',
    city:     'Sydney, Australia',
    theme:    'auto',
  },
};

// ─── responsive grid ──────────────────────────────────────────────────────────

/**
 * Responsive — the production Contact-section layout.
 *
 * Resize the canvas to see the behaviour at each breakpoint:
 *   Mobile  (<768 px)  2 columns, Sydney + Rancagua only
 *   Tablet  (≥768 px)  4 columns, all four clocks
 *   Desktop (≥768 px)  4 columns, all four clocks
 *
 * Siargao and Tokyo are hidden on mobile via `hidden md:block` wrapper divs
 * so they don't shift the layout or consume grid space.
 */
export const Responsive: Story = {
  name: 'Responsive · All breakpoints',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Resize the Storybook canvas to verify the responsive behaviour. ' +
          'Below `md` (768 px) only Sydney and Rancagua are shown. ' +
          'At `md` and above all four clocks appear in a single row.',
      },
    },
  },
  decorators: [
    () => (
      <div
        className={[
          'grid grid-cols-2 md:grid-cols-4',
          'gap-[var(--card-gap)]',
          'px-[var(--page-padding-mobile)] md:px-[var(--page-padding-desktop)]',
          'py-8',
        ].join(' ')}
      >
        {/* ── always visible ── */}
        <Clock timezone="Australia/Sydney" city="Sydney, Australia" />
        <Clock timezone="America/Santiago" city="Rancagua, Chile" />

        {/* ── tablet / desktop only ── */}
        <div className="hidden md:block">
          <Clock timezone="Asia/Manila" city="Siargao, Philippines" />
        </div>
        <div className="hidden md:block">
          <Clock timezone="Asia/Tokyo" city="Tokyo, Japan" />
        </div>
      </div>
    ),
  ],
  render: () => <></>,
};

// ─── theme: forced light ──────────────────────────────────────────────────────

/**
 * Light theme — forced via `theme="light"`. Useful when rendering the clock
 * on a dark-page section that hasn't applied :root.dark.
 */
export const ThemeLight: Story = {
  name: 'Theme · Light (forced)',
  decorators: [
    (Story) => (
      <div style={{ width: 392 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    timezone: 'Asia/Tokyo',
    city:     'Tokyo, Japan',
    theme:    'light',
  },
};

// ─── theme: forced dark ───────────────────────────────────────────────────────

/**
 * Dark theme — forced via `theme="dark"`. White strokes on a dark background.
 */
export const ThemeDark: Story = {
  name: 'Theme · Dark (forced)',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 392 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    timezone: 'Asia/Manila',
    city:     'Siargao, Philippines',
    theme:    'dark',
  },
};

// ─── dark mode (token cascade) ────────────────────────────────────────────────

/**
 * Dark mode — applies `:root.dark` token overrides, same responsive layout.
 * Switch background to "dark" for the full effect.
 */
export const DarkModeResponsive: Story = {
  name: 'Dark mode · Responsive',
  parameters: {
    backgrounds: { default: 'dark' },
    layout: 'fullscreen',
  },
  decorators: [
    withDarkMode,
    () => (
      <div
        className={[
          'grid grid-cols-2 md:grid-cols-4',
          'gap-[var(--card-gap)]',
          'px-[var(--page-padding-mobile)] md:px-[var(--page-padding-desktop)]',
          'py-8',
        ].join(' ')}
      >
        <Clock timezone="Australia/Sydney" city="Sydney, Australia" />
        <Clock timezone="America/Santiago" city="Rancagua, Chile" />
        <div className="hidden md:block">
          <Clock timezone="Asia/Manila" city="Siargao, Philippines" />
        </div>
        <div className="hidden md:block">
          <Clock timezone="Asia/Tokyo" city="Tokyo, Japan" />
        </div>
      </div>
    ),
  ],
  render: () => <></>,
};
