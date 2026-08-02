---
name: paper-surfaces
description: The two-surface model (storefront vs checkout): route groups, import boundaries, @paper/session-bridge handoff, checkout entry/data flow. Use when working across the storefront/checkout boundary.
---

# Paper surfaces (storefront + checkout)

One Next.js project, two product surfaces, one shared handoff package.

> **North star:** [`paper-architecture.md`](paper-architecture.md) — canonical Next.js stance and pillar index.

## Documentation map (checkout v2)

| Read first                                                                                        | When                                                        |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **This file**                                                                                     | Where code lives, import boundaries, routes                 |
| [`checkout-design-principles.md`](checkout-design-principles.md)                                  | UX principles for checkout UI and flow decisions            |
| [`checkout-management.md`](checkout-management.md)                                                | Cart sync, step URLs, payment → order transition, debugging |
| [`checkout-payment-gateways.md`](checkout-payment-gateways.md)                                    | Adding or changing payment apps                             |
| [`checkout-components.md`](checkout-components.md)                                                | Reusable step UI (contact, address, billing)                |
| [`data-auth-routes.md`](data-auth-routes.md)                                                      | BFF login, `resolveSessionUser`, header chrome refresh      |
| [`migrations/atomic/2026-06-checkout-v2/`](../migrations/atomic/2026-06-checkout-v2/MIGRATION.md) | Fork upgrade from urql checkout                             |

## Layout

```text
src/app/
  (storefront)/[channel]/...   # Browse, cart, account — URL: /{channel}/...
  (checkout)/checkout/...      # Checkout — /checkout?checkout=…, confirmation — /checkout/complete?order=…

src/session-bridge/            # @paper/session-bridge — only cross-surface import
src/checkout/                  # Checkout UI + GraphQL (not imported by storefront)
src/lib/auth/                  # BFF session (shared); server actions for commerce
```

Route groups `(storefront)` and `(checkout)` do not appear in URLs; they separate root layouts and ownership.

## Checkout v2 data flow

```
/checkout?checkout=Q2hlY2…
        │
        ▼
CheckoutSessionLoader (RSC)     ← reads ?checkout= only (not ?step=)
        │  fetch checkout, me, countries
        ▼
CheckoutApp (client)
        │  CheckoutDataProvider ← initialCheckout hydrate
        │  CheckoutUserProvider ← initialUser
        ▼
SaleorCheckout (steps)          ← ?step= via shallow updateCheckoutQuery()
        │
        ▼
actions.ts (server)             ← mutations, payment transactions, checkoutComplete
        │
        ▼
/checkout/complete?order=       ← hard navigation after payment (separate route)
```

## Data and caching

| Surface    | GraphQL                                                         | Freshness                          |
| ---------- | --------------------------------------------------------------- | ---------------------------------- |
| Storefront | `executePublicGraphQL` / `executeAuthenticatedGraphQL`          | Display cached (`"use cache"`)     |
| Checkout   | RSC page + server actions (`execute*GraphQL`)                   | Always fresh (`cache: "no-cache"`) |
| Auth       | `POST /api/auth/*` + `getServerAuthClient()` (HttpOnly cookies) | Always fresh                       |

`CheckoutSessionLoader` passes `initialCheckout` when `loadState === "ready"`. Order confirmation is a separate route (`checkout/complete/page.tsx` + `OrderConfirmationApp` — no cart context). Client `syncCheckoutFromServer` is a narrow fallback; normal path is RSC hydrate + `adoptCheckoutSnapshot` on refresh.

## Session (shared BFF)

Login, logout, and password reset use **Next.js API routes** — not browser Saleor SDK. Checkout and storefront share the same HttpOnly cookies.

| Concern                    | Location                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| Sign-in                    | `POST /api/auth/login` via `loginWithBff()`                                       |
| Classify `me` fetch        | `resolveSessionUser()` → `guest` / `authenticated` / `unavailable`                |
| JWT expiry detection       | `session-auth-state.ts` — structured Saleor codes (`ExpiredSignatureError`, etc.) |
| After sign-in in checkout  | `router.refresh()` or `useRefreshCheckoutRsc()`                                   |
| After sign-in → storefront | `syncAuthSurfacesAfterSignIn()` — hard nav + `revalidateStorefrontChrome`         |
| Cart/checkout cache bust   | `revalidateAuthSurfaces` after cart mutations                                     |

See `data-auth-routes.md` for Router Cache pitfalls (stale header menu) and when hard navigation is required.

## Handoff

1. Storefront creates/updates cart via `src/lib/checkout.ts` (cookie via `checkoutIdCookieName`).
2. Cart links use `buildCheckoutPath` / `buildCheckoutUrl`; post-payment navigation uses `buildOrderConfirmationPath` from `@paper/session-bridge`.
3. Checkout reads session from URL (`?checkout=`) via `getQueryParams` / `extractCheckoutIdFromParams`.

## Checkout entry

- Route: `src/app/(checkout)/checkout/page.tsx` → `CheckoutSessionLoader`
- Client root: `CheckoutApp` in `src/checkout/checkout-app.tsx` (providers only — no urql/SDK)
- Mutations: `src/app/(checkout)/actions.ts`
- Do not wrap the whole checkout tree in `dynamic(..., { ssr: false })`

## Hosted checkout-only deploy (optional)

- **Middleware + env**: block non-`/checkout` routes on the same build.
- **Fork**: omit `app/(storefront)/` for a smaller artifact.
- Set `NEXT_PUBLIC_CHECKOUT_URL` so `buildCheckoutUrl` returns absolute links from storefront.

## Anti-patterns

❌ Storefront importing `@/checkout/views` or checkout hooks  
❌ Duplicated `/checkout?checkout=` string literals — use `@paper/session-bridge`  
❌ Browser → Saleor for login or header `me` — use BFF + `getHeaderUser()`  
❌ `searchParams` inside `"use cache"` functions on the storefront  
❌ `router.replace` for checkout step-only changes — use `updateCheckoutQuery()`  
❌ Treating all `me === null` as signed out — use `resolveSessionUser` states
