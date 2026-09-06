import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs.backlog-BnjU83md.js
var import_jsx_runtime = require_jsx_runtime();
function Backlog() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-wider text-subtle",
			children: "After a day in the public docs"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Five items I would put on the API team backlog" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Written as a Technical Product Owner, not a feature wishlist. Each is something partners and agents hit while integrating the way this sample does." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "1. Custom fields as an agent primitive" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Value PUT exists; definition create does not from the partner API. An agent that needs ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "Comp Motion" }),
			" cannot self-provision. Acceptance: documented field contract + either a partner-safe “ensure fields” flow or a first-run checklist in the developer portal. Notes must not be the recommended dump."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "2. Pagination naming" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "recordStartIndex" }),
			" vs ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "pageStartIndex" }),
			" vs",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "pageIndex" }),
			" across resources. Agents and generated clients break. Acceptance: one pair of names in V2, aliases deprecated in docs."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "3. Key lifecycle is DX" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Per-location Bearer keys with full blast radius. Support will not teach the API. Acceptance: named keys, last-used, scope hint (read vs write) on the roadmap, rotation without downtime. “Paste god-key into a chatbot” is an anti-pattern the docs should name." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "4. Webhook listener contract as a product page" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "10s timeout, disable on errors, duplicates expected. Acceptance: a single “how not to get disabled” page with the test-event endpoint, idempotency key, and example 2xx-then-queue. Treat this like Stripe’s webhook guide." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "5. Agent-safe verbs, not raw HTTP" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"As customers connect agents, the useful product is a small set of tools with preconditions (",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "set_job_custom_field" }),
			", ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "append_job_note" }),
			") rather than OpenAPI dumped into a prompt. Permissions, business context, and reliable actions — the job posting’s words — become the backlog, not a side experiment."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Out of scope for this sample" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "OAuth (customer Advanced API is still API keys), Create Job, milestone writes, document upload of the PDF, email send, multi-location key orchestration. Those are the next sprint if a contractor actually runs this in the office." })
	] });
}
//#endregion
export { Backlog as component };
