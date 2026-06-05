# Verify: channel-scoped-tags

```bash
pnpm exec tsc --noEmit
pnpm test src/lib/cache-manifest.test.ts
```

- [ ] Menu cache functions tag with channel-scoped tags
- [ ] Manual revalidate for one channel does not require global tag

Record: `2026-06-channel-scoped-tags` / `e0ba7249`
