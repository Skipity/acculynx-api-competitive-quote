import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

const LINKS = [
  { to: "/docs", label: "Product brief" },
  { to: "/docs/api", label: "API contract" },
  { to: "/docs/backlog", label: "API team backlog" },
] as const;

function DocsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">
            For AccuLynx readers
          </p>
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm",
                  pathname === l.to ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <article className="max-w-3xl font-sans text-[15px] leading-relaxed text-ink [&_a]:text-accent [&_a]:underline [&_code]:font-mono [&_code]:text-[13px] [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h3]:mt-5 [&_h3]:text-sm [&_h3]:font-medium [&_li]:my-1 [&_p]:mt-3 [&_p]:text-pretty [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
          <Outlet />
        </article>
      </div>
    </AppShell>
  );
}
