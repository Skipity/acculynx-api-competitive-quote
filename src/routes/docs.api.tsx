import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/api")({
  component: ApiContract,
});

function ApiContract() {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-subtle">
        Faithful to public V2 docs
      </p>
      <h1>API contract</h1>
      <p>
        Base URL <code>https://api.acculynx.com/api/v2</code>. Every request:{" "}
        <code>{"Authorization: Bearer <API_KEY>"}</code>. Keys are created in AccuLynx
        Account Settings by an admin, one per location, one per integration.
      </p>

      <h2>Calls this app makes</h2>
      <ul>
        <li>
          <code>GET /ping</code> — key check
        </li>
        <li>
          <code>GET /jobs</code> — <code>pageSize</code>, <code>recordStartIndex</code>,{" "}
          <code>sortBy=ModifiedDate</code>, <code>sortOrder=Descending</code>,{" "}
          <code>includes=contacts</code>
        </li>
        <li>
          <code>GET /company-settings/custom-fields?filter=jobs</code> — definitions for
          mapping
        </li>
        <li>
          <code>PUT /jobs/{"{jobId}"}/custom-fields</code> — body{" "}
          <code>{"{ customFields: [{ id, fieldType, values: [string] }] }"}</code>, max 120
          items, Text truncated at 500 chars, 204 on success, rate limited
        </li>
      </ul>

      <h2>Errors treated as product events</h2>
      <ul>
        <li>
          <code>401</code> — key invalid or deactivated (not “try again”)
        </li>
        <li>
          <code>404</code> — job or field missing
        </li>
        <li>
          <code>429</code> — honor <code>Retry-After</code> / <code>RateLimit-*</code>;
          client retries twice. AccuLynx documents 30 req/s per IP and 10 req/s per key.
        </li>
      </ul>

      <h2>Field contract we write</h2>
      <ul>
        <li>Comp Quote Total — Number</li>
        <li>Comp Quote Squares — Number</li>
        <li>Comp Quote Competitor — Text</li>
        <li>Comp Quote Quality — Text (<code>complete | thin | unreadable</code>)</li>
        <li>Comp Motion — Text (<code>match | defend | decline | need_more</code>)</li>
        <li>Comp Quote Received At — Date</li>
        <li>Comp Quote Brief — Text (sales brief)</li>
      </ul>
      <p>
        Mapping is by label, not hardcoded GUIDs. Definitions must already exist; the
        public API updates values, it does not mint field definitions from a partner.
      </p>

      <h2>Gemini</h2>
      <p>
        Default model <code>gemini-3.7-flash</code>. PDF sent as{" "}
        <code>inline_data</code>. Structured JSON. Deterministic motion rules re-applied
        in application code so “match” cannot auto-fire a price war.
      </p>

      <h2>Webhooks (not implemented — next)</h2>
      <p>
        <code>https://api.acculynx.com/webhooks/v2</code> — subscribe to job / custom-field
        topics, ACK in under 10 seconds, idempotent on <code>eventId</code>, expect
        duplicates. Noisy listeners get disabled. A production ingest would enqueue, not
        parse PDFs on the webhook thread.
      </p>
    </div>
  );
}
