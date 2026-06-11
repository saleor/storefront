# Paper Storefront — Checkout v2 Reference

Background for `2026-06-checkout-v2`. For upgrade steps, use [`../atomic/2026-06-checkout-v2/`](../atomic/2026-06-checkout-v2/MIGRATION.md) and [`../SKILL.md`](../SKILL.md).

## What changed

Checkout v2 is a **subsystem replacement**, not an incremental tweak inside existing checkout files. The legacy stack used client-side urql; v2 is server-first with a thin client state layer.

| Concern            | Legacy (pre–v2)                    | Checkout v2                                             |
| ------------------ | ---------------------------------- | ------------------------------------------------------- |
| Cart fetch         | urql hooks on mount                | RSC `CheckoutSessionLoader` → `initialCheckout` hydrate |
| Mutations          | Browser GraphQL                    | `src/app/(checkout)/actions.ts` server actions          |
| Auth in checkout   | Saleor SDK / urql                  | BFF `/api/auth/login` (shared with storefront)          |
| Step navigation    | `router.replace` / full nav        | Shallow `updateCheckoutQuery({ step })`                 |
| Order confirmation | Often `?order=` on active checkout | `/checkout/complete?order=` (separate route)            |
| Payment            | Monolithic payment section         | `INTEGRATED_GATEWAYS` registry                          |

**Unsupported:** keeping urql runtime alongside v2. Codegen still uses `src/checkout/graphql/*.graphql` for types and documents — runtime does not call urql hooks.

## Data flow (v2)

```
Storefront cart (/{channel}/cart)
        │  cookie: checkoutId-{channel}
        │  buildCheckoutPath / buildCheckoutUrl
        ▼
/checkout?checkout=Q2hlY2…
        │
        ▼
CheckoutSessionLoader (RSC)     ← reads ?checkout= only (not ?step=)
        │  fetch checkout, me, countries
        ▼
CheckoutApp (client)
        │  CheckoutDataProvider ← initialCheckout
        │  CheckoutUserProvider ← initialUser
        ▼
SaleorCheckout (steps)          ← ?step= via shallow updateCheckoutQuery()
        │
        ▼
actions.ts (server)             ← mutations, payment transactions, checkoutComplete
        │
        ▼
/checkout/complete?order=       ← hard navigation after payment
```

## Surfaces and import boundaries

```text
src/app/(storefront)/[channel]/...   # Browse, cart, account
src/app/(checkout)/checkout/...      # Checkout + confirmation
src/session-bridge/                  # Only cross-surface import (@paper/session-bridge)
src/checkout/                        # Checkout UI — not imported by storefront
src/lib/checkout.ts                  # Storefront cart cookie + findOrCreate (handoff)
```

Storefront must not import `@/checkout/*`. Handoff uses session-bridge URL helpers and `src/lib/checkout.ts`.

## Fork upgrade strategy

1. **Inventory** customizations (payments, fields, metadata, analytics) before porting.
2. **Adopt** upstream v2 tree wholesale as the architectural base.
3. **Replay** fork deltas at extension points — payment registry, step components, server actions — not by merging old urql code.
4. **Verify** storefront handoff (cart → checkout, stale cart after edit) and payment completion (no "session expired" flash).

## Key project files

| Purpose            | Location                                                                           |
| ------------------ | ---------------------------------------------------------------------------------- |
| RSC entry          | `src/app/(checkout)/checkout/checkout-session-loader.tsx`                          |
| Server actions     | `src/app/(checkout)/actions.ts`                                                    |
| Client state       | `src/checkout/providers/checkout-data.tsx`                                         |
| Shallow steps      | `src/checkout/lib/checkout-search-params.ts`                                       |
| Payment registry   | `src/checkout/lib/payment/integrated-gateways.ts`                                  |
| Storefront cart    | `src/lib/checkout.ts`                                                              |
| Cross-surface URLs | `src/session-bridge/`                                                              |
| Timeless rules     | `skills/saleor-paper-storefront/rules/paper-surfaces.md`, `checkout-management.md` |

## Anti-patterns

- urql `Provider` / `useCheckoutQuery` in checkout runtime
- `router.replace` for step-only changes inside `/checkout`
- Clearing checkout cookie before order confirmation navigation
- Storefront importing checkout views or hooks
- Conceptually porting urql checkout into v2 instead of adopt-then-replay
