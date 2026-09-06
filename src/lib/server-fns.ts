import { createServerFn } from "@tanstack/react-start";
import {
  extractedToValues,
  mapValuesToDefinitions,
  type ExtractedQuote,
  type FieldKey,
  type FieldMapRow,
} from "./field-contract";
import {
  AccuLynxError,
  listJobFieldDefinitions,
  listJobs,
  pingAccuLynx,
  writeJobCustomFields,
} from "./acculynx.server";
import { extractFromPdf } from "./gemini.server";

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

export const pingKeys = createServerFn({ method: "POST" })
  .validator((d: { acculynxKey?: string; geminiKey?: string }) => d)
  .handler(async ({ data }) => {
    const out: {
      acculynx?: { ok: boolean; error?: string };
      gemini?: { ok: boolean; error?: string };
    } = {};

    if (data.acculynxKey) {
      try {
        await pingAccuLynx(data.acculynxKey);
        out.acculynx = { ok: true };
      } catch (e) {
        out.acculynx = {
          ok: false,
          error: e instanceof AccuLynxError ? e.message : String(e),
        };
      }
    }

    if (data.geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${encodeURIComponent(data.geminiKey)}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Reply with the single word pong." }] }],
          }),
        });
        if (!res.ok) {
          const t = await res.text();
          out.gemini = { ok: false, error: `Gemini ${res.status}: ${t.slice(0, 180)}` };
        } else {
          out.gemini = { ok: true };
        }
      } catch (e) {
        out.gemini = { ok: false, error: String(e) };
      }
    }

    return out;
  });

export const fetchJobs = createServerFn({ method: "POST" })
  .validator((d: { acculynxKey?: string }) => d)
  .handler(async ({ data }) => {
    try {
      return await listJobs(data.acculynxKey || null);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  });

export const fetchFieldDefs = createServerFn({ method: "POST" })
  .validator((d: { acculynxKey?: string }) => d)
  .handler(async ({ data }) => {
    try {
      return await listJobFieldDefinitions(data.acculynxKey || null);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  });

export const extractQuoteFn = createServerFn({ method: "POST" })
  .validator((d: {
    geminiKey?: string;
    model?: string;
    filename?: string;
    mimeType?: string;
    base64?: string;
    useSample?: boolean;
  }) => d)
  .handler(async ({ data }) => {
    const result = await extractFromPdf({
      geminiKey: data.geminiKey || null,
      model: data.model || "gemini-3.7-flash",
      filename: asString(data.filename) || "quote.pdf",
      mimeType: asString(data.mimeType) || "application/pdf",
      base64: data.base64 || null,
      useSample: Boolean(data.useSample) || !data.geminiKey,
    });
    const receivedAt = new Date().toISOString();
    const values = extractedToValues(result.extracted, receivedAt);
    return { ...result, receivedAt, values };
  });

export const prepareWriteFn = createServerFn({ method: "POST" })
  .validator((d: {
    acculynxKey?: string;
    values: Record<FieldKey, string | null>;
  }) => d)
  .handler(async ({ data }) => {
    const { definitions, source } = await listJobFieldDefinitions(data.acculynxKey || null);
    const rows = mapValuesToDefinitions(definitions, data.values);
    return { rows, source, setupNeeded: rows.filter((r) => r.missing).map((r) => r.label) };
  });

export const commitWriteFn = createServerFn({ method: "POST" })
  .validator((d: {
    acculynxKey?: string;
    jobId: string;
    dryRun: boolean;
    rows: FieldMapRow[];
  }) => d)
  .handler(async ({ data }) => {
    if (!data.acculynxKey) {
      return {
        dryRun: true as const,
        endpoint: `PUT https://api.acculynx.com/api/v2/jobs/${data.jobId}/custom-fields`,
        payload: {
          customFields: data.rows
            .filter((r) => r.definitionId && r.value)
            .map((r) => ({
              id: r.definitionId,
              fieldType: r.fieldType,
              values: [r.value],
            })),
        },
        status: 204,
        mock: true as const,
      };
    }
    return writeJobCustomFields({
      apiKey: data.acculynxKey,
      jobId: data.jobId,
      rows: data.rows,
      dryRun: data.dryRun,
    });
  });

export type ExtractResult = {
  extracted: ExtractedQuote;
  source: "live" | "mock";
  model: string;
  receivedAt: string;
  values: Record<FieldKey, string | null>;
};
