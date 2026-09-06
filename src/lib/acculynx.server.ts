import {
  mapValuesToDefinitions,
  type FieldDefinition,
  type FieldMapRow,
} from "./field-contract";
import { MOCK_FIELD_DEFINITIONS, MOCK_JOBS, type JobSummary } from "./mock-data";

const BASE = "https://api.acculynx.com/api/v2";

export class AccuLynxError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type RateLimitInfo = {
  limit?: string;
  remaining?: string;
  reset?: string;
};

async function accuFetch(
  apiKey: string,
  path: string,
  init: RequestInit = {},
  attempt = 0,
): Promise<{ res: Response; rate: RateLimitInfo }> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(init.headers ?? {}),
    },
  });

  const rate: RateLimitInfo = {
    limit: res.headers.get("RateLimit-Limit") ?? undefined,
    remaining: res.headers.get("RateLimit-Remaining") ?? undefined,
    reset: res.headers.get("RateLimit-Reset") ?? undefined,
  };

  if (res.status === 429 && attempt < 2) {
    const retryAfter = Number(res.headers.get("Retry-After") ?? "1");
    const waitMs = Number.isFinite(retryAfter) ? Math.min(retryAfter, 30) * 1000 : 1000 * (attempt + 1);
    await new Promise((r) => setTimeout(r, waitMs));
    return accuFetch(apiKey, path, init, attempt + 1);
  }

  if (!res.ok) {
    const body = await res.text();
    const msg =
      res.status === 401
        ? "AccuLynx API key is invalid or deactivated."
        : res.status === 429
          ? "AccuLynx rate limit hit (429). This client retries twice; back off and try again."
          : `AccuLynx ${res.status}: ${body.slice(0, 280)}`;
    throw new AccuLynxError(res.status, body, msg);
  }

  return { res, rate };
}

function jobFromApi(raw: Record<string, unknown>): JobSummary {
  const loc = (raw.locationAddress ?? raw.address ?? {}) as Record<string, unknown>;
  const milestoneObj = raw.currentMilestone ?? raw.milestone;
  const milestone =
    typeof milestoneObj === "string"
      ? milestoneObj
      : String((milestoneObj as { name?: string } | undefined)?.name ?? "Unknown");
  const contacts = (raw.contacts ?? raw.jobContacts ?? []) as Array<{
    isPrimary?: boolean;
    contact?: { firstName?: string; lastName?: string; displayName?: string };
  }>;
  const primary = contacts.find((c) => c.isPrimary) ?? contacts[0];
  const c = primary?.contact;
  const customer =
    c?.displayName ||
    [c?.firstName, c?.lastName].filter(Boolean).join(" ") ||
    "—";

  return {
    id: String(raw.id),
    jobNumber: String(raw.jobNumber ?? raw.number ?? raw.id),
    milestone,
    street: String(loc.street1 ?? loc.street ?? ""),
    city: String(loc.city ?? ""),
    state: String(loc.state ?? loc.stateAbbreviation ?? ""),
    customer,
    modifiedDate: String(raw.modifiedDate ?? raw.createdDate ?? ""),
  };
}

export async function pingAccuLynx(apiKey: string) {
  const { rate } = await accuFetch(apiKey, "/ping");
  return { ok: true as const, rate };
}

export async function listJobs(apiKey: string | null): Promise<{
  jobs: JobSummary[];
  source: "live" | "mock";
}> {
  if (!apiKey) return { jobs: MOCK_JOBS, source: "mock" };

  const params = new URLSearchParams({
    pageSize: "25",
    recordStartIndex: "0",
    sortBy: "ModifiedDate",
    sortOrder: "Descending",
    includes: "contacts",
  });
  const { res } = await accuFetch(apiKey, `/jobs?${params}`);
  const json = (await res.json()) as { items?: Record<string, unknown>[] };
  const jobs = (json.items ?? []).map(jobFromApi);
  return { jobs, source: "live" };
}

export async function listJobFieldDefinitions(apiKey: string | null): Promise<{
  definitions: FieldDefinition[];
  source: "live" | "mock";
}> {
  if (!apiKey) {
    return { definitions: MOCK_FIELD_DEFINITIONS, source: "mock" };
  }

  const params = new URLSearchParams({
    filter: "jobs",
    pageSize: "100",
    recordStartIndex: "0",
  });
  const { res } = await accuFetch(apiKey, `/company-settings/custom-fields?${params}`);
  const json = (await res.json()) as { items?: FieldDefinition[] };
  return { definitions: json.items ?? [], source: "live" };
}

export { mapValuesToDefinitions };

export async function writeJobCustomFields(opts: {
  apiKey: string;
  jobId: string;
  rows: FieldMapRow[];
  dryRun: boolean;
}) {
  const payload = {
    customFields: opts.rows
      .filter((r) => r.definitionId && r.value != null && r.value !== "")
      .map((r) => ({
        id: r.definitionId as string,
        fieldType: r.fieldType,
        values: [r.value as string],
      })),
  };

  if (payload.customFields.length === 0) {
    throw new AccuLynxError(
      400,
      "",
      "Nothing to write: mapped fields are empty or the tenant is missing the field definitions.",
    );
  }

  if (opts.dryRun) {
    return {
      dryRun: true as const,
      endpoint: `PUT ${BASE}/jobs/${opts.jobId}/custom-fields`,
      payload,
      status: 204,
    };
  }

  await accuFetch(opts.apiKey, `/jobs/${opts.jobId}/custom-fields`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return {
    dryRun: false as const,
    endpoint: `PUT ${BASE}/jobs/${opts.jobId}/custom-fields`,
    payload,
    status: 204,
  };
}
