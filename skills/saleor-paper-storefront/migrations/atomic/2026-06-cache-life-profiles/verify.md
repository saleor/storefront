# Verify: cache-life-profiles

## Automated

```bash
pnpm exec tsc --noEmit
```

## Grep checks

- [ ] `src/lib/cache-life-profiles.ts` exports `catalog`, `menus`, `channels` profile names
- [ ] `next.config.js` registers custom `cacheLife` profiles from Paper data file
- [ ] No `revalidate: 300` (or similar) on fetches inside `"use cache"` in catalog/menu/homepage getters

## Behavioral

- [ ] Dev server starts without next.config cacheLife errors
- [ ] Cached pages still load (TTL fallback works without webhooks)

## Record

Update `paper-version.json` → `2026-06-cache-life-profiles` / `9f662a68`.
