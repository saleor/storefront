---
name: data-analytics
description: Analytics and order attribution in Paper — Web Analytics toggle, consent mode, first-touch UTM snapshot, optional merchant tag (env-gated), PaperCommerceEvent bus, URL redaction, and Commerce Context metadata on checkout for order origin. Use when adding tracking, custom events, consent, page-view cost questions, or order-origin/marketing attribution metadata.
---

# Data Analytics

How Paper measures itself without leaking shopper data or multiplying the host bill, and how it writes **order attribution** onto the checkout. Saleor stays the revenue ledger; analytics tools count behaviour, never money.

> Read together with [`paper-vercel-cost`](paper-vercel-cost.md) (per-visit beacons multiply by traffic), [`checkout-management`](checkout-management.md) (shallow `?step=` URLs, `?checkout=` id), [`checkout-guest-order`](checkout-guest-order.md) (`/order/{key}` HMAC tokens).

---

## Lanes

| Lane                 | What it answers                                   | Status                                                                                                       |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Speed Insights**   | Is the storefront fast? (CWV by route)            | Shipped, sampled 1% — see `paper-vercel-cost` §4                                                             |
| **Web Analytics**    | How many humans, on which routes? (denominator)   | Shipped — `<WebAnalytics />` in both root layouts, env-toggled, URLs redacted                                |
| **Commerce Context** | Where did each _order_ come from? (attribution)   | Tier 1 + 2 — `origin`/`ext.paper` on create; `marketing`/`session` fill-missing before complete if consented |
| **Commerce events**  | Where do shoppers drop between view and purchase? | One Paper event union; Web Analytics always; optional merchant tag is env-gated and consent-gated            |

Same **moments**, different **payloads**: Web Analytics gets two flat, low-cardinality props; the merchant tag gets recommended event names on **client** events (no `items[]`); Commerce Context is order-level JSON on Saleor metadata. Never make one lane carry another's payload. Add-to-cart and purchase stay on Web Analytics until a server tag adapter exists.

Attribution consumers read Commerce Context off the **order**. Paper never imports that code — only the key names in `commerce-context/keys.ts`.

---

## Web Analytics

```
src/lib/analytics/web-analytics.ts  webAnalyticsEnabled() — env toggle (server), tested
src/lib/analytics/redact-url.ts     redactAnalyticsUrl() — pure, tested
src/ui/components/web-analytics.tsx "use client" leaf: <Analytics beforeSend={redact} />
src/app/(storefront)/[locale]/layout.tsx · src/app/(checkout)/layout.tsx   mount sites
```

- **Toggle.** Default on when the build runs on Vercel (`VERCEL=1`), off elsewhere; `NEXT_PUBLIC_VERCEL_WEB_ANALYTICS=0|1` overrides. It is a boolean because Web Analytics has **no sampling knob** — one event per navigation, billed per event. That is what makes it the page-view denominator the cost model otherwise lacks; do not "sample" it by dropping events in `beforeSend`.
- **Enable it in the project UI too** (Analytics tab). Until then the script 404s — harmless, but an Edge Request per page for nothing. Non-Vercel forks leave it off.
- **Redaction is not optional.** Paper URLs carry bearer-like values: `?checkout=<id>`, `/order/<hmac-token>`, `payment_intent_client_secret`, account-confirmation `email` + `token`, free-text `?query=`. `redactAnalyticsUrl` strips those (exact names + any param matching `secret|token|password|email|session|auth`) and rewrites `/order/<key>` → `/order/[key]`. Extend the denylist when a new secret-bearing param appears; add a test case in `redact-url.test.ts`.
- **It is a client leaf** because `beforeSend` is a function and cannot cross the RSC boundary. The SDK wraps itself in `Suspense` (it reads `useSearchParams`), so PPR shells stay static — same as Speed Insights.
- **Verified against `@vercel/analytics` 2.0.1:** `beforeSend` is queued inside `inject()` before the script loads, so the very first page view is redacted too; the script sends the `url` _returned_ by `beforeSend` (route pattern travels separately); internal referrers are never sent, external ones only on the first view. Re-check these three facts when bumping the package.
- **Custom events** go through the Paper event union (`emitCommerceEvent`), never ad-hoc `track()` / `gtag()` in components. Budget: two custom properties per event; keep values low-cardinality (channel slugs, step names, booleans, amounts) — never ids, emails, or search text.

---

## Consent

```
src/lib/analytics/consent.ts              required (default) | implied — tested
src/lib/analytics/cookies.ts              paper_analytics_consent | _landing | _sid
src/lib/analytics/browser.ts              first-touch persist, window.paperAnalytics, tag deliver
src/ui/components/analytics-mount.tsx     both root layouts — first-touch in shell, page views in Suspense
```

- **`NEXT_PUBLIC_ANALYTICS_CONSENT_MODE`**. `required` (default): storage-derived work stays off until a fork banner calls `window.paperAnalytics.setConsent("granted")`. `implied`: visiting is enough (`origin.consent` = `not_required`). Paper core ships **no banner**.
- **Web Analytics and Speed Insights are not gated.** They are cookieless / first-party performance beacons. Consent gates the **merchant tag** and the first-touch cookie.
- **Ads consents stay denied** even after grant. Paper has no ad pixels; do not flip `ad_storage` from core.
- **Not the newsletter box.** `paper.marketing_opt_in*` is a different namespace.
- Fork API: `window.paperAnalytics.setConsent("granted" | "denied")` and `.getConsent()`. Cookie lives 180 days, `SameSite=Lax`.

Under `required` with no banner, complete-time consent is `unknown` — **no** `marketing` / `session` on the order. That is intended.

## First-touch snapshot

`captureLandingSnapshot(href)` copies `utm_source|medium|campaign|term|content` and a redacted `landingPath` (secrets stripped, `utm_*` and click ids removed). No full referrer.

- **`implied` or `granted`:** first-wins cookie `paper_analytics_landing` (30 days) + session-scoped `paper_analytics_sid`.
- **`required` and no decision yet:** pending snapshot in `sessionStorage` only; promote on grant; wipe on deny.
- **Written on the checkout before complete** (fill-missing) when `origin.consent` is `granted` or `not_required`. See Commerce Context below.

## Merchant tag (off by default)

```
src/lib/analytics/ga4.ts                  NEXT_PUBLIC_GA_MEASUREMENT_ID (G-*) — tested
src/lib/analytics/destinations/ga4.ts     recommended names (tested) — no items[]
src/ui/components/google-analytics.tsx    consent defaults + loader
```

- Unset or invalid measurement id ⇒ no third-party tag (ids must be `G-…`; no tag-manager containers).
- Consent defaults: `required` → `analytics_storage=denied`; `implied` → `granted`. Automatic page views are **off** so the first hit cannot leak `?checkout=` / `/order/<key>`. `AnalyticsPathnameViews` sends a redacted `page_view` on **pathname** change only (checkout `?step=` is not a page view). `page_path` and the sessionStorage claim key are `landingPathFromHref` — never the raw Next pathname (guest `/order/<hmac>`).
- Client commerce events go through `projectGa4` → `gtag("event", …)` when storage is allowed. Contact is skipped (no recommended equivalent). Search has no query text.
- **Add-to-cart and purchase stay on Web Analytics only** until a server-side tag adapter exists. Those emit sites are Server Actions.

## Event bus

```
src/lib/analytics/catalog.ts              PaperCommerceEvent
src/lib/analytics/emit.server.ts          ATC + purchase; after() + track({ headers }) — SDK drops events without headers
src/lib/analytics/emit.client.ts          begin_checkout, checkout_step, search (+ tag when consented)
src/lib/analytics/destinations/vercel.ts  two flat props (tested)
src/lib/analytics/destinations/ga4.ts     recommended names; server delivery not shipped
src/lib/analytics/destinations/console.ts development only
src/lib/analytics/claim.ts                sessionStorage dedup for begin_checkout / search / page_view
```

| Moment               | Paper name              | Web Analytics                     | Tag (consented, client only)                               | Emit site                                                           |
| -------------------- | ----------------------- | --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Added to cart        | `product_added_to_cart` | `add_to_cart {channel, value}`    | — (server emit)                                            | PDP Server Action, after `checkoutLinesAdd` succeeds, via `after()` |
| Checkout entered     | `checkout_started`      | `begin_checkout {channel, value}` | `begin_checkout {currency,value}`                          | `CheckoutCommerceEvents` client mount, `claimBeginCheckout(id)`     |
| Checkout step viewed | `checkout_step_viewed`  | `checkout_step {step, channel}`   | `add_shipping_info` / `add_payment_info` (contact skipped) | Same client, on shallow `?step=` change                             |
| Purchase             | `checkout_completed`    | `purchase {currency, value}`      | — (server emit)                                            | `runCheckoutComplete` after Saleor returns an order id              |
| Search               | `search_submitted`      | `search {zero, channel}`          | `search` (no query text)                                   | First page of `/search` only (no cursor)                            |

A new destination is a projector over the same union. Do not retouch PDP or checkout complete.

**Rules:**

- Never emit behavioural events from a Server Component render (cached RSC ≠ a human view; checkout RSC re-renders on refresh).
- Never emit ATC from the button click — only from a successful mutation.
- `begin_checkout` is claimed once per checkout id in `sessionStorage`. A missing storage API (SSR) does not emit.
- Client `emit` must not gate on `webAnalyticsEnabled()` — `VERCEL` is not a `NEXT_PUBLIC_*` var, so the browser would always see "off". The SDK no-ops when `<WebAnalytics />` is not mounted.
- Search text never leaves the browser; zero-result is a boolean.
- `transactionId` stays on the Paper event for a future server tag adapter; it is not a Web Analytics property.

---

## Commerce Context (order attribution)

Sectioned **public metadata** `commerce.context.{origin,marketing,actors,experiment,session}` + `commerce.context.ext.<vendor>`. Paper writes on the **checkout**; Saleor copies checkout public metadata onto the order at `checkoutComplete`, so there is no order-side write. Pulse composes those keys on `ORDER_CREATED` and ranks **Origins** on Financial. Public recipe: [Pulse Commerce Context](https://docs.saleor.io/developer/app-store/apps/pulse/commerce-context) (source: `saleor-docs` `docs/developer/app-store/apps/pulse/commerce-context.mdx`).

```
src/lib/commerce-context/keys.ts                      key names + owner notes (spec copy)
src/lib/commerce-context/checkout-create.ts           tier-1 builder (pure)
src/lib/commerce-context/checkout-create-context.ts   reads the consent cookie, then the builder
src/lib/commerce-context/checkout-complete.ts         tier-2 fill-missing builder (pure, tested)
src/checkout/lib/server/enrich-commerce-context.ts    cookies + checkout metadata + updateMetadata
src/graphql/CheckoutCreate.graphql                    $metadata on create
src/checkout/graphql/checkout.graphql                 create + checkoutCommerceContext + updateMetadata
```

**Two write tiers:**

| Tier | Sections               | When                                                     | Consent                                                                      |
| ---- | ---------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1    | `origin`, `ext.paper`  | On `checkoutCreate`, in the same mutation                | `origin.consent` is recorded; no UTM/session storage is read into these keys |
| 2    | `marketing`, `session` | `updateMetadata` before `checkoutComplete`, fill-missing | Only when `origin.consent` is `granted` or `not_required`                    |

Why tier 1 alone matters: `origin` present ⇒ coverage `valid`, so storefront orders are separable from POS / draft / import / API before any marketing attribution exists — and with **zero extra round trips**, because it rides the mutation Paper already sends. Both `checkoutCreate` callers (`Checkout.create` on the storefront, `recoverOrphanedCheckout` on the checkout surface) pass it.

**Rules:**

- Paper's **browse storefront** owns `origin`, `marketing`, `session`, `ext.paper`. It never writes `experiment` or any `pulse.*` key. It never writes `actors` — unless Paper also owns that identity (the dedicated agent route writes `actors.agent`).
- No PII, ever: no email, customer id, address, IP, or full referrer. `capturedAt` and BCP 47 locale are fine.
- Always set `origin.consent`. Same enum everywhere:

| Value          | When Paper (or a Paper-owned route) uses it                              | `marketing` / `session`        |
| -------------- | ------------------------------------------------------------------------ | ------------------------------ |
| `granted`      | Shopper called `setConsent("granted")`                                   | Fill-missing if data existed   |
| `denied`       | Shopper called `setConsent("denied")`                                    | Absent                         |
| `not_required` | Storefront `implied` mode, **or** no shopper cookie (agent, POS, import) | Allowed if the writer has data |
| `unknown`      | Storefront `required` and no decision yet (default: no banner)           | Skip — do not guess            |

Write `denied` rather than omitting the field. Agents do **not** go through the banner/`setConsent` path.

- Never block checkout on context: both builders are pure. Tier 2 (`enrichCheckoutCommerceContext`) swallows read/write errors and still lets `checkoutComplete` run. Skip the Saleor read/write entirely when consent is still `unknown` (default Paper: required, no banner — origin was written at create and marketing is not allowed). Best-effort calls use `maxRetries: 0` and a 1.5s timeout — do not inherit the catalog client's 3×15s retry. Skip the write entirely if the metadata read fails — do not guess fill-missing. Do **not** retry `checkoutCreate` without metadata — Paper's floor is Saleor 3.23+, where `CheckoutCreateInput.metadata` is required API.
- Re-send `origin` at complete only when `consent` changed (or the key is missing). Keep the original `capturedAt` and a valid `surface` / `system` already on the checkout — do not rewrite a non-storefront origin to Paper's default. Never write `session.anonymousId`.
- Distinct from `paper.marketing_opt_in*` (`src/checkout/lib/marketing-consent/keys.ts`) — that is the newsletter choice for merchant apps, not attribution. Do not merge the namespaces.

### Agent / dedicated route

A Paper-owned agent checkout is a different **surface**, not a storefront visitor who skipped the banner.

On `checkoutCreate` (do not reuse `buildCheckoutCreateContextMetadata` — it hard-codes `surface: "storefront"`):

```json
{
	"commerce.context.origin": {
		"surface": "agent",
		"system": "paper",
		"capturedAt": "…",
		"consent": "not_required"
	},
	"commerce.context.actors": {
		"agent": { "type": "mcp", "id": "…" }
	}
}
```

`not_required` means there is no shopper cookie to ask about — same bucket as a till. `unknown` is reserved for the human storefront while `required` has no decision yet. Do not copy `paper_analytics_*` cookies, do not call `setConsent`, and do not write shopper first-touch `marketing` onto an agent order unless the agent sent its own explicit campaign payload. Ids in `actors.agent` are opaque (type + id), never email.

Complete-time enrich is shopper-cookie work. It no-ops when the browser consent is still `unknown`, and it no-ops when `origin.surface` is a recognized non-storefront (agent, POS, import, …) — including `not_required`. The agent route must get create-time origin right; enrich will not promote a storefront origin to `agent`, rewrite agent consent from the banner, or stamp first-touch UTMs onto that order.

---

## Anti-patterns

❌ Dropping page-view events in `beforeSend` to "save money" — you lose the denominator; turn Web Analytics off instead.
❌ Sending `?checkout=`, `/order/<key>`, search terms, or payment-return params to any analytics destination.
❌ Ad-hoc `track()` / `gtag()` calls inside components — publish one Paper event, project per destination.
❌ Writing Commerce Context from a webhook or Server Component — the checkout mutation is the write site.
❌ Putting marketing/UTM data on the checkout without a consent check.
❌ Writing Commerce Context _after_ `checkoutComplete` — Saleor already copied metadata; consumers read the order.
❌ Emitting from Server Components (cached RSC ≠ a human view).
❌ Loading a tag manager or flipping `ad_storage` from Paper core.
❌ Gating Web Analytics on the consent cookie — it is the cookieless denominator.
❌ Sending a tag `page_view` with automatic page views on — the first hit would include secrets.
❌ Reusing the storefront create builder (or shopper landing cookies / `setConsent`) for an agent checkout — it would rank as web traffic.
