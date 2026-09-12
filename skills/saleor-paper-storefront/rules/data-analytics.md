---
name: data-analytics
description: Analytics and order attribution in Paper — Vercel Web Analytics, consent mode, first-touch UTM snapshot, GA4 Consent Mode v2 (env-gated), PaperCommerceEvent bus, URL redaction, and Commerce Context metadata on checkoutCreate for Saleor Pulse. Use when adding tracking, GA4/pixels, custom events, consent banners, page-view cost questions, or order-origin/marketing attribution metadata.
---

# Data Analytics

How Paper measures itself without leaking shopper data or multiplying the Vercel bill, and how it hands **order attribution** to Saleor Pulse. Saleor stays the revenue ledger; analytics tools count behaviour, never money.

> Read together with [`paper-vercel-cost`](paper-vercel-cost.md) (per-visit beacons multiply by traffic), [`checkout-management`](checkout-management.md) (shallow `?step=` URLs, `?checkout=` id), [`checkout-guest-order`](checkout-guest-order.md) (`/order/{key}` HMAC tokens).

---

## Lanes

| Lane                           | What it answers                                   | Status                                                                                                                  |
| ------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Speed Insights**             | Is the storefront fast? (CWV by route)            | Shipped, sampled 1% — see `paper-vercel-cost` §4                                                                        |
| **Vercel Web Analytics**       | How many humans, on which routes? (denominator)   | Shipped — `<WebAnalytics />` in both root layouts, env-toggled, URLs redacted                                           |
| **Commerce Context → Pulse**   | Where did each _order_ come from? (attribution)   | Tier 1 shipped — `origin` (+ `consent` marker) + `ext.paper` on `checkoutCreate`; `marketing`/`session` wait on phase 3 |
| **Commerce events (GA4 etc.)** | Where do shoppers drop between view and purchase? | Phase 2 shipped — one Paper event union; Vercel always; GA4 env-gated + Consent Mode v2                                 |

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
- **Custom events** go through the Paper event union (`emitCommerceEvent`), never ad-hoc `track()` / `gtag()` in components. Budget: Pro = 2 custom properties per event; keep values low-cardinality (channel slugs, step names, booleans, amounts) — never ids, emails, or search text.

---

## Consent

```
src/lib/analytics/consent.ts              required (default) | implied — tested
src/lib/analytics/cookies.ts              paper_analytics_consent | _landing | _sid
src/lib/analytics/browser.ts              first-touch persist, window.paperAnalytics, gtag deliver
src/ui/components/analytics-mount.tsx     both root layouts
```

- **`NEXT_PUBLIC_ANALYTICS_CONSENT_MODE`**. `required` (default): storage-derived work stays off until a fork banner calls `window.paperAnalytics.setConsent("granted")`. `implied`: visiting is enough (`origin.consent` = `not_required`). Paper core ships **no banner**.
- **Vercel Web Analytics and Speed Insights are not gated.** They are cookieless / first-party performance beacons. Consent gates **GA4** and the first-touch cookie.
- **Ads consents stay denied** even after grant. Paper has no ad pixels; do not flip `ad_storage` from core.
- **Not the newsletter box.** `paper.marketing_opt_in*` is a different namespace.
- Fork API: `window.paperAnalytics.setConsent("granted" | "denied")` and `.getConsent()`. Cookie lives 180 days, `SameSite=Lax`.

## First-touch snapshot

`captureLandingSnapshot(href)` copies `utm_source|medium|campaign|term|content` and a redacted `landingPath` (secrets stripped, `utm_*` removed so they are not duplicated). No full referrer, no `gclid`/`fbclid`.

- **`implied` or `granted`:** first-wins cookie `paper_analytics_landing` (30 days) + session-scoped `paper_analytics_sid`.
- **`required` and no decision yet:** pending snapshot in `sessionStorage` only; promote on grant; wipe on deny.
- **Not written to Saleor yet.** Phase 3 `updateMetadata` will copy this onto `commerce.context.marketing` / `session` (fill-missing) when `origin.consent` is `granted` or `not_required`.

## GA4 (off by default)

```
src/lib/analytics/ga4.ts                  NEXT_PUBLIC_GA_MEASUREMENT_ID (G-*) — tested
src/lib/analytics/destinations/ga4.ts     recommended names (tested)
src/ui/components/google-analytics.tsx    Consent Mode v2 defaults + gtag.js
```

- Unset measurement id ⇒ no Google script. Invalid values are ignored (no GTM, no UA).
- Consent defaults: `required` → `analytics_storage=denied`; `implied` → `granted`. `send_page_view` is **false** so the first hit cannot leak `?checkout=` / `/order/<key>`. `AnalyticsRuntime` sends a redacted `page_view` on **pathname** change only (checkout `?step=` is not a page view). `page_path` is `landingPathFromHref` — never the raw Next pathname (guest `/order/<hmac>`).
- Client commerce events go through `projectGa4` → `gtag("event", …)` when storage is allowed. Contact is skipped (no GA equivalent). Search has no `search_term`.
- **ATC and purchase stay Vercel-only until phase 4** (Measurement Protocol). Those emit sites are Server Actions.

## Event bus

```
src/lib/analytics/catalog.ts              PaperCommerceEvent — Shopify-shaped names
src/lib/analytics/emit.server.ts          ATC + purchase; after() + track({ headers }) — SDK drops events without headers
src/lib/analytics/emit.client.ts          begin_checkout, checkout_step, search (+ GA when consented)
src/lib/analytics/destinations/vercel.ts  two flat props (tested)
src/lib/analytics/destinations/ga4.ts     recommended names; server delivery is phase 4
src/lib/analytics/destinations/console.ts development only
src/lib/analytics/claim.ts                sessionStorage dedup for begin_checkout / search / page_view
```

| Moment               | Paper name              | Vercel slug                       | Emit site                                                           |
| -------------------- | ----------------------- | --------------------------------- | ------------------------------------------------------------------- |
| Added to cart        | `product_added_to_cart` | `add_to_cart {channel, value}`    | PDP Server Action, after `checkoutLinesAdd` succeeds, via `after()` |
| Checkout entered     | `checkout_started`      | `begin_checkout {channel, value}` | `CheckoutCommerceEvents` client mount, `claimBeginCheckout(id)`     |
| Checkout step viewed | `checkout_step_viewed`  | `checkout_step {step, channel}`   | Same client, on shallow `?step=` change                             |
| Purchase             | `checkout_completed`    | `purchase {currency, value}`      | `runCheckoutComplete` after Saleor returns an order id              |
| Search               | `search_submitted`      | `search {zero, channel}`          | First page of `/search` only (no cursor)                            |

A new destination is a projector over the same union. Do not retouch PDP or checkout complete.

**Rules:**

- Never emit behavioural events from a Server Component render (cached RSC ≠ a human view; checkout RSC re-renders on refresh).
- Never emit ATC from the button click — only from a successful mutation.
- `begin_checkout` is claimed once per checkout id in `sessionStorage`. A missing storage API (SSR) does not emit.
- Search text never leaves the browser; zero-result is a boolean.
- `transactionId` is a GA `purchase` param on the client projector; it is not a Vercel property. Server purchase does not call gtag (phase 4).

---

## Commerce Context (Saleor Pulse attribution)

Pulse composes sectioned **public metadata** on `ORDER_CREATED`: `commerce.context.{origin,marketing,actors,experiment,session}` + `commerce.context.ext.<vendor>`. Paper writes on the **checkout**; Saleor copies checkout public metadata onto the order at `checkoutComplete`, so there is no order-side write.

```
src/lib/commerce-context/keys.ts             key names + owner notes (spec copy — Paper never imports Pulse code)
src/lib/commerce-context/checkout-create.ts          builder (pure; caller passes origin.consent)
src/lib/commerce-context/checkout-create-context.ts  reads the consent cookie, then the builder
src/graphql/CheckoutCreate.graphql           $metadata: [MetadataInput!] on the create input
src/checkout/graphql/checkout.graphql        same, checkout surface (recoverOrphanedCheckout)
```

**Two write tiers:**

| Tier | Sections               | When                                                | Consent                                                                      |
| ---- | ---------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1    | `origin`, `ext.paper`  | On `checkoutCreate`, in the same mutation           | `origin.consent` is recorded; no UTM/session storage is read into these keys |
| 2    | `marketing`, `session` | `updateMetadata` before complete, fill-missing only | Only when `origin.consent` is `granted` or `not_required` (planned)          |

Why tier 1 alone matters: `origin` present ⇒ Pulse coverage `valid`, so merchants can separate storefront orders from POS / draft / import / API before any marketing attribution exists — and with **zero extra round trips**, because it rides the mutation Paper already sends. Both `checkoutCreate` callers (`Checkout.create` on the storefront, `recoverOrphanedCheckout` on the checkout surface) pass it.

**Rules:**

- Paper owns `origin`, `marketing`, `session`, `ext.paper`. Never write `actors` / `experiment` (affiliate / A-B tooling own those) and never any `pulse.*` key.
- No PII, ever: no email, customer id, address, IP, or full referrer. `capturedAt` and BCP 47 locale are fine.
- Always set `origin.consent` now that Paper has a consent primitive (`granted` / `denied` / `not_required` / `unknown`). Write `denied` rather than omitting the field.
- Never block checkout on context: the builder is pure and cannot throw. A future tier-2 write must swallow its own errors. Do **not** retry `checkoutCreate` without metadata — Paper's floor is Saleor 3.23+, where `CheckoutCreateInput.metadata` is required API.
- Distinct from `paper.marketing_opt_in*` (`src/checkout/lib/marketing-consent/keys.ts`) — that is the newsletter choice for merchant apps, not attribution. Do not merge the namespaces.

---

## Anti-patterns

❌ Dropping page-view events in `beforeSend` to "save money" — you lose the denominator; turn Web Analytics off instead.
❌ Sending `?checkout=`, `/order/<key>`, search terms, or Stripe return params to any analytics destination.
❌ Ad-hoc `track()` / `gtag()` calls inside components — publish one Paper event, project per destination.
❌ Writing Commerce Context from a webhook or Server Component — the checkout mutation is the write site.
❌ Putting marketing/UTM data on the checkout without a consent check.
❌ Emitting from Server Components (cached RSC ≠ a human view).
❌ Loading GTM or flipping `ad_storage` from Paper core.
❌ Gating Vercel Web Analytics on the consent cookie — it is the cookieless denominator.
❌ Sending GA `page_view` with `send_page_view: true` — the first hit would include secrets.
