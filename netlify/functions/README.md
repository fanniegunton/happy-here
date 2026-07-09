# Intake pipeline (Netlify Functions)

Webhook receivers that turn texted venue updates into draft `venueSubmission`
documents in Sanity. The `venueSubmission` and `blockedSender` schemas plus
the review dashboard live in the `happy-here-sanity` repo; this directory is
everything upstream. Shared pipeline code lives in [`netlify/lib/`](../lib).

The only channel right now is SMS/MMS via Twilio. The pipeline is
channel-agnostic past the normalization step, so adding another channel later
(WhatsApp, etc.) means: a new webhook function, a normalizer in
`lib/normalize.ts`, a media-download branch in `lib/media.ts`, and widening
the channel unions in `lib/types.ts` — batching, rate limiting, extraction,
and the Sanity write don't change.

Everything deploys with the site on Netlify. Upstash Redis (provisioned via
the Vercel marketplace) is used over its REST API — copy its two credentials
into Netlify's env vars; nothing runs on Vercel.

## Flow

```
Twilio webhook function
  → validate X-Twilio-Signature
  → normalize to a channel-agnostic message
  → blocklist check (Sanity blockedSender)
  → rate limit (Upstash Redis sliding window; burst → auto-block)
  → append to per-sender batch (60s window, Redis)
  → invoke process-batch-background (202 returns immediately)
  → respond with empty TwiML

process-batch-background (Netlify background function, 15 min cap)
  → sleep out the batch window
  → atomically claim the batch iff no newer message arrived (Redis seq check;
    a newer message's own background invocation supersedes this one)
  → download media → Claude extraction (with current venue list from Sanity)
  → duplicate check → upload images to Sanity → create drafts.<uuid> submission
```

Netlify's synchronous functions cap at ~10–26s, so the batch-window wait
lives in a background function (`-background` suffix). Its endpoint is
public like any function, so invocations must carry the shared
`INTAKE_QUEUE_SECRET` header. Note: background functions are a paid-plan
Netlify feature — verify availability on the site's plan before relying on
this in production.

Tunable thresholds (rate limits, batch window, duplicate similarity, Claude
model) are named constants in [`../lib/config.ts`](../lib/config.ts).

## Environment variables (Netlify site settings)

Set under Site configuration → Environment variables. The site's existing
vars (`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_TOKEN`, …) stay as they
are; the pipeline adds:

| Variable | Purpose |
| --- | --- |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | Signature validation + MMS media download |
| `SANITY_API_TOKEN` | Sanity token **with write access** (Editor role — distinct from the site's read-only `SANITY_TOKEN`) |
| `ANTHROPIC_API_KEY` | Claude extraction |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Copy the values from the Upstash/Vercel dashboard |
| `INTAKE_QUEUE_SECRET` | Shared secret authorizing webhook → background function calls (`openssl rand -hex 32`) |

## Webhook registration

Function URLs are under the reserved `/.netlify/functions/` path (never
shadowed by the SPA redirect). Register the **exact** URL — Twilio's
signature covers the URL it requested.

**Twilio**: point the phone number's "A message comes in" webhook (HTTP POST)
at `https://<site-domain>/.netlify/functions/twilio-webhook`.

## Tests / type-check

```sh
pnpm test                    # vitest — includes netlify/lib/*.test.ts
pnpm type-check:functions    # tsc against netlify/tsconfig.json
```

Local runs of the functions themselves use `netlify dev` (with the env vars
available locally, e.g. via `netlify env:list`/`netlify dev`'s injection).
