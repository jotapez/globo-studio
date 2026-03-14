import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--bg-page)] text-[var(--text-primary)] px-6">
      <h1 className="font-serif text-[64px] leading-[84px]">404</h1>
      <p className="font-sans text-[20px] leading-[28px] text-[var(--text-muted)]">
        This project doesn&apos;t exist (yet).
      </p>
      <Link
        href="/"
        className="font-sans text-[16px] leading-[24px] underline underline-offset-4 hover:opacity-60 transition-opacity"
      >
        Back to home
      </Link>
    </div>
  );
}
