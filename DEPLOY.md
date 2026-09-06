# Deploy Quote Ingest

The AccuLynx integration does not change by host. Mock mode works with zero secrets. Optional keys are **pasted in the page**, session-only — do not put AccuLynx or Gemini keys in Cloudflare / GitHub env vars.

## Cloudflare Workers (the demo host)

```bash
npm install
npm run deploy:cloudflare
```

That builds with Nitro preset `cloudflare-module` (Worker + assets), then deploys using the generated `.output/server/wrangler.json`. First time: `npx wrangler login`.

Or connect the GitHub repo in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Build command | `npm run build:cloudflare` |
| Deploy command | `npx wrangler deploy --config .output/server/wrangler.json` |
| Node | 22 |

GitHub Actions (optional): add repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Workflow: `.github/workflows/deploy-cloudflare.yml`.

Public URL should stay a **clickable mock**. Visitors may paste their own keys; those hit AccuLynx/Gemini from the Worker and are not stored. Dry-run stays the default write.

## Vercel

`npm run build` still targets Vercel (this workspace’s default). AccuLynx code is the same.

## What not to do

- Do not `wrangler secret put` an AccuLynx key for this demo.
- Do not commit `.dev.vars` with real keys.
- Do not uncheck dry-run on a tenant you are not watching.
