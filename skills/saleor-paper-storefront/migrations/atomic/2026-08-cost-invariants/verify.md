# Verify: cost-invariants

```bash
pnpm exec tsc --noEmit
pnpm test src/lib/cache-manifest.test.ts
pnpm run build                                     # PPR dynamic-hole regressions
pnpm exec playwright test e2e/cart-chrome-sync.spec.ts   # port the spec with the fork's own product URL
```

## No private-state invalidation left

```bash
rg -n "revalidatePath|revalidateStorefrontChrome" src/app/actions.ts "src/app/(checkout)/actions.ts" src/lib/auth
```

Must return nothing (account actions use `refresh()`; the only remaining `revalidatePath` callers are the webhook route and CMS-page plans).

## Behavior

- [ ] Add to cart: badge + drawer update in the acting tab without reload
- [ ] Second tab picks up cart/auth changes on focus (one refresh, no loop); acting tab does **not** re-refresh on its own next refocus
- [ ] Login and logout: both tabs converge; logged-out tab shows signed-out chrome after focus
- [ ] Order completion clears the badge in a background storefront tab after focus
- [ ] `GET /api/cache-info` reports the bumped manifest version with `listing-all` / `listing-category` / `listing-collection` profiles and `sharedTagPattern`s
- [ ] Manual product webhook (`curl` with Bearer secret) logs sharded tags — `listing:all:{channel}` + the product's category grid — not a channel-wide listing purge
- [ ] With an upgraded paper-app: a product POST carries `collections` and the log shows per-collection listing tags, not `listing:collection-any:{channel}`
- [ ] `GET /robots.txt` disallows the fork's filter params and transactional routes
- [ ] A new `next/image` import outside the allowlist fails `pnpm run lint`

Record: `2026-08-cost-invariants` / merged SHA
