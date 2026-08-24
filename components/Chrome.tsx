import Link from "next/link";

export function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-canvas px-6 pb-24 pt-10 sm:px-10">{children}</main>;
}

export function TopBar() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Mark />
        <span className="text-[15px] font-semibold tracking-tight">Same Tag</span>
      </Link>
      <Link href="/architecture" className="text-[13px] text-ink-mid transition hover:text-accent">
        How it works
      </Link>
    </header>
  );
}

export function Foot({ note }: { note: React.ReactNode }) {
  return (
    <footer className="rule mt-20 border-t pt-8 text-[12.5px] leading-relaxed text-ink-dim">
      <p className="max-w-2xl">{note}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a className="inline-flex items-center gap-1.5 transition hover:text-accent" href="https://theomthakur.github.io/portfolio"><PortfolioIcon />Portfolio</a>
        <a className="inline-flex items-center gap-1.5 transition hover:text-accent" href="https://github.com/theomthakur"><GithubIcon />GitHub</a>
        <a className="inline-flex items-center gap-1.5 transition hover:text-accent" href="https://www.linkedin.com/in/theomthakur/"><LinkedinIcon />LinkedIn</a>
        <Link className="inline-flex items-center gap-1.5 transition hover:text-accent" href="/architecture"><ArchIcon />How it works</Link>
      </div>
    </footer>
  );
}

export function Sect({ n, t }: { n: string; t: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[11px] text-accent">{n}</span>
      <h2 className="text-[15px] font-semibold tracking-tight">{t}</h2>
    </div>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[11px] text-ink/80">{children}</code>;
}

export function Mark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 8h9a4 4 0 010 8H5" stroke="#FB651E" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 4h9a4 4 0 010 8H9" stroke="#E8EAF0" strokeWidth="1.7" strokeLinecap="round" opacity="0.28" />
    </svg>
  );
}

export function GithubIcon({ className = "h-[15px] w-[15px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function LinkedinIcon({ className = "h-[15px] w-[15px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M3.6 5.4H.9V15h2.7V5.4zM2.25 1a1.57 1.57 0 100 3.14 1.57 1.57 0 000-3.14zM15 9.5c0-2.53-1.35-3.7-3.15-3.7-1.45 0-2.1.8-2.46 1.36V5.4H6.7c.04.76 0 9.6 0 9.6h2.69V9.64c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V15H15V9.5z" />
    </svg>
  );
}

export function PortfolioIcon({ className = "h-[15px] w-[15px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
      <circle cx="8" cy="8" r="6.6" />
      <path d="M1.5 8h13M8 1.4c1.9 2 2.9 4.2 2.9 6.6S9.9 12.6 8 14.6C6.1 12.6 5.1 10.4 5.1 8S6.1 3.4 8 1.4z" />
    </svg>
  );
}

export function ArchIcon({ className = "h-[15px] w-[15px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
      <rect x="1.6" y="2.2" width="12.8" height="11.6" rx="2" />
      <path d="M1.6 6.1h12.8M6 6.1v7.7" />
    </svg>
  );
}
