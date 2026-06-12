# `@paper/session-bridge`

Shared contract between the **storefront** surface (browse, cart) and the **checkout** surface (transactional flow).

## Rules

- **Storefront** may import `@paper/session-bridge` and must not import `@/checkout/*` UI or hooks.
- **Checkout** may import `@/checkout/*` and `@paper/session-bridge`; it must not import catalog/PDP/cached data layers.
- No React in this folder — safe for server cart code and client checkout.

## Contents

| Module             | Purpose                                                        |
| ------------------ | -------------------------------------------------------------- |
| `cookies.ts`       | `checkoutId-{channel}` cookie name                             |
| `checkout-url.ts`  | `buildCheckoutPath`, `buildOrderConfirmationPath`, URL helpers |
| `search-params.ts` | URL param map, `getQueryParams`, `createQueryString`           |

## Checkout v2

Active checkout: `/checkout?checkout=`. Order confirmation: `/checkout/complete?order=` (separate route). See [`rules/paper-surfaces.md`](../skills/saleor-paper-storefront/rules/paper-surfaces.md).

## Hosted checkout (optional)

Set `NEXT_PUBLIC_CHECKOUT_URL=https://checkout.example.com` so `buildCheckoutUrl` returns absolute links. Optional middleware can block non-checkout routes on a checkout-only deploy.
