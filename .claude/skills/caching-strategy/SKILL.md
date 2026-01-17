---
name: caching-strategy
description: Set up Saleor webhooks and debug cache invalidation. Use when configuring webhooks for on-demand revalidation, debugging stale content, or modifying /api/revalidate endpoint.
---

# Caching Strategy

## When to Use

Use this skill when:

- Setting up Saleor webhooks for cache invalidation
- Debugging why content isn't updating after Dashboard changes
- Modifying the `/api/revalidate` endpoint

## Instructions

### Saleor Webhook Setup

> **Source**: [Saleor Webhooks Documentation](https://docs.saleor.io/developer/extending/webhooks/asynchronous-events)

1. **Create webhook** in Saleor Dashboard → Configuration → Webhooks
2. **Target URL**: `https://your-store.com/api/revalidate`
3. **Subscribe to events** (verify exact names in your Saleor Dashboard):
   - Product events: look for `PRODUCT_CREATED`, `PRODUCT_UPDATED`, `PRODUCT_DELETED`
   - Category events: look for `CATEGORY_CREATED`, `CATEGORY_UPDATED`, `CATEGORY_DELETED`
   - Collection events: look for `COLLECTION_CREATED`, `COLLECTION_UPDATED`, `COLLECTION_DELETED`
4. **Copy webhook secret** to `SALEOR_WEBHOOK_SECRET` env var

> **Note**: Event names may vary by Saleor version. Always verify available events in your Dashboard's webhook configuration screen.

### Webhook Payload Structure

The endpoint (`src/app/api/revalidate/route.ts`) handles these payload shapes:

```typescript
// Product events - payload contains:
{ product: { slug: "...", channel: { slug: "..." } } }

// Category events - payload contains:
{ category: { slug: "..." } }

// Collection events - payload contains:
{ collection: { slug: "...", channel: { slug: "..." } } }
```

See `parseWebhookPayload()` in the route file for exact handling.

### Revalidation Endpoint

**Location**: `src/app/api/revalidate/route.ts`

**Security**:

- HMAC signature verification via `saleor-signature` header
- Rate limited: 10 requests/minute per IP (in-memory store)

**Manual trigger** (for debugging):

```bash
curl "https://store.com/api/revalidate?secret=xxx&path=/default-channel/products/my-product"
```

### Environment Variables

```env
REVALIDATE_SECRET=your-secret       # Manual revalidation (GET requests)
SALEOR_WEBHOOK_SECRET=webhook-hmac  # Saleor webhook HMAC verification
```

### Cache Durations in This Project

| Data              | TTL    | Location                            |
| ----------------- | ------ | ----------------------------------- |
| Product pages     | 5 min  | `revalidate = 300` in page.tsx      |
| Category lookups  | 1 hour | `resolveCategorySlugsToIds()`       |
| GraphQL responses | varies | `executeGraphQL({ revalidate: X })` |

## Debugging Stale Content

1. **Check webhook delivery** in Saleor Dashboard → Webhooks → [webhook] → Deliveries
2. **Check server logs** for `[Revalidate]` entries
3. **Manual revalidate** to force refresh:
   ```bash
   curl "https://store.com/api/revalidate?secret=xxx&path=/channel/products/slug"
   ```

## Anti-patterns

❌ **Don't guess webhook event names** - Verify in Saleor Dashboard  
❌ **Don't skip webhook setup** - Manual revalidation doesn't scale  
❌ **Don't expose `REVALIDATE_SECRET`** - Keep it server-side only
