import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
import './globals.css';

/**
 * Bricolage Grotesque — editorial variable grotesque, self-hosted via next/font.
 * Weights 300 (Light) + 400 (Regular) + 500 (Medium) cover all type-scale uses:
 *   Light   → clock labels
 *   Regular → body copy, small, labels, labels-sm
 *   Medium  → display (H1/H2), intro
 * The CSS variable name matches tokens.css: --font-sans.
 */
const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

/**
 * Instrument Serif — loaded via next/font so it's self-hosted at build time
 * (zero layout shift, subset to Latin, italic included for mixed-type headings).
 * The CSS variable name matches tokens.css: --font-serif.
 */
const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  title: 'Globo | Juan Pablo Castro | Designer',
  description:
    'Design studio orchestrated by Juan Pablo Castro — where strategy and craft move at the speed of AI.',
  openGraph: {
    title: 'Globo Studio',
    description:
      'Design studio orchestrated by Juan Pablo Castro — where strategy and craft move at the speed of AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolageGrotesque.variable} ${instrumentSerif.variable} antialiased`}>
        {/*
         * Blocking theme script — runs synchronously before first paint so the
         * browser never renders the wrong colour scheme. This is one of the few
         * legitimate uses of dangerouslySetInnerHTML: the content is static,
         * contains no user input, and must execute before React hydrates.
         */}
        {/* Skip-to-content — visually hidden until focused; gives keyboard users a
            direct path past the fixed nav to the main content area. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[var(--radius-pill)] focus:bg-[#f8f8f7] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black focus:shadow-lg"
        >
          Skip to main content
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gs-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);var p=window.location.pathname.indexOf('/work/')===0;if(d&&!p)document.documentElement.classList.add('dark');var c=(d&&!p)?'#000000':'#f8f8f7';var metas=document.querySelectorAll('meta[name="theme-color"]');metas.forEach(function(m){m.setAttribute('content',c)});}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
