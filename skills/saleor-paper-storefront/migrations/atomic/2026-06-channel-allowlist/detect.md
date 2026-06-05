# Detect: channel-allowlist

## Already applied if

```bash
test -f src/config/channels.ts
grep -q STOREFRONT_CHANNELS src/config/channels.ts .env.example 2>/dev/null
```

## Skip heuristic

Single-channel shop with one env default — ask user if allowlist adds value.
