# Detect: cache-life-profiles

## Already applied if

Any **two** of:

```bash
grep -l "paperCacheLifeProfiles" next.config.js src/lib/cache-life-profiles.ts 2>/dev/null | wc -l
# expect ≥ 1

grep -E '"catalog"|"menus"|"channels"' src/lib/cache-life-profiles.ts
# expect matches

grep -r "revalidate:" src/lib/catalog/ src/lib/menus/ 2>/dev/null | grep -v node_modules
# expect no revalidate inside "use cache" fetchers (after full batch)
```

## Applicable if

- Project uses `"use cache"` or plans Cache Components
- `next.config.js` has or will have `cacheComponents: true`

## Not applicable if

- Fork disabled Cache Components entirely (`cacheComponents: false`) — skip batch or revisit `data-caching` disable path first
