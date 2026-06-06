# Paper surfaces (storefront + checkout)

One Next.js project, two product surfaces, one shared handoff package.

## Layout

```text
src/app/
  (storefront)/[channel]/...   # Browse, cart, account — URL: /{channel}/...
  (checkout)/checkout/...      # Checkout — URL: /checkout?checkout=...

src/session-bridge/            # @paper/session-bridge — only cross-surface import
src/checkout/                  # Checkout UI + GraphQL (not imported by storefront)
src/lib/auth/                  # BFF session (shared); server actions for commerce
```

Route groups `(storefront)` and `(checkout)` do not appear in URLs; they separate root layouts and ownership.

## Data and caching

| Surface    | GraphQL                                                         | Freshness                          |
| ---------- | --------------------------------------------------------------- | ---------------------------------- |
| Storefront | `executePublicGraphQL` / `executeAuthenticatedGraphQL`          | Display cached (`"use cache"`)     |
| Checkout   | RSC page + server actions (`execute*GraphQL`)                   | Always fresh (`cache: "no-cache"`) |
| Auth       | `POST /api/auth/*` + `getServerAuthClient()` (HttpOnly cookies) | Always fresh                       |

Checkout page (`checkout/page.tsx`) fetches routing, `me`, and order on the server. Cart UI loads via `syncCheckoutFromServer` after routing. Sign-in posts to `/api/auth/login`; `router.refresh()` updates checkout user state.

## Handoff

1. Storefront creates/updates cart via `src/lib/checkout.ts` (cookie via `checkoutIdCookieName`).
2. Cart links use `buildCheckoutPath` or `buildCheckoutUrl` from `@paper/session-bridge`.
3. Checkout reads session from URL (`?checkout=`) via `getQueryParams` / `extractCheckoutIdFromParams`.

## Checkout entry

- Route: `src/app/(checkout)/checkout/page.tsx`
- Client root: `CheckoutApp` in `src/checkout/checkout-app.tsx` (providers only — no urql/SDK)
- Do not wrap the whole checkout tree in `dynamic(..., { ssr: false })`

## Hosted checkout-only deploy (optional)

- **Middleware + env**: block non-`/checkout` routes on the same build.
- **Fork**: omit `app/(storefront)/` for a smaller artifact.

## Anti-patterns

❌ Storefront importing `@/checkout/views` or checkout hooks  
❌ Duplicated `/checkout?checkout=` string literals — use `@paper/session-bridge`  
❌ Browser → Saleor for login or header `me` — use BFF + `getHeaderUser()`  
❌ `searchParams` inside `"use cache"` functions on the storefront
