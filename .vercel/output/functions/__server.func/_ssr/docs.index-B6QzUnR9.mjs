import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs.index-B6QzUnR9.js
var import_jsx_runtime = require_jsx_runtime();
function ProductBrief() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-wider text-subtle",
			children: "Technical Product Owner sample"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Competitive quote ingest is a product, not a prompt" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A roofing office already lives in AccuLynx. A homeowner forwards “the other guy’s number.” Today that PDF dies in email or a job note — the graveyard of CRM data. This sample treats the AccuLynx job as the system of record: unstructured quote in, typed custom fields out, human confirm before any write." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "I am not an estimator and this is not an estimating engine. The agent extracts a small, inspectable contract. Code — not the model — chooses the motion when the document is thin or unreadable. Notes are a receipt. Fields are what sales can filter next quarter." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Why this workflow" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"It is category-native (exterior / roofing), uses the public V2 surface a partner actually gets (Bearer API key per location, jobs, custom field definitions, PUT job custom fields), and matches the job posting’s agent section: retrieve, decide, complete work ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "within boundaries" }),
			"."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "REST, JSON, Bearer auth, pagination, 401 vs 429, RateLimit headers" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Custom fields as the structured write; 500-character Text limit respected" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Confirm-gated mutation; dry-run is the default" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Session-only keys — never in the repo, never logged" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mock path so a Director can click without a tenant" })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "What the agent is allowed to do" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Three verbs, not the OpenAPI spec pasted into a prompt:" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "extract_quote" }), " — Gemini 3.7 Flash, structured JSON, PDF inline"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "map_fields" }),
				" — match labels on",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "GET /company-settings/custom-fields?filter=jobs" })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "put_job_custom_fields" }),
				" —",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [
					"PUT /jobs/",
					"{jobId}",
					"/custom-fields"
				] }),
				" after confirm"
			] })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "It cannot change milestones, owners, approved value, or create jobs. If the tenant does not have the seven field definitions, the UI shows a setup checklist instead of failing a 400 in production silence." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Auth, on purpose" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "AccuLynx customer API keys are admin-minted, per location, and equivalent to a password for that book of business. This demo collects the key in the page so a contractor can test — and says in the same panel: do not ship this form to the public internet. A partner product would use a named key per integration, rotation, and a server-side secret store. The Bearer token never goes to Gemini; only the PDF does." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "What I would file on the API team" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "See the backlog page. Short version: pagination naming is inconsistent, custom field DX is the agent platform, notes are a poor integration primitive, and webhook disable-on-noise belongs in partner docs as a first-class contract." })
	] });
}
//#endregion
export { ProductBrief as component };
