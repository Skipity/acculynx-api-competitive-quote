//#region node_modules/.nitro/vite/services/ssr/assets/field-contract-DhjiAgpP.js
var FIELD_CONTRACT = [
	{
		key: "comp_quote_total",
		labels: [
			"Comp Quote Total",
			"Competitor Quote Total",
			"Comp Total"
		],
		fieldType: "Number",
		description: "Competitor quote total in USD, digits only."
	},
	{
		key: "comp_quote_squares",
		labels: [
			"Comp Quote Squares",
			"Competitor Squares",
			"Comp Squares"
		],
		fieldType: "Number",
		description: "Roof squares if stated on the quote."
	},
	{
		key: "comp_quote_competitor",
		labels: [
			"Comp Quote Competitor",
			"Competitor Name",
			"Comp Competitor"
		],
		fieldType: "Text",
		description: "Competitor company name if present."
	},
	{
		key: "comp_quote_quality",
		labels: ["Comp Quote Quality", "Quote Quality"],
		fieldType: "Text",
		description: "complete | thin | unreadable"
	},
	{
		key: "comp_motion",
		labels: [
			"Comp Motion",
			"Quote Motion",
			"Recommended Motion"
		],
		fieldType: "Text",
		description: "match | defend | decline | need_more"
	},
	{
		key: "comp_quote_received_at",
		labels: ["Comp Quote Received At", "Competitor Quote Date"],
		fieldType: "Date",
		description: "ISO timestamp when this ingest ran."
	},
	{
		key: "comp_quote_brief",
		labels: ["Comp Quote Brief", "Sales Brief"],
		fieldType: "Text",
		description: "Short sales brief (max 500 chars — AccuLynx Text limit)."
	}
];
function applyMotionRules(extracted) {
	const missing = [...extracted.missing];
	if (extracted.totalPrice == null) missing.push("total price");
	if (!extracted.competitorName) missing.push("competitor name");
	let quoteQuality = extracted.quoteQuality;
	if (extracted.quoteQuality === "unreadable") quoteQuality = "unreadable";
	else if (extracted.totalPrice == null || missing.length >= 3) quoteQuality = "thin";
	let recommendedMotion = extracted.recommendedMotion;
	if (quoteQuality === "unreadable" || extracted.totalPrice == null) recommendedMotion = "need_more";
	else if (quoteQuality === "thin") recommendedMotion = extracted.recommendedMotion === "decline" ? "decline" : "need_more";
	else if (recommendedMotion === "match") recommendedMotion = "defend";
	return {
		...extracted,
		missing: Array.from(new Set(missing)),
		quoteQuality,
		recommendedMotion
	};
}
function extractedToValues(extracted, receivedAtIso) {
	const brief = extracted.salesBrief.slice(0, 500);
	return {
		comp_quote_total: extracted.totalPrice == null ? null : String(extracted.totalPrice),
		comp_quote_squares: extracted.squares == null ? null : String(extracted.squares),
		comp_quote_competitor: extracted.competitorName,
		comp_quote_quality: extracted.quoteQuality,
		comp_motion: extracted.recommendedMotion,
		comp_quote_received_at: receivedAtIso,
		comp_quote_brief: brief || null
	};
}
function normalizeLabel(label) {
	return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}
function matchDefinition(definitions, spec) {
	const wanted = spec.labels.map(normalizeLabel);
	return definitions.find((d) => wanted.includes(normalizeLabel(d.label)));
}
function mapValuesToDefinitions(definitions, values) {
	return FIELD_CONTRACT.map((spec) => {
		const def = matchDefinition(definitions, spec);
		const value = values[spec.key];
		return {
			key: spec.key,
			label: spec.labels[0],
			fieldType: spec.fieldType,
			definitionId: def?.id ?? null,
			value,
			missing: !def
		};
	});
}
//#endregion
export { mapValuesToDefinitions as i, applyMotionRules as n, extractedToValues as r, FIELD_CONTRACT as t };
