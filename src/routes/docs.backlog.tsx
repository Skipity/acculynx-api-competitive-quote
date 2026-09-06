import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/backlog")({
  component: Backlog,
});

function Backlog() {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-subtle">
        After a day in the public docs
      </p>
      <h1>Five items I would put on the API team backlog</h1>
      <p>
        Written as a Technical Product Owner, not a feature wishlist. Each is something
        partners and agents hit while integrating the way this sample does.
      </p>

      <h2>1. Custom fields as an agent primitive</h2>
      <p>
        Value PUT exists; definition create does not from the partner API. An agent that
        needs <code>Comp Motion</code> cannot self-provision. Acceptance: documented field
        contract + either a partner-safe “ensure fields” flow or a first-run checklist in
        the developer portal. Notes must not be the recommended dump.
      </p>

      <h2>2. Pagination naming</h2>
      <p>
        <code>recordStartIndex</code> vs <code>pageStartIndex</code> vs{" "}
        <code>pageIndex</code> across resources. Agents and generated clients break.
        Acceptance: one pair of names in V2, aliases deprecated in docs.
      </p>

      <h2>3. Key lifecycle is DX</h2>
      <p>
        Per-location Bearer keys with full blast radius. Support will not teach the API.
        Acceptance: named keys, last-used, scope hint (read vs write) on the roadmap,
        rotation without downtime. “Paste god-key into a chatbot” is an anti-pattern the
        docs should name.
      </p>

      <h2>4. Webhook listener contract as a product page</h2>
      <p>
        10s timeout, disable on errors, duplicates expected. Acceptance: a single “how not
        to get disabled” page with the test-event endpoint, idempotency key, and example
        2xx-then-queue. Treat this like Stripe’s webhook guide.
      </p>

      <h2>5. Agent-safe verbs, not raw HTTP</h2>
      <p>
        As customers connect agents, the useful product is a small set of tools with
        preconditions (<code>set_job_custom_field</code>, <code>append_job_note</code>)
        rather than OpenAPI dumped into a prompt. Permissions, business context, and
        reliable actions — the job posting’s words — become the backlog, not a side
        experiment.
      </p>

      <h2>Out of scope for this sample</h2>
      <p>
        OAuth (customer Advanced API is still API keys), Create Job, milestone writes,
        document upload of the PDF, email send, multi-location key orchestration. Those
        are the next sprint if a contractor actually runs this in the office.
      </p>
    </div>
  );
}
