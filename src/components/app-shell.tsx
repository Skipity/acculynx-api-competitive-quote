import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Ingest" },
  { to: "/docs", label: "Product brief" },
  { to: "/docs/api", label: "API contract" },
  { to: "/docs/backlog", label: "Backlog" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-ink">
            <span className="flex size-9 items-center justify-center rounded-sm bg-accent text-accent-fg">
              <FileSpreadsheet className="size-4" strokeWidth={1.75} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-medium tracking-tight">
                Quote Ingest
              </span>
              <span className="block text-[11px] text-muted">
                Working with AccuLynx API — competitor quote
              </span>
            </span>
          </Link>
          <nav className="ml-auto flex flex-wrap gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm",
                    active ? "bg-accent-soft text-accent" : "text-muted hover:bg-bg-warm hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
