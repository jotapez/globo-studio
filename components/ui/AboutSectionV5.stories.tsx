import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { AboutSectionV5 } from './AboutSectionV5';

// ─── decorators ───────────────────────────────────────────────────────────────

const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return <Story />;
};

const withReducedMotion: Decorator = (Story) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'reduced-motion-override';
    style.textContent = `*, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }`;
    document.head.appendChild(style);
    const original = window.matchMedia;
    window.matchMedia = (query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return { matches: true, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true } as MediaQueryList;
      }
      return original(query);
    };
    return () => {
      style.remove();
      window.matchMedia = original;
    };
  }, []);
  return <Story />;
};

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof AboutSectionV5> = {
  title: 'UI/AboutSectionV5',
  component: AboutSectionV5,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`#about\` section variant — \`LiquidMetal\` with \`shape="metaballs"\` above a centered bio column.

Same layout as V4 but uses the exact shader params exported from Paper on 2026-03-27:
\`frame={7269152.2}\`, \`shape="metaballs"\`. The metaballs shape produces multiple
organic blobs that merge and separate as the shader animates.

**Reduced motion**
\`speed={0}\` freezes the shader at the fixed frame.
        `,
      },
    },
    backgrounds: {
      default: 'black',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'black', value: '#000000' },
      ],
    },
  },

  argTypes: {
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof AboutSectionV5>;

// ─── stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default · Light',
  parameters: {
    backgrounds: { default: 'white' },
  },
};

export const DarkMode: Story = {
  name: 'Dark mode',
  parameters: {
    backgrounds: { default: 'black' },
  },
  decorators: [withDarkMode],
};

export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'black' },
  },
  decorators: [withDarkMode],
};

export const ReducedMotion: Story = {
  name: 'Reduced motion',
  parameters: {
    backgrounds: { default: 'black' },
  },
  decorators: [withDarkMode, withReducedMotion],
};
