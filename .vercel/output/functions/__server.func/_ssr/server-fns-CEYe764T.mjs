import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as mapValuesToDefinitions, n as applyMotionRules, r as extractedToValues } from "./field-contract-DhjiAgpP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-fns-CEYe764T.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MOCK_JOBS = [
	{
		id: "5ac46861-75ae-45fe-b512-ff8d85ce8ab3",
		jobNumber: "JK-4418",
		milestone: "Approved",
		street: "1842 Willow Creek Rd",
		city: "Rockford",
		state: "IL",
		customer: "Dana Ellison",
		modifiedDate: "2026-09-04T14:22:00Z"
	},
	{
		id: "e591bf22-9828-4144-bca8-42cbb8c6e2c0",
		jobNumber: "JK-4391",
		milestone: "Prospect",
		street: "77 Birch Lane",
		city: "Beloit",
		state: "WI",
		customer: "Marcus Hale",
		modifiedDate: "2026-09-03T09:11:00Z"
	},
	{
		id: "24732e2b-bc9f-4a7a-a0a3-6200902a6fb4",
		jobNumber: "JK-4370",
		milestone: "Lead",
		street: "901 N Main St",
		city: "Janesville",
		state: "WI",
		customer: "Priya Shah",
		modifiedDate: "2026-08-29T18:40:00Z"
	}
];
var MOCK_FIELD_DEFINITIONS = [
	{
		id: "11111111-1111-4111-8111-111111111111",
		label: "Comp Quote Total",
		fieldType: "Number",
		entityType: "job"
	},
	{
		id: "22222222-2222-4222-8222-222222222222",
		label: "Comp Quote Squares",
		fieldType: "Number",
		entityType: "job"
	},
	{
		id: "33333333-3333-4333-8333-333333333333",
		label: "Comp Quote Competitor",
		fieldType: "Text",
		entityType: "job"
	},
	{
		id: "44444444-4444-4444-8444-444444444444",
		label: "Comp Quote Quality",
		fieldType: "Text",
		entityType: "job"
	},
	{
		id: "55555555-5555-4555-8555-555555555555",
		label: "Comp Motion",
		fieldType: "Text",
		entityType: "job"
	},
	{
		id: "66666666-6666-4666-8666-666666666666",
		label: "Comp Quote Received At",
		fieldType: "Date",
		entityType: "job"
	},
	{
		id: "77777777-7777-4777-8777-777777777777",
		label: "Comp Quote Brief",
		fieldType: "Text",
		entityType: "job"
	}
];
var SAMPLE_EXTRACT = {
	competitorName: "Summit Roofing Co.",
	totalPrice: 18450,
	squares: 24,
	materialFamily: "asphalt",
	scopeTags: ["tear-off", "underlayment"],
	warrantyMentioned: true,
	missing: ["exclusions"],
	quoteQuality: "complete",
	recommendedMotion: "defend",
	salesBrief: "Summit at $18,450 on ~24 sq asphalt. Tear-off listed; exclusions thin. Defend on scope and decking, do not race the number.",
	confidence: .86,
	evidence: [
		"Header: SUMMIT ROOFING CO. — Residential Proposal",
		"Total due: $18,450.00",
		"Squares: 24",
		"Shingles: GAF Timberline HDZ"
	]
};
var SAMPLE_QUOTE_TEXT = `SUMMIT ROOFING CO.
Residential Roofing Proposal
1234 Industry Blvd, Rockford IL
Prepared for: Dana Ellison
Job site: 1842 Willow Creek Rd, Rockford IL

Scope
- Tear-off existing 3-tab shingles
- Install GAF Timberline HDZ (charcoal)
- Synthetic underlayment
- Ridge vent

Squares: 24
Material: Asphalt shingles
Labor + material total: $18,450.00
Warranty: GAF manufacturer warranty mentioned
Payment: 50% deposit, remainder on completion

Notes: Price good for 14 days. Gutters not included.
`;
var BASE = "https://api.acculynx.com/api/v2";
var AccuLynxError = class extends Error {
	status;
	body;
	constructor(status, body, message) {
		super(message);
		this.status = status;
		this.body = body;
	}
};
async function accuFetch(apiKey, path, init = {}, attempt = 0) {
	const res = await fetch(`${BASE}${path}`, {
		...init,
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${apiKey}`,
			...init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {},
			...init.headers ?? {}
		}
	});
	const rate = {
		limit: res.headers.get("RateLimit-Limit") ?? void 0,
		remaining: res.headers.get("RateLimit-Remaining") ?? void 0,
		reset: res.headers.get("RateLimit-Reset") ?? void 0
	};
	if (res.status === 429 && attempt < 2) {
		const retryAfter = Number(res.headers.get("Retry-After") ?? "1");
		const waitMs = Number.isFinite(retryAfter) ? Math.min(retryAfter, 30) * 1e3 : 1e3 * (attempt + 1);
		await new Promise((r) => setTimeout(r, waitMs));
		return accuFetch(apiKey, path, init, attempt + 1);
	}
	if (!res.ok) {
		const body = await res.text();
		const msg = res.status === 401 ? "AccuLynx API key is invalid or deactivated." : res.status === 429 ? "AccuLynx rate limit hit (429). This client retries twice; back off and try again." : `AccuLynx ${res.status}: ${body.slice(0, 280)}`;
		throw new AccuLynxError(res.status, body, msg);
	}
	return {
		res,
		rate
	};
}
function jobFromApi(raw) {
	const loc = raw.locationAddress ?? raw.address ?? {};
	const milestoneObj = raw.currentMilestone ?? raw.milestone;
	const milestone = typeof milestoneObj === "string" ? milestoneObj : String(milestoneObj?.name ?? "Unknown");
	const contacts = raw.contacts ?? raw.jobContacts ?? [];
	const c = (contacts.find((c) => c.isPrimary) ?? contacts[0])?.contact;
	const customer = c?.displayName || [c?.firstName, c?.lastName].filter(Boolean).join(" ") || "—";
	return {
		id: String(raw.id),
		jobNumber: String(raw.jobNumber ?? raw.number ?? raw.id),
		milestone,
		street: String(loc.street1 ?? loc.street ?? ""),
		city: String(loc.city ?? ""),
		state: String(loc.state ?? loc.stateAbbreviation ?? ""),
		customer,
		modifiedDate: String(raw.modifiedDate ?? raw.createdDate ?? "")
	};
}
async function pingAccuLynx(apiKey) {
	const { rate } = await accuFetch(apiKey, "/ping");
	return {
		ok: true,
		rate
	};
}
async function listJobs(apiKey) {
	if (!apiKey) return {
		jobs: MOCK_JOBS,
		source: "mock"
	};
	const { res } = await accuFetch(apiKey, `/jobs?${new URLSearchParams({
		pageSize: "25",
		recordStartIndex: "0",
		sortBy: "ModifiedDate",
		sortOrder: "Descending",
		includes: "contacts"
	})}`);
	return {
		jobs: ((await res.json()).items ?? []).map(jobFromApi),
		source: "live"
	};
}
async function listJobFieldDefinitions(apiKey) {
	if (!apiKey) return {
		definitions: MOCK_FIELD_DEFINITIONS,
		source: "mock"
	};
	const { res } = await accuFetch(apiKey, `/company-settings/custom-fields?${new URLSearchParams({
		filter: "jobs",
		pageSize: "100",
		recordStartIndex: "0"
	})}`);
	return {
		definitions: (await res.json()).items ?? [],
		source: "live"
	};
}
async function writeJobCustomFields(opts) {
	const payload = { customFields: opts.rows.filter((r) => r.definitionId && r.value != null && r.value !== "").map((r) => ({
		id: r.definitionId,
		fieldType: r.fieldType,
		values: [r.value]
	})) };
	if (payload.customFields.length === 0) throw new AccuLynxError(400, "", "Nothing to write: mapped fields are empty or the tenant is missing the field definitions.");
	if (opts.dryRun) return {
		dryRun: true,
		endpoint: `PUT ${BASE}/jobs/${opts.jobId}/custom-fields`,
		payload,
		status: 204
	};
	await accuFetch(opts.apiKey, `/jobs/${opts.jobId}/custom-fields`, {
		method: "PUT",
		body: JSON.stringify(payload)
	});
	return {
		dryRun: false,
		endpoint: `PUT ${BASE}/jobs/${opts.jobId}/custom-fields`,
		payload,
		status: 204
	};
}
var EXTRACT_PROMPT = `You extract competitor roofing quotes into a fixed schema for a contractor CRM (AccuLynx).

You are NOT an estimator. Do not invent prices, squares, or materials. If a fact is not on the document, use null / unknown / put it in missing.

Return JSON only matching:
{
  "competitorName": string | null,
  "totalPrice": number | null,          // USD number, no $ or commas
  "squares": number | null,             // roofing squares if stated
  "materialFamily": "asphalt" | "metal" | "tile" | "other" | "unknown",
  "scopeTags": string[],                // from: tear-off, overlay, gutters, decking, underlayment, ventilation
  "warrantyMentioned": boolean,
  "missing": string[],                  // human labels of absent facts
  "quoteQuality": "complete" | "thin" | "unreadable",
  "recommendedMotion": "match" | "defend" | "decline" | "need_more",
  "salesBrief": string,                 // <= 400 chars. Facts + recommended motion. No pep talk.
  "confidence": number,                 // 0-1
  "evidence": string[]                  // short quotes from the document, max 6
}

Rules for recommendedMotion (also re-applied in code):
- unreadable or no totalPrice → need_more
- thin quote → need_more (unless clearly out of category → decline)
- never choose "match" to race price; prefer defend on scope
- decline only if the document is not a roofing/exterior quote

quoteQuality:
- complete: total + some scope
- thin: a quote-like doc missing total or squares/material
- unreadable: not a quote, or cannot read`;
function coerceExtract(raw) {
	const o = raw ?? {};
	const material = o.materialFamily;
	const quality = o.quoteQuality;
	const motion = o.recommendedMotion;
	const extracted = {
		competitorName: typeof o.competitorName === "string" && o.competitorName ? o.competitorName : null,
		totalPrice: typeof o.totalPrice === "number" && Number.isFinite(o.totalPrice) ? o.totalPrice : null,
		squares: typeof o.squares === "number" && Number.isFinite(o.squares) ? o.squares : null,
		materialFamily: [
			"asphalt",
			"metal",
			"tile",
			"other",
			"unknown"
		].includes(material) ? material : "unknown",
		scopeTags: Array.isArray(o.scopeTags) ? o.scopeTags.map(String).slice(0, 12) : [],
		warrantyMentioned: Boolean(o.warrantyMentioned),
		missing: Array.isArray(o.missing) ? o.missing.map(String) : [],
		quoteQuality: [
			"complete",
			"thin",
			"unreadable"
		].includes(quality) ? quality : "thin",
		recommendedMotion: [
			"match",
			"defend",
			"decline",
			"need_more"
		].includes(motion) ? motion : "need_more",
		salesBrief: typeof o.salesBrief === "string" ? o.salesBrief.slice(0, 500) : "",
		confidence: typeof o.confidence === "number" ? Math.min(1, Math.max(0, o.confidence)) : .5,
		evidence: Array.isArray(o.evidence) ? o.evidence.map(String).slice(0, 6) : []
	};
	return applyMotionRules(extracted);
}
async function extractFromPdf(opts) {
	if (opts.useSample || !opts.geminiKey) return {
		extracted: applyMotionRules(SAMPLE_EXTRACT),
		source: "mock",
		model: "fixture"
	};
	const model = opts.model.trim() || "gemini-3.7-flash";
	const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(opts.geminiKey)}`;
	const parts = [];
	if (opts.base64) parts.push({ inline_data: {
		mime_type: opts.mimeType || "application/pdf",
		data: opts.base64
	} });
	parts.push({ text: opts.base64 ? EXTRACT_PROMPT : `${EXTRACT_PROMPT}\n\nDocument text:\n${SAMPLE_QUOTE_TEXT}` });
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			contents: [{
				role: "user",
				parts
			}],
			generationConfig: {
				temperature: .1,
				responseMimeType: "application/json"
			}
		})
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(res.status === 400 ? `Gemini rejected the request: ${text.slice(0, 280)}` : res.status === 403 || res.status === 401 ? "Gemini API key is invalid or the model is not enabled for this key." : `Gemini ${res.status}: ${text.slice(0, 280)}`);
	}
	const text = (await res.json()).candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
	let parsed = {};
	try {
		parsed = JSON.parse(text);
	} catch {
		throw new Error("Gemini did not return JSON. Try again or use the sample quote.");
	}
	return {
		extracted: coerceExtract(parsed),
		source: "live",
		model
	};
}
function asString(v) {
	return typeof v === "string" ? v : "";
}
var pingKeys_createServerFn_handler = createServerRpc({
	id: "8baa685b24065de7921acc717be294e76bc1f8330c2caba801a256f49943d851",
	name: "pingKeys",
	filename: "src/lib/server-fns.ts"
}, (opts) => pingKeys.__executeServer(opts));
var pingKeys = createServerFn({ method: "POST" }).validator((d) => d).handler(pingKeys_createServerFn_handler, async ({ data }) => {
	const out = {};
	if (data.acculynxKey) try {
		await pingAccuLynx(data.acculynxKey);
		out.acculynx = { ok: true };
	} catch (e) {
		out.acculynx = {
			ok: false,
			error: e instanceof AccuLynxError ? e.message : String(e)
		};
	}
	if (data.geminiKey) try {
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${encodeURIComponent(data.geminiKey)}`;
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ contents: [{
				role: "user",
				parts: [{ text: "Reply with the single word pong." }]
			}] })
		});
		if (!res.ok) {
			const t = await res.text();
			out.gemini = {
				ok: false,
				error: `Gemini ${res.status}: ${t.slice(0, 180)}`
			};
		} else out.gemini = { ok: true };
	} catch (e) {
		out.gemini = {
			ok: false,
			error: String(e)
		};
	}
	return out;
});
var fetchJobs_createServerFn_handler = createServerRpc({
	id: "660d6d21ed950c27dc1ea6027588fee0201686436691a3334d32dc611c005c2b",
	name: "fetchJobs",
	filename: "src/lib/server-fns.ts"
}, (opts) => fetchJobs.__executeServer(opts));
var fetchJobs = createServerFn({ method: "POST" }).validator((d) => d).handler(fetchJobs_createServerFn_handler, async ({ data }) => {
	try {
		return await listJobs(data.acculynxKey || null);
	} catch (e) {
		throw new Error(e instanceof Error ? e.message : String(e));
	}
});
var fetchFieldDefs_createServerFn_handler = createServerRpc({
	id: "23a15c312258973e60ec5cd1537560033fd7256d8035479dbe036397f1abdfcb",
	name: "fetchFieldDefs",
	filename: "src/lib/server-fns.ts"
}, (opts) => fetchFieldDefs.__executeServer(opts));
var fetchFieldDefs = createServerFn({ method: "POST" }).validator((d) => d).handler(fetchFieldDefs_createServerFn_handler, async ({ data }) => {
	try {
		return await listJobFieldDefinitions(data.acculynxKey || null);
	} catch (e) {
		throw new Error(e instanceof Error ? e.message : String(e));
	}
});
var extractQuoteFn_createServerFn_handler = createServerRpc({
	id: "974aa90e1590198c4baf132130432b180b0536c8609617de6488d6736b3d11e8",
	name: "extractQuoteFn",
	filename: "src/lib/server-fns.ts"
}, (opts) => extractQuoteFn.__executeServer(opts));
var extractQuoteFn = createServerFn({ method: "POST" }).validator((d) => d).handler(extractQuoteFn_createServerFn_handler, async ({ data }) => {
	const result = await extractFromPdf({
		geminiKey: data.geminiKey || null,
		model: data.model || "gemini-3.7-flash",
		filename: asString(data.filename) || "quote.pdf",
		mimeType: asString(data.mimeType) || "application/pdf",
		base64: data.base64 || null,
		useSample: Boolean(data.useSample) || !data.geminiKey
	});
	const receivedAt = (/* @__PURE__ */ new Date()).toISOString();
	const values = extractedToValues(result.extracted, receivedAt);
	return {
		...result,
		receivedAt,
		values
	};
});
var prepareWriteFn_createServerFn_handler = createServerRpc({
	id: "2e5e47f22c2cfb469e06b06df35ca3b1db54a1a776ebc199cd1b1ae99f6d229b",
	name: "prepareWriteFn",
	filename: "src/lib/server-fns.ts"
}, (opts) => prepareWriteFn.__executeServer(opts));
var prepareWriteFn = createServerFn({ method: "POST" }).validator((d) => d).handler(prepareWriteFn_createServerFn_handler, async ({ data }) => {
	const { definitions, source } = await listJobFieldDefinitions(data.acculynxKey || null);
	const rows = mapValuesToDefinitions(definitions, data.values);
	return {
		rows,
		source,
		setupNeeded: rows.filter((r) => r.missing).map((r) => r.label)
	};
});
var commitWriteFn_createServerFn_handler = createServerRpc({
	id: "2e256ca39484427682455e1daf618775ec4255e331dc410bef69bf71215eb757",
	name: "commitWriteFn",
	filename: "src/lib/server-fns.ts"
}, (opts) => commitWriteFn.__executeServer(opts));
var commitWriteFn = createServerFn({ method: "POST" }).validator((d) => d).handler(commitWriteFn_createServerFn_handler, async ({ data }) => {
	if (!data.acculynxKey) return {
		dryRun: true,
		endpoint: `PUT https://api.acculynx.com/api/v2/jobs/${data.jobId}/custom-fields`,
		payload: { customFields: data.rows.filter((r) => r.definitionId && r.value).map((r) => ({
			id: r.definitionId,
			fieldType: r.fieldType,
			values: [r.value]
		})) },
		status: 204,
		mock: true
	};
	return writeJobCustomFields({
		apiKey: data.acculynxKey,
		jobId: data.jobId,
		rows: data.rows,
		dryRun: data.dryRun
	});
});
//#endregion
export { commitWriteFn_createServerFn_handler, extractQuoteFn_createServerFn_handler, fetchFieldDefs_createServerFn_handler, fetchJobs_createServerFn_handler, pingKeys_createServerFn_handler, prepareWriteFn_createServerFn_handler };
