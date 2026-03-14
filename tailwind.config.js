/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {

      /* -------------------------------------------------------
         Font Families
         ------------------------------------------------------- */
      fontFamily: {
        sans:  ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },

      /* -------------------------------------------------------
         Colors
         All semantic tokens — reference CSS vars from tokens.css

         Usage:
           bg-page            → background: var(--bg-page)
           text-primary       → color: var(--text-primary)
           bg-nav             → background: var(--bg-nav)
         ------------------------------------------------------- */
      colors: {
        /* Text */
        primary:              'var(--text-primary)',
        secondary:            'var(--text-secondary)',
        muted:                'var(--text-muted)',
        'nav-item':           'var(--text-nav-item)',
        'nav-item-selected':  'var(--text-nav-item-selected)',

        /* Backgrounds */
        page:                 'var(--bg-page)',
        'nav-bg':             'var(--bg-nav)',
        'nav-selected':       'var(--bg-nav-selected)',
        'clock-face':         'var(--bg-clock-face)',

        /* Base palette (for one-off use) */
        'gs-black':           'var(--color-black)',
        'gs-white':           'var(--color-white)',
        'gs-gray-100':        'var(--color-gray-100)',
        'gs-gray-200':        'var(--color-gray-200)',
        'gs-gray-300':        'var(--color-gray-300)',
        'gs-gray-900':        'var(--color-gray-900)',
      },

      /* -------------------------------------------------------
         Border Radius
         ------------------------------------------------------- */
      borderRadius: {
        pill:          'var(--radius-pill)',
        card:          'var(--radius-card)',
        'card-circle': 'var(--radius-card-circle)',
      },

      /* -------------------------------------------------------
         Box Shadow
         ------------------------------------------------------- */
      boxShadow: {
        nav: 'var(--shadow-nav)',
      },

      /* -------------------------------------------------------
         Border Color
         ------------------------------------------------------- */
      borderColor: {
        'default-light': 'var(--border-default-light)',
        default:         'var(--border-default)',
      },

      /* -------------------------------------------------------
         Max Width — content containers
         ------------------------------------------------------- */
      maxWidth: {
        desktop: 'var(--content-width-desktop)',
        tablet:  'var(--content-width-tablet)',
        mobile:  'var(--content-width-mobile)',
      },

      /* -------------------------------------------------------
         Height — named component heights
         ------------------------------------------------------- */
      height: {
        'nav-desktop': 'var(--nav-height-desktop)',
        'nav-mobile':  'var(--nav-height-mobile)',
        carousel:        'var(--carousel-height)',
        'carousel-mobile': 'var(--carousel-height-mobile)',
      },

      /* -------------------------------------------------------
         Top — nav vertical offset
         ------------------------------------------------------- */
      top: {
        'nav-desktop': 'var(--nav-top-desktop)',
        'nav-mobile':  'var(--nav-top-mobile)',
      },

    },
  },
};
