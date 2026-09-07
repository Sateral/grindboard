import type { ReactNode } from "react";

/**
 * Quiet top bar shared by the signed-in pages (board, settings): wordmark on
 * the left, page-specific actions on the right.
 */
export function AppHeader({
  wordmarkHref = "/",
  children,
}: {
  wordmarkHref?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex h-24 shrink-0 items-center justify-between">
      <a
        href={wordmarkHref}
        className="font-mono text-[13px] font-medium tracking-tight text-foreground"
      >
        Grindboard
      </a>
      <nav className="flex items-center gap-6 text-[13px]">{children}</nav>
    </header>
  );
}
