# Detect: channel-scoped-tags

## Already applied if

```bash
grep -E "navigation:\{|footer-menu:\{" src/lib/cache-manifest.ts
grep -q getStorefrontChannelSlugs src/lib/channel-slugs.ts
```

## Skip heuristic

Single channel only (`NEXT_PUBLIC_DEFAULT_CHANNEL` set, no multi-channel footer selector) — present skipPrompt to user.
