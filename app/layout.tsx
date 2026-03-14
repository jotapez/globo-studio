import type { Metadata, Viewport } from 'next';
import { Instrument_Serif } from 'next/font/google';
import './globals.css';

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

export const viewport: Viewport = { viewportFit: 'cover' };

export const metadata: Metadata = {
  title: 'Globo Studio — Juan Pablo Castro, Senior Product Designer',
  description:
    'Portfolio of Juan Pablo Castro, Senior Product Designer specialising in human-centred experiences and scalable design systems. Based in Sydney, Australia.',
  openGraph: {
    title: 'Globo Studio — Juan Pablo Castro',
    description:
      'Senior Product Designer crafting human-centred experiences and scalable design systems globally.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} antialiased`}>
        {/*
         * Blocking theme script — runs synchronously before first paint so the
         * browser never renders the wrong colour scheme. This is one of the few
         * legitimate uses of dangerouslySetInnerHTML: the content is static,
         * contains no user input, and must execute before React hydrates.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gs-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
