# Verify: checkout-v2

```bash
pnpm exec tsc --noEmit
pnpm test src/checkout
```

Manual checklist:

- [ ] Add to cart → `/checkout?checkout=` loads with lines and correct total
- [ ] Step URLs update (`?step=contact|shipping|payment`) without full-page reload flash
- [ ] Browser Back from payment returns to shipping (after Continue used push history)
- [ ] Guest sign-in during checkout updates address book after `router.refresh()`
- [ ] Dummy or Stripe payment completes → lands on `/checkout/complete?order=` (no "session expired" flash)
- [ ] Edit cart on `/{channel}/cart` → return to checkout shows updated lines (`revalidateAuthSurfaces`)
- [ ] Header shows signed-in user after login from checkout (hard nav or chrome revalidation — not stale Router Cache)
- [ ] Expired JWT shows guest UI (not infinite loading) — `resolveSessionUser` → `guest`

Build (optional, multi-channel):

```bash
STOREFRONT_CHANNELS=aud,default-channel pnpm run build
```

Record: `2026-06-checkout-v2` / `8c415655`
