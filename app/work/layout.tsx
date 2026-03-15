import { WorkTransition } from '@/components/ui/WorkTransition';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
