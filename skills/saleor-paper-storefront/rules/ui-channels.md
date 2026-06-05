# Channels & Multi-Currency

Configure multi-channel and multi-currency support. This storefront supports multiple Saleor channels, each with its own currency. Understanding the underlying fulfillment model helps debug "product not purchasable" issues.

> **Source**: [Saleor Docs - Stock Overview](https://docs.saleor.io/developer/stock/overview) - Fulfillment triangle and stock allocation

## How Channels Work

```
URL: /uk/products/...  →  Channel "uk" (GBP)
URL: /us/products/...  →  Channel "us" (USD)
```

- Currency comes from the channel settings in Saleor
- Channel selector appears in the footer (shows currency codes)
- Checkout inherits the channel from where the cart was created

## Saleor Commerce Model

Channels don't exist in isolation. Product purchasability depends on three connected entities:

```
        CHANNEL                 SHIPPING ZONE              WAREHOUSE
     (sales storefront)       (delivery region)         (inventory location)
            │                        │                        │
            ├────── assigned to ─────┤                        │
            │                        ├──── fulfills from ─────┤
            ├──────────── assigned to ────────────────────────┤
```

**All three connections must exist for a product to be purchasable.**

### Purchasability Checklist

When debugging why a product can't be purchased in a channel, verify all 7 conditions:

1. Product is **published** in the channel
2. Product is **available for purchase** in the channel
3. At least one variant has a **price** in the channel
4. Channel has at least one active **shipping zone**
5. That shipping zone has at least one **warehouse**
6. That warehouse has **stock** for the variant
7. That warehouse is also **assigned to the channel**

### Unreachable Stock

A warehouse assigned to a channel but **not** to any shipping zone for that channel results in "unreachable" stock -- it exists in the system but customers cannot buy it. This is the most common cause of confusing `isAvailable: false` on products that appear to have inventory.

### Why Products Differ Across Channels

The same product can be purchasable in one channel and not another because:

- **Different warehouses** are assigned to each channel
- **Different shipping zones** cover different countries per channel
- **Stock levels** vary per warehouse
- **Pricing** may only be set in certain channels

## Environment Setup

### Required for Channel Selector

The channel selector requires `SALEOR_APP_TOKEN` to fetch the channels list.

```env
# .env.local (keep secret, never commit)
SALEOR_APP_TOKEN=your-app-token
```

**Security:** This token is used server-side only. Keep it in `.env.local` for development and set it as a secret environment variable in production (e.g., Vercel environment variables).

**Without this token:** The channel list cannot be fetched. Channels would need to be hardcoded in `src/config/static-pages.ts` or the selector won't appear.

### Creating the App Token

The `channels` query requires an authenticated app token. No specific permission is needed just to list channels.

1. Open **Saleor Dashboard**
2. Go to **Extensions → Add extension → "Provide details manually"**
3. Fill in:
   - Name: `Storefront` (or any name)
   - Permissions: none required for channel listing
4. Save and copy the generated token
5. Add to `.env.local` as `SALEOR_APP_TOKEN`

## Storefront Channel Allowlist

Not every Saleor channel should become a storefront route. Use an explicit allowlist in production:

```env
# Recommended — only these channels get /{channel}/... routes
STOREFRONT_CHANNELS=us,uk

# Default channel (must be in allowlist when allowlist is set)
NEXT_PUBLIC_DEFAULT_CHANNEL=us

# Optional — discover additional channels from Saleor API at build time
# Requires SALEOR_APP_TOKEN; merged with allowlist, not a replacement
STOREFRONT_DISCOVER_CHANNELS=true
```

**Resolution order** (`src/lib/channel-slugs.ts` → `getStorefrontChannelSlugs()`):

1. `STOREFRONT_CHANNELS` — comma-separated allowlist (recommended)
2. If `STOREFRONT_DISCOVER_CHANNELS=true` — slugs from `getCachedChannelsList()` (`"use cache"`; required for PPR builds)
3. Fallback — `NEXT_PUBLIC_DEFAULT_CHANNEL` only

### Where the allowlist is enforced

| Location                          | Behavior                                                |
| --------------------------------- | ------------------------------------------------------- |
| `src/app/[channel]/layout.tsx`    | `generateStaticParams` + `notFound()` for unknown slugs |
| `src/app/api/revalidate/route.ts` | Path revalidation loops over allowed channels only      |
| `src/ui/components/footer.tsx`    | Channel selector lists allowed channels                 |

See `data-caching.md` for how webhooks use `getStorefrontChannelSlugs()` during invalidation.

## Architecture

### Storefront (channel in URL)

```
src/app/[channel]/          # All routes are channel-scoped
src/app/[channel]/(main)/   # Main store pages
```

Channel is read from URL params and passed to GraphQL queries.

### Checkout (channel from checkout object)

```
src/app/checkout/           # NOT under [channel]
```

Checkout gets channel from `checkout.channel.slug` (set when cart was created).

### Channel Selector

```
src/ui/components/channel-select.tsx  # The <select> component
src/ui/components/footer.tsx          # Where it's rendered
```

Requires `SALEOR_APP_TOKEN` to fetch channel list via `ChannelsListDocument` query.

## Key Files

| File                                   | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| `src/config/channels.ts`               | Allowlist env parsing + validation          |
| `src/lib/channel-slugs.ts`             | `getStorefrontChannelSlugs()` (React.cache) |
| `src/app/[channel]/layout.tsx`         | Route guard + `generateStaticParams`        |
| `src/ui/components/channel-select.tsx` | Channel switcher dropdown                   |
| `src/ui/components/footer.tsx`         | Renders channel selector                    |
| `src/graphql/ChannelsList.graphql`     | Query for fetching channels                 |
| `src/app/config.ts`                    | `DefaultChannelSlug` fallback               |

## Locale Considerations

Currently, number/date formatting uses a single locale (`localeConfig.default`), regardless of channel. For true per-channel locale:

```typescript
// Potential future enhancement
const channelLocales: Record<string, string> = {
	uk: "en-GB",
	us: "en-US",
	de: "de-DE",
};
```

This is NOT implemented - formatting is currently `en-US` for all channels.

## Anti-patterns

❌ **Don't expose every Saleor channel as a route** — Use `STOREFRONT_CHANNELS` allowlist in production  
❌ **Don't assume stock means purchasable** — Warehouse must be in both the channel AND a shipping zone for that channel
❌ **Don't debug availability client-side only** - Check the 7-point purchasability checklist in Saleor Dashboard first
❌ **Don't hardcode channel slugs without fallback** - Use `DefaultChannelSlug` from config
