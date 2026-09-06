import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  FileUp,
  KeyRound,
  Loader2,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FIELD_CONTRACT, type FieldMapRow } from "@/lib/field-contract";
import type { JobSummary } from "@/lib/mock-data";
import {
  commitWriteFn,
  extractQuoteFn,
  fetchJobs,
  pingKeys,
  prepareWriteFn,
  type ExtractResult,
} from "@/lib/server-fns";
import { clearKeys, readKeys, writeKeys, type SessionKeys } from "@/lib/session-keys";

export const Route = createFileRoute("/")({
  loader: () => fetchJobs({ data: {} }),
  component: IngestPage,
});

function IngestPage() {
  const initial = Route.useLoaderData();
  const [keys, setKeys] = useState<SessionKeys>({
    acculynxKey: "",
    geminiKey: "",
    model: "gemini-3.7-flash",
  });
  const [pinging, setPinging] = useState(false);
  const [jobs, setJobs] = useState<JobSummary[]>(initial.jobs);
  const [jobSource, setJobSource] = useState<"live" | "mock">(initial.source);
  const [jobId, setJobId] = useState<string>(initial.jobs[0]?.id || "");
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [rows, setRows] = useState<FieldMapRow[]>([]);
  const [setupNeeded, setSetupNeeded] = useState<string[]>([]);
  const [dryRun, setDryRun] = useState(true);
  const [writing, setWriting] = useState(false);
  const [writeLog, setWriteLog] = useState<string | null>(null);

  useEffect(() => {
    setKeys(readKeys());
  }, []);

  async function loadJobs(acculynxKey?: string) {
    try {
      const data = await fetchJobs({ data: { acculynxKey: acculynxKey || undefined } });
      setJobs(data.jobs);
      setJobSource(data.source);
      setJobId((id) => id || data.jobs[0]?.id || "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not list jobs");
      const data = await fetchJobs({ data: {} });
      setJobs(data.jobs);
      setJobSource("mock");
      setJobId(data.jobs[0]?.id || "");
    }
  }

  function persistKeys(next: SessionKeys) {
    setKeys(next);
    writeKeys(next);
  }

  const mode = useMemo(() => {
    if (keys.acculynxKey && keys.geminiKey) return "live";
    if (keys.geminiKey) return "extract-only";
    if (keys.acculynxKey) return "acculynx-only";
    return "mock";
  }, [keys]);

  async function onPing() {
    setPinging(true);
    try {
      const out = await pingKeys({
        data: {
          acculynxKey: keys.acculynxKey || undefined,
          geminiKey: keys.geminiKey || undefined,
        },
      });
      if (out.acculynx) {
        out.acculynx.ok ? toast.success("AccuLynx key accepted") : toast.error(out.acculynx.error);
      }
      if (out.gemini) {
        out.gemini.ok ? toast.success("Gemini key accepted") : toast.error(out.gemini.error);
      }
      if (!out.acculynx && !out.gemini) toast.message("Add a key first — or stay in mock mode.");
      if (keys.acculynxKey && out.acculynx?.ok) await loadJobs(keys.acculynxKey);
    } finally {
      setPinging(false);
    }
  }

  async function runExtract(useSample: boolean) {
    setExtracting(true);
    setWriteLog(null);
    try {
      let base64: string | undefined;
      if (file && !useSample) {
        base64 = await fileToBase64(file);
      }
      const extracted = await extractQuoteFn({
        data: {
          geminiKey: keys.geminiKey || undefined,
          model: keys.model,
          filename: file?.name,
          mimeType: file?.type || "application/pdf",
          base64,
          useSample: useSample || !file,
        },
      });
      setResult(extracted);
      const prep = await prepareWriteFn({
        data: {
          acculynxKey: keys.acculynxKey || undefined,
          values: extracted.values,
        },
      });
      setRows(prep.rows);
      setSetupNeeded(prep.setupNeeded);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Extract failed");
    } finally {
      setExtracting(false);
    }
  }

  async function onWrite() {
    if (!jobId) {
      toast.error("Select a job first");
      return;
    }
    setWriting(true);
    try {
      const out = await commitWriteFn({
        data: {
          acculynxKey: keys.acculynxKey || undefined,
          jobId,
          dryRun: dryRun || !keys.acculynxKey,
          rows,
        },
      });
      setWriteLog(JSON.stringify(out, null, 2));
      if (out.dryRun) toast.success("Dry-run payload ready — nothing written");
      else toast.success("Custom fields written to AccuLynx");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Write failed");
    } finally {
      setWriting(false);
    }
  }

  const selected = jobs.find((j) => j.id === jobId);

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">
            AccuLynx API sample
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Competitor quote ingest
          </h1>
          <p className="mt-3 text-muted">
            PDF in. Structured job custom fields out. The model extracts; this app decides
            the motion and will not write until you confirm.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge tone={mode === "mock" ? "muted" : mode === "live" ? "ok" : "warn"}>
            {mode === "mock"
              ? "Mock mode — no keys"
              : mode === "live"
                ? "Live keys in this session"
                : mode === "extract-only"
                  ? "Gemini only — AccuLynx writes mocked"
                  : "AccuLynx only — extract uses fixture"}
          </Badge>
          <Badge tone="muted">Jobs: {jobSource}</Badge>
        </div>

        <section className="mb-8 rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5">
          <div className="flex items-start gap-3">
            <KeyRound className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <p className="font-display text-base font-medium tracking-tight">Paste API keys</p>
              <p className="mt-1 text-sm text-muted">
                Optional. Paste both keys here to hit a real AccuLynx location and Gemini. They
                stay in this browser tab only — never the repo, never Cloudflare env. AccuLynx
                key goes only to AccuLynx; Gemini key only to Google. Leave blank for mock mode.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">AccuLynx API key</span>
              <Input
                type="password"
                autoComplete="off"
                spellCheck={false}
                placeholder="Paste key from my.acculynx.com/apikeys"
                value={keys.acculynxKey}
                onChange={(e) => persistKeys({ ...keys, acculynxKey: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Gemini API key</span>
              <Input
                type="password"
                autoComplete="off"
                spellCheck={false}
                placeholder="Paste Google AI Studio key"
                value={keys.geminiKey}
                onChange={(e) => persistKeys({ ...keys, geminiKey: e.target.value })}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium">Gemini model</span>
              <Input
                value={keys.model}
                onChange={(e) => persistKeys({ ...keys, model: e.target.value })}
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button onClick={() => void onPing()} disabled={pinging}>
              {pinging ? <Loader2 className="animate-spin" /> : <Check />}
              Test keys
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                clearKeys();
                persistKeys({ acculynxKey: "", geminiKey: "", model: "gemini-3.7-flash" });
                void loadJobs("");
                toast.message("Keys cleared from this session");
              }}
            >
              <Trash2 />
              Forget keys
            </Button>
            <span className="flex items-center gap-1.5 text-xs text-subtle">
              <ShieldAlert className="size-3.5" />
              Dry-run stays on until you uncheck it. Do not paste a production god-key on a
              public URL you do not control.
            </span>
          </div>
        </section>

        <ol className="grid gap-5 lg:grid-cols-2">
          <li className="rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5">
            <Step n={1} title="Choose the AccuLynx job" />
            <p className="mt-1 text-sm text-muted">
              Competitive intel belongs on a job, not in a floating note.
            </p>
            <label className="mt-4 block text-sm font-medium">
              Job
              <select
                className="mt-1.5 h-11 w-full rounded-sm border border-border bg-surface-2 px-3 text-sm"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.jobNumber} — {j.customer} ({j.milestone})
                  </option>
                ))}
              </select>
            </label>
            {selected ? (
              <p className="mt-3 font-mono text-xs text-muted">
                {selected.street}
                {selected.city ? `, ${selected.city}` : ""} {selected.state}
                <br />
                {selected.id}
              </p>
            ) : null}
          </li>

          <li className="rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5">
            <Step n={2} title="Upload the competitor quote" />
            <p className="mt-1 text-sm text-muted">
              PDF preferred. Without a Gemini key, load the fixture quote.
            </p>
            <label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-surface-2 px-4 py-6 text-center">
              <FileUp className="mb-2 size-5 text-accent" />
              <span className="text-sm font-medium">
                {file ? file.name : "Drop a PDF or click to browse"}
              </span>
              <input
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => void runExtract(false)} disabled={extracting}>
                {extracting ? <Loader2 className="animate-spin" /> : <ChevronRight />}
                Extract
              </Button>
              <Button variant="secondary" onClick={() => void runExtract(true)} disabled={extracting}>
                Load sample quote
              </Button>
            </div>
          </li>
        </ol>

        {result ? (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5">
              <Step n={3} title="Review the extract" />
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={result.extracted.quoteQuality === "complete" ? "ok" : "warn"}>
                  {result.extracted.quoteQuality}
                </Badge>
                <Badge>{result.extracted.recommendedMotion}</Badge>
                <Badge tone="muted">
                  {(result.extracted.confidence * 100).toFixed(0)}% confidence
                </Badge>
                <Badge tone="muted">{result.source === "mock" ? "fixture" : result.model}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Fact k="Competitor" v={result.extracted.competitorName ?? "—"} />
                <Fact
                  k="Total"
                  v={
                    result.extracted.totalPrice != null
                      ? `$${result.extracted.totalPrice.toLocaleString()}`
                      : "—"
                  }
                />
                <Fact
                  k="Squares"
                  v={result.extracted.squares != null ? String(result.extracted.squares) : "—"}
                />
                <Fact k="Material" v={result.extracted.materialFamily} />
              </dl>
              <p className="mt-4 text-sm leading-relaxed">{result.extracted.salesBrief}</p>
              {result.extracted.missing.length ? (
                <p className="mt-3 text-sm text-warn">
                  Missing: {result.extracted.missing.join(", ")}
                </p>
              ) : null}
              {result.extracted.evidence.length ? (
                <ul className="mt-3 space-y-1 font-mono text-xs text-muted">
                  {result.extracted.evidence.map((e) => (
                    <li key={e}>“{e}”</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5">
              <Step n={4} title="Map → AccuLynx custom fields" />
              {setupNeeded.length ? (
                <p className="mt-2 text-sm text-warn">
                  Create these job custom fields in AccuLynx, then extract again:{" "}
                  {setupNeeded.join(", ")}.
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  Labels matched to definitions. Values are what PUT will send.
                </p>
              )}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-subtle">
                    <tr>
                      <th className="py-2 pr-2 font-medium">Field</th>
                      <th className="py-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.key} className="border-t border-border">
                        <td className="py-2 pr-2 align-top">
                          <div className="font-medium">{r.label}</div>
                          <div className="font-mono text-[11px] text-subtle">
                            {r.fieldType}
                            {r.missing ? " · missing def" : ""}
                          </div>
                        </td>
                        <td className="py-2">
                          <Input
                            value={r.value ?? ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setRows((prev) =>
                                prev.map((row) =>
                                  row.key === r.key ? { ...row, value: v || null } : row,
                                ),
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <label className="mt-4 flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-accent"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                />
                Dry-run (no AccuLynx write)
              </label>
              <p className="mt-1 text-xs text-muted">
                Live PUT requires an AccuLynx key and dry-run off. Default is dry-run.
              </p>
              <Button className="mt-3" onClick={() => void onWrite()} disabled={writing}>
                {writing ? <Loader2 className="animate-spin" /> : <Check />}
                {dryRun || !keys.acculynxKey ? "Generate PUT payload" : "Write to AccuLynx"}
              </Button>
              {writeLog ? (
                <pre className="mt-3 max-h-56 overflow-auto rounded-sm bg-ink p-3 font-mono text-[11px] leading-relaxed text-accent-fg">
                  {writeLog}
                </pre>
              ) : null}
            </div>
          </section>
        ) : null}

        <p className="mt-10 max-w-2xl text-xs text-subtle">
          Field contract: {FIELD_CONTRACT.map((f) => f.labels[0]).join(" · ")}. Writes never
          touch milestones, money, or contacts. See the product brief for why notes are not
          the destination.
        </p>
      </main>
    </AppShell>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-lg font-medium tracking-tight">
      <span className="flex size-6 items-center justify-center rounded-full bg-accent text-xs text-accent-fg">
        {n}
      </span>
      {title}
    </h2>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{k}</dt>
      <dd className="font-medium tabular-nums">{v}</dd>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const s = String(reader.result ?? "");
      const comma = s.indexOf(",");
      resolve(comma >= 0 ? s.slice(comma + 1) : s);
    };
    reader.readAsDataURL(file);
  });
}
