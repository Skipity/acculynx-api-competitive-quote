/** The AccuLynx job custom-field contract this integration writes. */

export type AccuLynxFieldType = "Text" | "Number" | "Date" | "Boolean";

export type QuoteQuality = "complete" | "thin" | "unreadable";
export type QuoteMotion = "match" | "defend" | "decline" | "need_more";
export type MaterialFamily = "asphalt" | "metal" | "tile" | "other" | "unknown";

export type FieldKey =
  | "comp_quote_total"
  | "comp_quote_squares"
  | "comp_quote_competitor"
  | "comp_quote_quality"
  | "comp_motion"
  | "comp_quote_received_at"
  | "comp_quote_brief";

export type FieldSpec = {
  key: FieldKey;
  labels: string[];
  fieldType: AccuLynxFieldType;
  description: string;
};

export const FIELD_CONTRACT: FieldSpec[] = [
  {
    key: "comp_quote_total",
    labels: ["Comp Quote Total", "Competitor Quote Total", "Comp Total"],
    fieldType: "Number",
    description: "Competitor quote total in USD, digits only.",
  },
  {
    key: "comp_quote_squares",
    labels: ["Comp Quote Squares", "Competitor Squares", "Comp Squares"],
    fieldType: "Number",
    description: "Roof squares if stated on the quote.",
  },
  {
    key: "comp_quote_competitor",
    labels: ["Comp Quote Competitor", "Competitor Name", "Comp Competitor"],
    fieldType: "Text",
    description: "Competitor company name if present.",
  },
  {
    key: "comp_quote_quality",
    labels: ["Comp Quote Quality", "Quote Quality"],
    fieldType: "Text",
    description: "complete | thin | unreadable",
  },
  {
    key: "comp_motion",
    labels: ["Comp Motion", "Quote Motion", "Recommended Motion"],
    fieldType: "Text",
    description: "match | defend | decline | need_more",
  },
  {
    key: "comp_quote_received_at",
    labels: ["Comp Quote Received At", "Competitor Quote Date"],
    fieldType: "Date",
    description: "ISO timestamp when this ingest ran.",
  },
  {
    key: "comp_quote_brief",
    labels: ["Comp Quote Brief", "Sales Brief"],
    fieldType: "Text",
    description: "Short sales brief (max 500 chars — AccuLynx Text limit).",
  },
];

export type ExtractedQuote = {
  competitorName: string | null;
  totalPrice: number | null;
  squares: number | null;
  materialFamily: MaterialFamily;
  scopeTags: string[];
  warrantyMentioned: boolean;
  missing: string[];
  quoteQuality: QuoteQuality;
  recommendedMotion: QuoteMotion;
  salesBrief: string;
  confidence: number;
  evidence: string[];
};

export type FieldDefinition = {
  id: string;
  label: string;
  fieldType: string;
  entityType?: string;
};

export type FieldMapRow = {
  key: FieldKey;
  label: string;
  fieldType: AccuLynxFieldType;
  definitionId: string | null;
  value: string | null;
  missing: boolean;
};

export function applyMotionRules(extracted: ExtractedQuote): ExtractedQuote {
  const missing = [...extracted.missing];
  if (extracted.totalPrice == null) missing.push("total price");
  if (!extracted.competitorName) missing.push("competitor name");

  let quoteQuality = extracted.quoteQuality;
  if (extracted.quoteQuality === "unreadable") {
    quoteQuality = "unreadable";
  } else if (extracted.totalPrice == null || missing.length >= 3) {
    quoteQuality = "thin";
  }

  let recommendedMotion: QuoteMotion = extracted.recommendedMotion;
  if (quoteQuality === "unreadable" || extracted.totalPrice == null) {
    recommendedMotion = "need_more";
  } else if (quoteQuality === "thin") {
    recommendedMotion = extracted.recommendedMotion === "decline" ? "decline" : "need_more";
  } else if (recommendedMotion === "match") {
    recommendedMotion = "defend";
  }

  return { ...extracted, missing: Array.from(new Set(missing)), quoteQuality, recommendedMotion };
}

export function extractedToValues(
  extracted: ExtractedQuote,
  receivedAtIso: string,
): Record<FieldKey, string | null> {
  const brief = extracted.salesBrief.slice(0, 500);
  return {
    comp_quote_total: extracted.totalPrice == null ? null : String(extracted.totalPrice),
    comp_quote_squares: extracted.squares == null ? null : String(extracted.squares),
    comp_quote_competitor: extracted.competitorName,
    comp_quote_quality: extracted.quoteQuality,
    comp_motion: extracted.recommendedMotion,
    comp_quote_received_at: receivedAtIso,
    comp_quote_brief: brief || null,
  };
}

export function normalizeLabel(label: string) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

export function matchDefinition(definitions: FieldDefinition[], spec: FieldSpec) {
  const wanted = spec.labels.map(normalizeLabel);
  return definitions.find((d) => wanted.includes(normalizeLabel(d.label)));
}

export function mapValuesToDefinitions(
  definitions: FieldDefinition[],
  values: Record<FieldKey, string | null>,
): FieldMapRow[] {
  return FIELD_CONTRACT.map((spec) => {
    const def = matchDefinition(definitions, spec);
    const value = values[spec.key];
    return {
      key: spec.key,
      label: spec.labels[0],
      fieldType: spec.fieldType,
      definitionId: def?.id ?? null,
      value,
      missing: !def,
    };
  });
}
