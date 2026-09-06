import { f as useRouterState, h as Outlet, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as AppShell } from "./app-shell-Cl2qqXg6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-BHGHRKod.js
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/docs",
		label: "Product brief"
	},
	{
		to: "/docs/api",
		label: "API contract"
	},
	{
		to: "/docs/backlog",
		label: "API team backlog"
	}
];
function DocsLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[200px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "lg:sticky lg:top-6 lg:self-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium uppercase tracking-wider text-subtle",
				children: "For AccuLynx readers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col gap-1",
				children: LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					className: cn("rounded-sm px-3 py-2 text-sm", pathname === l.to ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"),
					children: l.label
				}, l.to))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			className: "max-w-3xl font-sans text-[15px] leading-relaxed text-ink [&_a]:text-accent [&_a]:underline [&_code]:font-mono [&_code]:text-[13px] [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h3]:mt-5 [&_h3]:text-sm [&_h3]:font-medium [&_li]:my-1 [&_p]:mt-3 [&_p]:text-pretty [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	}) });
}
//#endregion
export { DocsLayout as component };
