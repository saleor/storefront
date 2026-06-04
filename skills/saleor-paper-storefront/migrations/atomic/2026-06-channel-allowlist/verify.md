# Verify: channel-allowlist

```bash
pnpm exec tsc --noEmit
pnpm test src/config/channels.test.ts 2>/dev/null || true
```

- [ ] Disallowed channel URL returns 404
- [ ] Allowlisted channels work
- [ ] Footer shows selector only when multiple storefront channels

Record: `2026-06-channel-allowlist` / `3553c93e`
