# Product brief — competitor quote ingest for AccuLynx

Audience: Director of Product, API/Integrations PO loop, Director of Engineering.

## Job to be done

When a homeowner forwards another contractor’s estimate, the office needs that fact on the **job** in AccuLynx — filterable, API-readable, not buried in a note.

## Workflow

1. Select job (`GET /jobs`).
2. Ingest PDF (Gemini 3.7 Flash, structured JSON).
3. Re-apply motion rules in code (never auto-`match` on price).
4. Map labels to `GET /company-settings/custom-fields?filter=jobs`.
5. Confirm. `PUT /jobs/{jobId}/custom-fields`.

## Boundaries (agent tools, not OpenAPI-in-a-prompt)

Allowed: extract, map, PUT custom fields.
Forbidden: milestones, financials, Create Job, contact mutation, sending email.

## Auth

Bearer API key, per location, admin-issued. Session-only in this demo. Named key per integration in real life. AccuLynx key is never sent to Gemini.

## Why not notes

Notes are not queryable, not typed, and not a partner primitive. Custom fields are. The short sales brief still lands in a Text field so a human can read it in the job file.

## Success

A sales manager can filter jobs where `Comp Motion = defend` this week. That is the product. The PDF parser is a means.
