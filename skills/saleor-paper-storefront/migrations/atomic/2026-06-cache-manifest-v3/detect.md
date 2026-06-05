# Detect: cache-manifest-v3

## Already applied if

```bash
grep -E "CACHE_PROFILES|applyCacheProfile|manifestVersion" src/lib/cache-manifest.ts
grep -l "revalidate-tags" src/lib/revalidate-tags.ts 2>/dev/null
```

Both manifest helpers and `catalog`/`menus` profile mapping present.

## Conflict signals

- Global tags only (`navigation` without channel) — may need channel-scoped migration next
- `revalidateTag(tag)` single-arg only — needs Next 16 two-arg form
