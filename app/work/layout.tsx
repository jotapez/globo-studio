import { WorkTransition } from '@/components/ui/WorkTransition';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
       * Blocking script — forces light mode before first paint on all /work/* pages.
       * Runs synchronously at layout level, earlier than React hydration, to prevent
       * any dark-mode flash when the user refreshes a project page while dark mode
       * is active on the homepage.
       */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var h=document.documentElement;h.classList.add('no-theme-transition');h.classList.remove('dark');requestAnimationFrame(function(){h.classList.remove('no-theme-transition');});})();`,
        }}
      />
      <a
        href="#project-heading"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to content
      </a>
      <WorkTransition>{children}</WorkTransition>
    </>
  );
}
