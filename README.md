# Quote Ingest — Working with AccuLynx API, competitor quote

This is not a résumé. It is a working integration sample for AccuLynx’s Technical Product Owner (APIs and Integrations) role.

A roofing office gets a competitor’s estimate as a PDF. This app extracts a small, typed contract (Gemini 3.7 Flash), maps it onto AccuLynx **job custom fields**, and writes only after a human confirms. Dry-run is the default. Notes are a graveyard; fields are the product.

## What you can do without any keys

The live preview runs in **mock mode**: fixture jobs, fixture field definitions, fixture Summit Roofing quote. Click **Load sample quote**, then **Generate PUT payload**. You will see the exact `PUT /jobs/{id}/custom-fields` body AccuLynx expects.

## Live test (optional)

**Paste the two keys** in the form at the top of the app (password fields — paste works).

1. AccuLynx Advanced API key (admin, per location, from `https://my.acculynx.com/apikeys`) — treat it like a password. Name it for this integration.
2. Gemini API key (Google AI Studio). Default model `gemini-3.7-flash`.

Keys live in `sessionStorage` only. **Forget keys** clears them. They are never committed and never stored on Cloudflare.

On the contractor tenant, create these **job** custom fields first (the public API updates values; it does not mint definitions):

| Label | Type |
|---|---|
| Comp Quote Total | Number |
| Comp Quote Squares | Number |
| Comp Quote Competitor | Text |
| Comp Quote Quality | Text |
| Comp Motion | Text |
| Comp Quote Received At | Date |
| Comp Quote Brief | Text |

Then: pick a job → upload PDF → extract → confirm. Leave **Dry-run** on until you are watching.

## Host it

See [DEPLOY.md](DEPLOY.md). Short version: `npm run deploy:cloudflare` after `wrangler login`. GitHub → Cloudflare: set `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` and push `main`. The public site is the mock; keys are still pasted in the UI, not in env.

## Docs (the PO packet)

In the app:

- [Product brief](/docs) — workflow, boundaries, why this Y
- [API contract](/docs/api) — the V2 calls, auth, 429, field contract
- [Backlog](/docs/backlog) — five items for AccuLynx’s API team

Same content in markdown: `PRODUCT.md`, `docs/api-contract.md`.

## What this is not

An estimating engine. A chatbot with a raw API key. A write to milestones, approved value, or contacts. A webhook listener (called out as next, not shipped).

## Stack

TanStack Start, React, Tailwind. AccuLynx REST V2. Gemini 3.7 Flash for PDF structured extract. Confirm-gated `PUT` with retries on 429.
