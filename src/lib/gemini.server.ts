import {
  applyMotionRules,
  type ExtractedQuote,
  type MaterialFamily,
  type QuoteMotion,
  type QuoteQuality,
} from "./field-contract";
import { SAMPLE_EXTRACT, SAMPLE_QUOTE_TEXT } from "./mock-data";

const EXTRACT_PROMPT = `You extract competitor roofing quotes into a fixed schema for a contractor CRM (AccuLynx).

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

function coerceExtract(raw: unknown): ExtractedQuote {
  const o = (raw ?? {}) as Record<string, unknown>;
  const material = o.materialFamily;
  const quality = o.quoteQuality;
  const motion = o.recommendedMotion;
  const materials: MaterialFamily[] = ["asphalt", "metal", "tile", "other", "unknown"];
  const qualities: QuoteQuality[] = ["complete", "thin", "unreadable"];
  const motions: QuoteMotion[] = ["match", "defend", "decline", "need_more"];

  const extracted: ExtractedQuote = {
    competitorName: typeof o.competitorName === "string" && o.competitorName ? o.competitorName : null,
    totalPrice: typeof o.totalPrice === "number" && Number.isFinite(o.totalPrice) ? o.totalPrice : null,
    squares: typeof o.squares === "number" && Number.isFinite(o.squares) ? o.squares : null,
    materialFamily: materials.includes(material as MaterialFamily)
      ? (material as MaterialFamily)
      : "unknown",
    scopeTags: Array.isArray(o.scopeTags) ? o.scopeTags.map(String).slice(0, 12) : [],
    warrantyMentioned: Boolean(o.warrantyMentioned),
    missing: Array.isArray(o.missing) ? o.missing.map(String) : [],
    quoteQuality: qualities.includes(quality as QuoteQuality) ? (quality as QuoteQuality) : "thin",
    recommendedMotion: motions.includes(motion as QuoteMotion)
      ? (motion as QuoteMotion)
      : "need_more",
    salesBrief: typeof o.salesBrief === "string" ? o.salesBrief.slice(0, 500) : "",
    confidence: typeof o.confidence === "number" ? Math.min(1, Math.max(0, o.confidence)) : 0.5,
    evidence: Array.isArray(o.evidence) ? o.evidence.map(String).slice(0, 6) : [],
  };
  return applyMotionRules(extracted);
}

export async function extractFromPdf(opts: {
  geminiKey: string | null;
  model: string;
  filename: string;
  mimeType: string;
  base64: string | null;
  useSample: boolean;
}): Promise<{ extracted: ExtractedQuote; source: "live" | "mock"; model: string }> {
  if (opts.useSample || !opts.geminiKey) {
    return { extracted: applyMotionRules(SAMPLE_EXTRACT), source: "mock", model: "fixture" };
  }

  const model = opts.model.trim() || "gemini-3.7-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(opts.geminiKey)}`;

  const parts: unknown[] = [];
  if (opts.base64) {
    parts.push({
      inline_data: {
        mime_type: opts.mimeType || "application/pdf",
        data: opts.base64,
      },
    });
  }
  parts.push({
    text: opts.base64
      ? EXTRACT_PROMPT
      : `${EXTRACT_PROMPT}\n\nDocument text:\n${SAMPLE_QUOTE_TEXT}`,
  });

  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      res.status === 400
        ? `Gemini rejected the request: ${text.slice(0, 280)}`
        : res.status === 403 || res.status === 401
          ? "Gemini API key is invalid or the model is not enabled for this key."
          : `Gemini ${res.status}: ${text.slice(0, 280)}`,
    );
  }

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  let parsed: unknown = {};
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini did not return JSON. Try again or use the sample quote.");
  }

  return { extracted: coerceExtract(parsed), source: "live", model };
}
