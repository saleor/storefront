# Webhook Handlers

The revalidation webhook handler (`src/app/api/revalidate/route.ts`) receives Saleor webhook events and invalidates Next.js caches. Understanding its security model, rate limiting, and event handling is essential when adding new webhook events or debugging stale content.

---

## Key File

| File                              | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `src/app/api/revalidate/route.ts` | Webhook handler (POST) + manual revalidation (GET) |

---

## Supported Events

| Saleor Event                         | Payload Key           | Revalidation Target                        |
| ------------------------------------ | --------------------- | ------------------------------------------ |
| `PRODUCT_CREATED/UPDATED/DELETED`    | `data.product`        | PDP page, product listings, category page  |
| `PRODUCT_VARIANT_UPDATED`            | `data.productVariant` | PDP page (via `variant.product`), listings |
| `PRODUCT_VARIANT_STOCK_UPDATED`      | `data.productVariant` | PDP page (via `variant.product`), listings |
| `CATEGORY_CREATED/UPDATED/DELETED`   | `data.category`       | Category page                              |
| `COLLECTION_CREATED/UPDATED/DELETED` | `data.collection`     | Collection page                            |

For product events, the handler also revalidates the **category page** where the product appears (via `categorySlug`), ensuring PLP pages show updated pricing/badges.

### Events NOT Yet Handled

These events are parsed as `type: "unknown"` and trigger a safe fallback (revalidate product listings):

- `ORDER_*` — Order status changes
- `CHECKOUT_*` — Checkout lifecycle events
- `ACCOUNT_*` — User account changes
- `MENU_*` — Navigation menu changes
- `FULFILLMENT_*` — Shipping/fulfillment events

### Useful Variant Stock Events

`PRODUCT_VARIANT_OUT_OF_STOCK` and `PRODUCT_VARIANT_BACK_IN_STOCK` can drive real-time availability UI updates or "back in stock" notifications. Not currently handled but high-value candidates for extending.

---

## Security

### HMAC Signature Verification

Saleor signs webhook payloads with HMAC-SHA256. The handler verifies this using timing-safe comparison:

```typescript
function verifyWebhookSignature(payload: string, signature: string | null): boolean {
	if (!WEBHOOK_SECRET || !signature) return false;

	const hmac = createHmac("sha256", WEBHOOK_SECRET);
	hmac.update(payload);
	const expectedSignature = hmac.digest("hex");

	return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
```

- **Header**: `saleor-signature` (sent by Saleor on every webhook call)
- **Secret**: `SALEOR_WEBHOOK_SECRET` env var (copied from Saleor Dashboard webhook config)
- **Fallback**: If HMAC fails, checks `x-revalidate-secret` header against `REVALIDATE_SECRET` env var (for manual testing)

### Rate Limiting

In-memory rate limiting protects against webhook storms:

- **Window**: 60 seconds
- **Max requests**: 10 per IP per window
- **Storage**: In-memory `Map` (suitable for single-instance deployments)
- **Response**: HTTP 429 with `Retry-After` header

> **Note**: For multi-instance deployments (e.g., multiple Vercel serverless instances), replace with Redis-based rate limiting.

---

## Revalidation Strategy

The handler uses both **path-based** and **tag-based** revalidation:

```typescript
// Tag-based: Invalidates "use cache" function data
revalidateTag(`product:${slug}`, "minutes");

// Path-based: Invalidates ISR page cache
revalidatePath(`/${targetChannel}/products/${slug}`);
```

- **Tag-based**: Targets `cacheTag()` annotations in cached server functions (e.g., `getProductData`)
- **Path-based**: Targets Next.js ISR page cache for specific URLs
- The second argument to `revalidateTag()` must match the `cacheLife()` profile used in the cached function

---

## Manual Cache Clearing (GET endpoint)

For debugging or emergency cache clearing:

```bash
# Path-based revalidation
GET /api/revalidate?secret=xxx&path=/default-channel/products/my-product

# Tag-based revalidation
GET /api/revalidate?secret=xxx&tag=product:my-product

# Both at once
GET /api/revalidate?secret=xxx&path=/default-channel/products/my-product&tag=product:my-product

# Override cache profile (default: "minutes")
GET /api/revalidate?secret=xxx&tag=nav:main&profile=hours
```

Protected by `REVALIDATE_SECRET` env var.

---

## Adding a New Webhook Event

### Step 1: Update `parseWebhookPayload`

Add a new case to extract the relevant data:

```typescript
// Example: Adding ORDER event handling
if (data.order && typeof data.order === "object") {
	const order = data.order as Record<string, unknown>;
	return {
		type: "order",
		// Extract relevant fields for revalidation
	};
}
```

### Step 2: Add a `switch` case in the POST handler

```typescript
case "order":
	// Revalidate the user's order list page
	revalidatePath(`/${targetChannel}/orders`);
	revalidatedPaths.push(`/${targetChannel}/orders`);
	break;
```

### Step 3: Update the return type of `parseWebhookPayload`

Add the new type to the union:

```typescript
type: "product" | "category" | "collection" | "order" | "unknown";
```

### Step 4: Configure in Saleor Dashboard

1. Go to **Configuration → Webhooks**
2. Edit or create the webhook pointing to `https://your-site.com/api/revalidate`
3. Add the new event (e.g., `ORDER_UPDATED`)
4. Add a subscription query to control what data Saleor sends (see below)

### Subscription Query Pattern

Subscription queries define exactly which fields appear in webhook payloads. Set them when creating/updating the webhook in Saleor Dashboard or via the API:

```graphql
subscription {
	event {
		... on OrderUpdated {
			order {
				id
				number
				user {
					id
				}
			}
		}
	}
}
```

This lets you pick exactly which data Saleor sends — avoids over-fetching in webhook payloads.

---

## Saleor Dashboard Webhook Configuration

1. **Configuration → Webhooks → Create Webhook**
2. Set target URL: `https://your-site.com/api/revalidate`
3. Copy the **Secret Key** and set as `SALEOR_WEBHOOK_SECRET` env var
4. Select events: `PRODUCT_UPDATED`, `PRODUCT_DELETED`, `CATEGORY_UPDATED`, `COLLECTION_UPDATED`, etc.
5. Optionally add subscription queries for specific payload fields

---

## Debugging

### Check webhook deliveries

In Saleor Dashboard: **Configuration → Webhooks → [Your Webhook] → Deliveries**

Each delivery shows:

- Request payload
- Response status
- Response body

### Log output

The handler logs:

- `[Revalidate] Raw payload:` — Full webhook payload (debug)
- `[Revalidate] Success:` — Type, slug, revalidated paths/tags
- `[Revalidate] Rate limited:` — When rate limit is hit
- `[Revalidate] Invalid signature or secret` — Auth failure

---

## Anti-patterns

- **Don't skip HMAC verification** — Always verify `saleor-signature` in production
- **Don't use in-memory rate limiting in multi-instance deployments** — Use Redis instead
- **Don't hardcode channel slugs** — see `ui-channels` rule
- **Don't forget both path AND tag revalidation** — Pages use ISR (path), cached functions use `cacheTag` (tag)
- **Don't log unsanitized webhook data** — The handler sanitizes slugs to prevent log injection
