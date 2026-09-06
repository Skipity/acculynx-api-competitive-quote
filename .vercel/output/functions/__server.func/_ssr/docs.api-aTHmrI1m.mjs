import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs.api-aTHmrI1m.js
var import_jsx_runtime = require_jsx_runtime();
function ApiContract() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-wider text-subtle",
			children: "Faithful to public V2 docs"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "API contract" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Base URL ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "https://api.acculynx.com/api/v2" }),
			". Every request:",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "Authorization: Bearer <API_KEY>" }),
			". Keys are created in AccuLynx Account Settings by an admin, one per location, one per integration."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Calls this app makes" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "GET /ping" }), " — key check"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "GET /jobs" }),
				" — ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "pageSize" }),
				", ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "recordStartIndex" }),
				",",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "sortBy=ModifiedDate" }),
				", ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "sortOrder=Descending" }),
				",",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "includes=contacts" })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "GET /company-settings/custom-fields?filter=jobs" }), " — definitions for mapping"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [
					"PUT /jobs/",
					"{jobId}",
					"/custom-fields"
				] }),
				" — body",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{ customFields: [{ id, fieldType, values: [string] }] }" }),
				", max 120 items, Text truncated at 500 chars, 204 on success, rate limited"
			] })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Errors treated as product events" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "401" }), " — key invalid or deactivated (not “try again”)"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "404" }), " — job or field missing"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "429" }),
				" — honor ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "Retry-After" }),
				" / ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "RateLimit-*" }),
				"; client retries twice. AccuLynx documents 30 req/s per IP and 10 req/s per key."
			] })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Field contract we write" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Comp Quote Total — Number" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Comp Quote Squares — Number" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Comp Quote Competitor — Text" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				"Comp Quote Quality — Text (",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "complete | thin | unreadable" }),
				")"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				"Comp Motion — Text (",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "match | defend | decline | need_more" }),
				")"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Comp Quote Received At — Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Comp Quote Brief — Text (sales brief)" })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mapping is by label, not hardcoded GUIDs. Definitions must already exist; the public API updates values, it does not mint field definitions from a partner." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Gemini" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Default model ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "gemini-3.7-flash" }),
			". PDF sent as",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "inline_data" }),
			". Structured JSON. Deterministic motion rules re-applied in application code so “match” cannot auto-fire a price war."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Webhooks (not implemented — next)" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "https://api.acculynx.com/webhooks/v2" }),
			" — subscribe to job / custom-field topics, ACK in under 10 seconds, idempotent on ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "eventId" }),
			", expect duplicates. Noisy listeners get disabled. A production ingest would enqueue, not parse PDFs on the webhook thread."
		] })
	] });
}
//#endregion
export { ApiContract as component };
