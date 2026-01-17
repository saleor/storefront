---
name: channels
description: Configure multi-channel and multi-currency support. Use when working with channel URLs, channel selector component, SALEOR_APP_TOKEN setup, or per-channel locale formatting.
---

# Channels & Multi-Currency

This storefront supports multiple Saleor channels, each with its own currency.

## How Channels Work

```
URL: /uk/products/...  →  Channel "uk" (GBP)
URL: /us/products/...  →  Channel "us" (USD)
```

- Currency comes from the channel settings in Saleor
- Channel selector appears in the footer (shows currency codes)
- Checkout inherits the channel from where the cart was created

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

1. Open **Saleor Dashboard**
2. Go to **Extensions → Add extension → "Provide details manually"**
3. Fill in:
   - Name: `Storefront` (or any name)
   - Permissions: **`MANAGE_CHANNELS`** (minimum required)
4. Save and copy the generated token
5. Add to `.env.local` as `SALEOR_APP_TOKEN`

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
src/ui/components/ChannelSelect.tsx   # The <select> component
src/ui/components/Footer.tsx          # Where it's rendered
```

Requires `SALEOR_APP_TOKEN` to fetch channel list via `ChannelsListDocument` query.

## Key Files

| File                                  | Purpose                              |
| ------------------------------------- | ------------------------------------ |
| `src/app/[channel]/layout.tsx`        | Generates static params for channels |
| `src/ui/components/ChannelSelect.tsx` | Channel switcher dropdown            |
| `src/ui/components/Footer.tsx`        | Renders channel selector             |
| `src/graphql/ChannelsList.graphql`    | Query for fetching channels          |
| `src/app/config.ts`                   | `DefaultChannelSlug` fallback        |

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
