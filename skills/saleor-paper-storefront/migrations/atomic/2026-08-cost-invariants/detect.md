# Detect: cost-invariants

## Already applied if

```bash
rg -q "CHROME_LOCAL_BUMP_EVENT" src/lib/chrome-sync.ts
rg -q "listing:category:\{channel\}:\{slug\}" src/lib/cache-manifest.ts
rg -q "speedInsightsSampleRate" src/lib/speed-insights.ts
```

All three → applied; record in `paper-version.json` only.

## Partial-state signals

- `refresh()` in cart actions **but** `revalidate-storefront-chrome.ts` (or `revalidateStorefrontChrome` callers) still present → step 1 half-applied; finish the removal.
- Sharded profiles in the manifest **but** `/api/revalidate` still pushes a single `product-listing:{channel}` tag → step 3 missing; the sharded entries never get busted by webhooks.
- `chrome-sync.ts` exists **but** writes bare `Date.now()` or lacks `CHROME_LOCAL_BUMP_EVENT` → pre-review version; port the uniqueness + own-bump-adoption fixes.

## Applicability

- No `src/lib/catalog/get-product-listing.ts` → fork predates the cached listing layer (upstream #1239). Step 2 becomes "adopt the upstream file wholesale"; the rest applies unchanged.
- Fork still on urql checkout (no `src/app/(checkout)/actions.ts`) → **blocked**: run `2026-06-checkout-v2` first.
- Old header refresh present (`HeaderAuthRefresh`, `header-auth-refresh.tsx`, `revalidateStorefrontChromeAction`) → step 1 applies; these are the components being replaced.
