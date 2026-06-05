# Verify: channel-allowlist

```bash
pnpm exec tsc --noEmit
pnpm test src/config/channels.test.ts 2>/dev/null || true
```

- [ ] Disallowed channel URL returns 404
- [ ] Allowlisted channels work
- [ ] Footer shows selector only when multiple storefront channels
- [ ] If using `STOREFRONT_DISCOVER_CHANNELS`: apply [`2026-06-channel-discovery-cache`](../2026-06-channel-discovery-cache/MIGRATION.md) and verify discovery-only build (see that migration's `verify.md`)

Record: `2026-06-channel-allowlist` / `3553c93e`
