# Verify: channel-discovery-cache

```bash
pnpm exec tsc --noEmit
```

Discovery-only build (matches Vercel when only `STOREFRONT_DISCOVER_CHANNELS` is set):

```bash
set -a && [ -f .env.local ] && . .env.local && set +a
unset STOREFRONT_CHANNELS
export STOREFRONT_DISCOVER_CHANNELS=true
pnpm run build
```

- [ ] Build completes without `Uncached data was accessed outside of <Suspense>` on `[channel]/layout` or account routes
- [ ] `generateStaticParams` still emits all intended channel routes
- [ ] Unknown channel slug still returns 404

Record: `2026-06-channel-discovery-cache` / `223382c0`
