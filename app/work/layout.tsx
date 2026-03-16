import { WorkTransition } from '@/components/ui/WorkTransition';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <WorkTransition>{children}</WorkTransition>;
}
