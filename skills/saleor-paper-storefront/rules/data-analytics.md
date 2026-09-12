---
name: data-analytics
description: Analytics and order attribution in Paper — Vercel Web Analytics toggle (NEXT_PUBLIC_VERCEL_WEB_ANALYTICS) with beforeSend URL redaction, and Commerce Context metadata (commerce.context.origin / ext.paper) written on checkoutCreate for Saleor Pulse. Use when adding tracking, GA4/pixels, custom events, page-view cost questions, or order-origin/marketing attribution metadata.
---

# Data Analytics

How Paper measures itself without leaking shopper data or multiplying the Vercel bill, and how it hands **order attribution** to Saleor Pulse. Saleor stays the revenue ledger; analytics tools count behaviour, never money.

> Read together with [`paper-vercel-cost`](paper-vercel-cost.md) (per-visit beacons multiply by traffic), [`checkout-management`](checkout-management.md) (shallow `?step=` URLs, `?checkout=` id), [`checkout-guest-order`](checkout-guest-order.md) (`/order/{key}` HMAC tokens).

---

## Lanes

| Lane                           | What it answers                                   | Status                                                                        |
| ------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Speed Insights**             | Is the storefront fast? (CWV by route)            | Shipped, sampled 1% — see `paper-vercel-cost` §4                              |
| **Vercel Web Analytics**       | How many humans, on which routes? (denominator)   | Shipped — `<WebAnalytics />` in both root layouts, env-toggled, URLs redacted |
| **Commerce Context → Pulse**   | Where did each _order_ come from? (attribution)   | Tier 1 shipped — `origin` + `ext.paper` on `checkoutCreate`; tier 2 planned   |
| **Commerce events (GA4 etc.)** | Where do shoppers drop between view and purchase? | Planned — one Paper event union, projected per destination; GA env-gated, off |

Same **moments**, different **payloads**: Vercel gets flat, low-cardinality facts (2 custom props on Pro); GA gets `items[]`; Pulse gets order-level context on Saleor metadata. Never make one tool carry another's payload.

---

## Vercel Web Analytics

```
src/lib/analytics/web-analytics.ts  webAnalyticsEnabled() — env toggle (server), tested
src/lib/analytics/redact-url.ts     redactAnalyticsUrl() — pure, tested
src/ui/components/web-analytics.tsx "use client" leaf: <Analytics beforeSend={redact} />
src/app/(storefront)/[locale]/layout.tsx · src/app/(checkout)/layout.tsx   mount sites
```

- **Toggle.** Default on when the build runs on Vercel (`VERCEL=1`), off elsewhere; `NEXT_PUBLIC_VERCEL_WEB_ANALYTICS=0|1` overrides. It is a boolean because Web Analytics has **no sampling knob** — one event per navigation, billed per event. That is what makes it the page-view denominator the cost model otherwise lacks; do not "sample" it by dropping events in `beforeSend`.
- **Enable it in the Vercel project too** (Analytics tab). Until then the script 404s — harmless, but an Edge Request per page for nothing. Non-Vercel forks leave it off.
- **Redaction is not optional.** Paper URLs carry bearer-like values: `?checkout=<id>`, `/order/<hmac-token>`, Stripe `payment_intent_client_secret`, account-confirmation `email` + `token`, free-text `?query=`. `redactAnalyticsUrl` strips those (exact names + any param matching `secret|token|password|email|session|auth`) and rewrites `/order/<key>` → `/order/[key]`. Extend the denylist when a new secret-bearing param appears; add a test case in `redact-url.test.ts`.
- **It is a client leaf** because `beforeSend` is a function and cannot cross the RSC boundary. The SDK wraps itself in `Suspense` (it reads `useSearchParams`), so PPR shells stay static — same as Speed Insights.
- **Verified against the Vercel script (v2.0.1):** `beforeSend` is queued inside `inject()` before the script loads, so the very first page view is redacted too; the script sends the `url` _returned_ by `beforeSend` (route pattern travels separately); internal referrers are never sent, external ones only on the first view. Re-check these three facts when bumping `@vercel/analytics`.
- **Custom events** (`track()`): not yet wired. When they land they go through the Paper event union, not ad-hoc `track()` calls in components. Budget: Pro = 2 custom properties per event; keep values low-cardinality (route slugs, step names, booleans) — never ids, emails, or amounts.

---

## Commerce Context (Saleor Pulse attribution)

Pulse composes sectioned **public metadata** on `ORDER_CREATED`: `commerce.context.{origin,marketing,actors,experiment,session}` + `commerce.context.ext.<vendor>`. Paper writes on the **checkout**; Saleor copies checkout public metadata onto the order at `checkoutComplete`, so there is no order-side write.

```
src/lib/commerce-context/keys.ts             key names + owner notes (spec copy — Paper never imports Pulse code)
src/lib/commerce-context/checkout-create.ts  buildCheckoutCreateContextMetadata({ locale })
src/graphql/CheckoutCreate.graphql           $metadata: [MetadataInput!] on the create input
src/checkout/graphql/checkout.graphql        same, checkout surface (recoverOrphanedCheckout)
```

**Two write tiers:**

| Tier | Sections               | When                                                | Consent                                                                       |
| ---- | ---------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1    | `origin`, `ext.paper`  | On `checkoutCreate`, in the same mutation           | None needed — facts about the order (surface, writer, time, locale, baseline) |
| 2    | `marketing`, `session` | `updateMetadata` before complete, fill-missing only | Only when analytics consent is granted (planned)                              |

Why tier 1 alone matters: `origin` present ⇒ Pulse coverage `valid`, so merchants can separate storefront orders from POS / draft / import / API before any marketing attribution exists — and with **zero extra round trips**, because it rides the mutation Paper already sends. Both `checkoutCreate` callers (`Checkout.create` on the storefront, `recoverOrphanedCheckout` on the checkout surface) pass it.

**Rules:**

- Paper owns `origin`, `marketing`, `session`, `ext.paper`. Never write `actors` / `experiment` (affiliate / A-B tooling own those) and never any `pulse.*` key.
- No PII, ever: no email, customer id, address, IP, or full referrer. `capturedAt` and BCP 47 locale are fine.
- Never block checkout on context: the builder is pure and cannot throw. Both `checkoutCreate` callers go through `executeCheckoutCreateWithContext`, which retries **once without metadata** if Saleor rejects the field (pre-3.21 runtime, or a domain error on `metadata`). Other failures (channel, network) are not retried. A future tier-2 write must swallow its own errors.
- Distinct from `paper.marketing_opt_in*` (`src/checkout/lib/marketing-consent/keys.ts`) — that is the newsletter choice for merchant apps, not attribution. Do not merge the namespaces.
- `CheckoutCreateInput.metadata` requires **Saleor ≥ 3.21**. On an older instance `pnpm generate` fails at build time (unknown field) — which is the intended signal; do not work around it with a second `updateMetadata` round trip.

---

## Anti-patterns

❌ Dropping page-view events in `beforeSend` to "save money" — you lose the denominator; turn Web Analytics off instead.
❌ Sending `?checkout=`, `/order/<key>`, search terms, or Stripe return params to any analytics destination.
❌ Ad-hoc `track()` / `gtag()` calls inside components — publish one Paper event, project per destination.
❌ Writing Commerce Context from a webhook or Server Component — the checkout mutation is the write site.
❌ Putting marketing/UTM data on the checkout without a consent check.
❌ Emitting from Server Components (cached RSC ≠ a human view).
