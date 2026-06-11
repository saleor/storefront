# Migration: Checkout v2 (RSC + server actions)

## Intent

Replace the legacy **client-side urql checkout** with Paper **checkout v2**:

- Server-first cart data (RSC + `CheckoutDataProvider`)
- Commerce mutations via `src/app/(checkout)/actions.ts` (not browser GraphQL)
- BFF session shared with storefront (`/api/auth/login`, `resolveSessionUser`)
- Shallow `?step=` navigation without re-running checkout RSC
- Order confirmation on `/checkout/complete?order=` (not inside active checkout)
- Extensible payment registry (`INTEGRATED_GATEWAYS`)

## Upstream reference

- **Foundation:** [`8c415655`](https://github.com/saleor/storefront/commit/8c415655) — RSC checkout, BFF auth, live cart sync
- **Rules (destination):**
  - [`../../../rules/paper-surfaces.md`](../../../rules/paper-surfaces.md) — surfaces, routes, handoff
  - [`../../../rules/checkout-management.md`](../../../rules/checkout-management.md) — data sync, steps, payment transition
  - [`../../../rules/checkout-payment-gateways.md`](../../../rules/checkout-payment-gateways.md) — Stripe/Dummy, adding gateways
  - [`../../../rules/data-auth-routes.md`](../../../rules/data-auth-routes.md) — BFF auth, `resolveSessionUser`, chrome refresh

## Prerequisites

- `2026-06-account-ppr-auth` (or equivalent BFF auth) — checkout sign-in uses the same `/api/auth/*` routes
- Fork uses Saleor transaction API payment apps (Dummy and/or Stripe) — Adyen from old `_reference` is **not** ported automatically

## Migration type

This is a **subsystem replacement** — see [Subsystem replacements](../../SKILL.md#subsystem-replacements-checkout-v2) in the migrations skill. Do **not** conceptually port the old urql checkout file-by-file. **Adopt** the upstream v2 tree, then **replay** fork customizations at extension points.

Background: [`../../references/checkout-v2-overview.md`](../../references/checkout-v2-overview.md).

## Pre-migration inventory

Complete this **before** step 1. List what the fork customized in legacy checkout so nothing is lost during adopt-then-replay.

| Fork customization               | v2 extension point                                            | How to migrate                                          |
| -------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| Custom payment (Adyen, etc.)     | `INTEGRATED_GATEWAYS` + `src/checkout/lib/payment/providers/` | Follow `checkout-payment-gateways.md` — not auto-ported |
| Extra checkout fields / metadata | `actions.ts` mutations + contact/shipping step components     | Re-wire into steps + server actions                     |
| Marketing opt-in / consent       | `src/checkout/lib/` + contact section + metadata in actions   | Fork feature — replay after base port                   |
| Analytics / GTM / pixels         | Step components or `(checkout)` layout                        | Re-mount after base port                                |
| Extra checkout step              | `flow.ts`, `updateCheckoutQuery`                              | Extend after architecture is in place                   |
| Checkout-only subdomain          | `NEXT_PUBLIC_CHECKOUT_URL`, middleware                        | Optional — see `paper-surfaces.md`                      |
| Custom step styling              | Step view components                                          | `presentation-default` — keep fork classNames           |

**Unsupported:** keeping browser-side Saleor GraphQL (urql) for checkout alongside v2.

## Out of scope

- Visual rebrand of checkout steps (presentation-default — keep fork styling)
- Automatic Adyen port — follow `checkout-payment-gateways.md` checklist
- Hosted checkout-only deploy (optional; see `paper-surfaces.md`)

## Steps

### 1. Route groups and session bridge `[architecture]`

- Add `src/app/(checkout)/` route group separate from `(storefront)/[channel]/`
- Add `src/session-bridge/` (`@paper/session-bridge`) — cookie name, `buildCheckoutPath`, `buildOrderConfirmationPath`
- Move storefront routes under `src/app/(storefront)/[channel]/` if not already
- Replace hardcoded `/checkout?checkout=` strings with `@paper/session-bridge`

### 2. Storefront handoff `[architecture]`

Checkout v2 includes the **storefront → checkout** boundary. Port or verify:

- `src/lib/checkout.ts` — `findOrCreate`, cookie `checkoutId-{channel}`, `saveIdToCookie`
- Cart drawer and cart page links — `buildCheckoutPath` / `buildCheckoutUrl` from `@paper/session-bridge` (not string literals)
- Cart mutations — call `revalidateStorefrontChrome` (or equivalent) so returning from `/{channel}/cart` shows fresh checkout data
- Add-to-cart server actions — same checkout cookie + revalidation path as upstream

A fork can pass checkout detect markers while still breaking handoff if storefront cart code was not updated.

### 3. RSC checkout entry `[architecture]`

Port:

- `src/app/(checkout)/checkout/page.tsx` — sync shell + Suspense
- `src/app/(checkout)/checkout/checkout-session-loader.tsx` — loads `?checkout=` only (not `?step=`)
- `src/checkout/checkout-app.tsx` — providers only
- `src/checkout/lib/server/get-checkout-session-data.ts` — `React.cache()` session fetches

Remove or stop using:

- Client-only checkout bootstrap that fetches cart on mount via urql
- `dynamic(..., { ssr: false })` around entire checkout tree

### 4. Client data layer `[architecture]`

Port:

- `src/checkout/providers/checkout-data.tsx` — `initialCheckout` hydrate + `refreshCheckout` / `adoptCheckoutSnapshot`
- `src/checkout/lib/checkout-sync.ts`
- `src/checkout/hooks/use-checkout.ts` — context reader (keeps `refetch` API for steps)
- `src/app/(checkout)/actions.ts` — all checkout mutations + payment transactions

Delete fork usage of:

- urql `Provider` / `useCheckoutQuery` in checkout tree
- Zustand checkout store (if present)
- `src/_reference/` Saleor checkout SDK copies (upstream removed)

Codegen: keep `src/checkout/graphql/*.graphql` + `pnpm generate:checkout` for **types and documents** — runtime uses server actions, not urql hooks.

### 5. Order confirmation split `[architecture]`

- `src/app/(checkout)/checkout/complete/page.tsx`
- `src/checkout/order-confirmation-app.tsx` + `OrderDataProvider`
- Post-payment: `navigateToOrderConfirmation()` → `window.location.replace` (not `router.replace`)
- Do **not** clear checkout cookie synchronously on `/checkout` before navigation

### 6. Step URL (shallow history) `[architecture]`

Port:

- `src/checkout/lib/checkout-search-params.ts` — `updateCheckoutQuery`, `useLiveCheckoutSearchParams`
- `src/checkout/hooks/use-checkout-step.ts` — `history: "push"` on Continue

**Rule:** step changes must **not** call `router.replace` — that re-runs checkout RSC.

### 7. Payment registry `[architecture]`

Port:

- `src/checkout/lib/payment/integrated-gateways.ts`
- `src/checkout/lib/payment/finalize-checkout-order.ts`
- `src/checkout/lib/payment/checkout-payment-completion.ts`
- Stripe shell: `stripe-checkout-completion-host.tsx` (return handler survives step unmount)

Re-wire custom payment UI to registry — do not copy monolithic `PaymentSection` from old reference.

### 8. Session management `[architecture]`

Checkout and storefront share BFF cookies. Port or verify:

- `src/lib/auth/session-auth-state.ts` — `resolveSessionUserFetch`, `isDefinitiveAuthFailure` (structured Saleor JWT codes)
- `src/lib/auth/resolve-session-user.ts`
- `src/lib/auth/revalidate-storefront-chrome.ts` — bust layout + `/checkout` after cart/auth changes
- Checkout sign-in: `loginWithBff()` + `router.refresh()` / `useRefreshCheckoutRsc()`
- Cross-surface nav after auth: hard navigation (`syncAuthSurfacesAfterSignIn`, plain `<a href>`) — see `data-auth-routes.md`

**Do not** treat every `me === null` as signed out — use `SessionAuthState` (`guest` / `authenticated` / `unavailable`).

### 9. Replay fork customizations

Using the [pre-migration inventory](#pre-migration-inventory), re-apply fork-only behavior at extension points — **after** steps 1–8 are in place.

| If you customized…       | Action                                              |
| ------------------------ | --------------------------------------------------- |
| Extra checkout step      | Add to `flow.ts`, wire `updateCheckoutQuery`        |
| Custom payment app       | Register in `INTEGRATED_GATEWAYS` + provider module |
| Checkout metadata/fields | Server actions + relevant step section              |
| Marketing / consent      | `src/checkout/lib/` module + contact step           |
| Checkout-only subdomain  | `NEXT_PUBLIC_CHECKOUT_URL` + `buildCheckoutUrl`     |
| Header link to checkout  | Use `buildCheckoutPath` from session-bridge         |
| Analytics                | Step components or checkout layout shell            |

## Verify

[`verify.md`](verify.md)

## Record

`2026-06-checkout-v2` / `8c415655`
