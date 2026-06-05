# Verify: cache-manifest-v3

```bash
pnpm exec tsc --noEmit
pnpm test src/lib/cache-manifest.test.ts
```

## Checklist

- [ ] `src/lib/cache-manifest.ts` maps tags to `catalog` / `menus` / `channels`
- [ ] `src/lib/revalidate-tags.ts` exists and batches revalidation
- [ ] `/api/revalidate` uses manifest + profile argument
- [ ] Unit tests pass (port tests if fork lacks them)

## Record

`2026-06-cache-manifest-v3` / `9f662a68`
