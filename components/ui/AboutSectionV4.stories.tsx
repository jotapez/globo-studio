import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { AboutSectionV4 } from './AboutSectionV4';

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

const meta: Meta<typeof AboutSectionV4> = {
  title: 'UI/AboutSectionV4',
  component: AboutSectionV4,
  tags: ['autodocs'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`#about\` section variant — a full-width organic \`LiquidMetal\` shader blob above a centered bio column. No portrait photo, no multi-sphere convergence animation.

**Shader**
\`LiquidMetal\` with \`shape="none"\` fills a 964:584 aspect-ratio container organically.
\`colorBack\` is transparent so the metallic effect floats on the page background.
The shader is ambient (always animating) — not scroll or entry triggered.

**Reduced motion**
\`speed={0}\` freezes the shader at a fixed frame. No CSS animation runs.

**Theming**
Uses \`--bg-page\`, \`--text-primary\` tokens. Designed for dark mode.
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
type Story = StoryObj<typeof AboutSectionV4>;

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
