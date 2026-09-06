# JobPulse — an AccuLynx-shaped integration demo

This is not a resume. It is a working integration sketch for the AccuLynx Technical Product Owner role.

It treats the AccuLynx platform the way the job description asks a PO to treat it: as a **product** used by customers, partners, and (increasingly) agents — not just a pile of endpoints.

You cannot hit AccuLynx production without a customer API key. So this repo ships a **faithful mock** of the public V2 surface that JobPulse actually uses, plus a real client that speaks the same contracts.

```
https://api.acculynx.com/api/v2
Authorization: Bearer <API_KEY>
Webhooks: https://api.acculynx.com/webhooks/v2
```

Rate limits documented by AccuLynx: **30 req/s per IP**, **10 req/s per API key**, `429` + `RateLimit-*` headers.

## What it does

A roofing contractor lives in AccuLynx. Production, accounting, and an AI ops assistant live outside it. JobPulse is the thin, reliable layer in the middle.

1. **Inbound webhooks** — milestone changes, invoice updates, approved-value changes
2. **Enrichment** — pull job + payments overview so the event is usable
3. **Idempotent processing** — duplicates are expected; events are keyed by `eventId`
4. **Agent tools** — retrieve job context and propose next actions *inside permission boundaries*
5. **Ops dashboard** — what a partner would actually look at after go-live

That last point is the PO part. The code is the evidence that I can sit in the technical conversation.

## Run it

```bash
cd jobpulse
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m src.server
```

Open http://127.0.0.1:8080

Then fire a simulated AccuLynx event:

```bash
curl -s http://127.0.0.1:8080/demo/fire-milestone | python -m json.tool
```

Or talk to it the way an agent would:

```bash
curl -s http://127.0.0.1:8080/agent/tools | python -m json.tool
curl -s -X POST http://127.0.0.1:8080/agent/invoke \
  -H 'content-type: application/json' \
  -d '{"tool":"get_job_context","arguments":{"jobId":"5ac46861-75ae-45fe-b512-ff8d85ce8ab3"}}'
```

## Why this shape (product notes)

Written as backlog thinking, not marketing.

| Observation from public docs | Product implication |
|---|---|
| API keys are per-location, admin-issued, Bearer token | DX starts at key lifecycle: naming, rotation, blast radius, "which integration is this key for?" |
| Support explicitly does *not* teach people how to use the API | Documentation, examples, error payloads, and a test-event endpoint *are* the product |
| Webhooks timeout in 10s and disable noisy subscribers | Listener contract is a first-class requirement: 2xx fast, queue later, handle duplicates |
| Pagination is `pageSize` + `recordStartIndex` / `pageStartIndex` (inconsistent naming across resources) | Consistency and discoverability belong on the PO backlog |
| Write endpoints are rate-limited with `RateLimit-*` headers | Clients must treat 429 as a designed path, not an incident |
| Job posting calls out agents | Agents need scoped tools, not raw API keys pasted into a prompt |

See `PRODUCT.md` for a one-sprint backlog a PO on this team could actually run.

## Map to the job

- REST, JSON, Bearer auth, webhooks, pagination, retries, 429, versioning
- Partner / external-developer posture
- APIs as products (DX, reliability, docs, consistency)
- Agent-ready actions with boundaries
- Ambiguity turned into acceptance criteria (the mock + tests encode those)

Live AccuLynx keys stay with customers. This demo is meant to be read, run, and argued with.
