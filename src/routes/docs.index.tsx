import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/")({
  component: ProductBrief,
});

function ProductBrief() {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-subtle">
        Technical Product Owner sample
      </p>
      <h1>Competitive quote ingest is a product, not a prompt</h1>
      <p>
        A roofing office already lives in AccuLynx. A homeowner forwards “the other guy’s
        number.” Today that PDF dies in email or a job note — the graveyard of CRM data.
        This sample treats the AccuLynx job as the system of record: unstructured quote in,
        typed custom fields out, human confirm before any write.
      </p>
      <p>
        I am not an estimator and this is not an estimating engine. The agent extracts a
        small, inspectable contract. Code — not the model — chooses the motion when the
        document is thin or unreadable. Notes are a receipt. Fields are what sales can
        filter next quarter.
      </p>

      <h2>Why this workflow</h2>
      <p>
        It is category-native (exterior / roofing), uses the public V2 surface a partner
        actually gets (Bearer API key per location, jobs, custom field definitions, PUT
        job custom fields), and matches the job posting’s agent section: retrieve, decide,
        complete work <em>within boundaries</em>.
      </p>
      <ul>
        <li>REST, JSON, Bearer auth, pagination, 401 vs 429, RateLimit headers</li>
        <li>Custom fields as the structured write; 500-character Text limit respected</li>
        <li>Confirm-gated mutation; dry-run is the default</li>
        <li>Session-only keys — never in the repo, never logged</li>
        <li>Mock path so a Director can click without a tenant</li>
      </ul>

      <h2>What the agent is allowed to do</h2>
      <p>
        Three verbs, not the OpenAPI spec pasted into a prompt:
      </p>
      <ul>
        <li>
          <code>extract_quote</code> — Gemini 3.7 Flash, structured JSON, PDF inline
        </li>
        <li>
          <code>map_fields</code> — match labels on{" "}
          <code>GET /company-settings/custom-fields?filter=jobs</code>
        </li>
        <li>
          <code>put_job_custom_fields</code> —{" "}
          <code>PUT /jobs/{"{jobId}"}/custom-fields</code> after confirm
        </li>
      </ul>
      <p>
        It cannot change milestones, owners, approved value, or create jobs. If the tenant
        does not have the seven field definitions, the UI shows a setup checklist instead
        of failing a 400 in production silence.
      </p>

      <h2>Auth, on purpose</h2>
      <p>
        AccuLynx customer API keys are admin-minted, per location, and equivalent to a
        password for that book of business. This demo collects the key in the page so a
        contractor can test — and says in the same panel: do not ship this form to the
        public internet. A partner product would use a named key per integration, rotation,
        and a server-side secret store. The Bearer token never goes to Gemini; only the
        PDF does.
      </p>

      <h2>What I would file on the API team</h2>
      <p>
        See the backlog page. Short version: pagination naming is inconsistent, custom
        field DX is the agent platform, notes are a poor integration primitive, and
        webhook disable-on-noise belongs in partner docs as a first-class contract.
      </p>
    </div>
  );
}
