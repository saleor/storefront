# Detect: channel-discovery-cache

## Needs migration if

Discovery enabled and channel-slugs still uses uncached GraphQL:

```bash
grep -q 'executePublicGraphQL(ChannelsListDocument' src/lib/channel-slugs.ts 2>/dev/null
```

Or discovery path does not use cached list:

```bash
needsAsyncChannelDiscovery && ! grep -q getCachedChannelsList src/lib/channel-slugs.ts
```

(Only relevant when fork uses `STOREFRONT_DISCOVER_CHANNELS`.)

## Already applied if

```bash
grep -q getCachedChannelsList src/lib/channel-slugs.ts
grep -q activeChannelSlugsFromList src/lib/channel-slugs.ts
! grep -q 'executePublicGraphQL(ChannelsListDocument' src/lib/channel-slugs.ts 2>/dev/null
```

## Skip if

Fork never uses API discovery (only `STOREFRONT_CHANNELS` or single default channel):

```bash
! grep -q STOREFRONT_DISCOVER_CHANNELS .env.example src/config/channels.ts 2>/dev/null
```
