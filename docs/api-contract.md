# API contract

Base: `https://api.acculynx.com/api/v2`  
Auth: `Authorization: Bearer <API_KEY>`  
Docs: https://apidocs.acculynx.com/

## Endpoints used

| Method | Path | Why |
|---|---|---|
| GET | `/ping` | Key check |
| GET | `/jobs` | Job picker. `pageSize`, `recordStartIndex`, `sortBy=ModifiedDate`, `sortOrder=Descending`, `includes=contacts` |
| GET | `/company-settings/custom-fields?filter=jobs` | Definition map by label |
| PUT | `/jobs/{jobId}/custom-fields` | Write. Body `{ customFields: [{ id, fieldType, values: string[] }] }`. 204. Rate limited. Text max 500. |

## Errors

- 401 invalid/deactivated key
- 404 missing job/field
- 429 — 30 req/s IP, 10 req/s key; honor `RateLimit-*` / `Retry-After`; this client retries twice

## Gemini

`gemini-3.7-flash`, PDF `inline_data`, JSON extract. Motion rules re-applied in app code.

## Webhooks (not in v1)

`https://api.acculynx.com/webhooks/v2` — 10s ACK, idempotent `eventId`, duplicates expected, disable-on-noise.
