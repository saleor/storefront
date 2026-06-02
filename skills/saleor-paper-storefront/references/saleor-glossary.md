# Saleor Glossary

Non-obvious terms that commonly cause confusion. For standard Saleor concepts, see the [Saleor docs](https://docs.saleor.io/) or `references/saleor-domain-model.md`.

---

**Allocation** — Stock reserved for an unfulfilled order. Reduces `quantityAvailable` but doesn't change warehouse `quantity`. Not directly queryable from the storefront — only its effect is visible. Released on fulfillment or cancellation.

**Available for Purchase vs isAvailable** — Two different fields: `isAvailableForPurchase` (ProductChannelListing) controls whether a published product can be purchased ("coming soon" pattern). `isAvailable` (Product) checks actual stock availability. A product can be visible (`isPublished: true`) but not purchasable.

**Catalogue Promotion** — Automatic discount applied to matching products — no voucher code needed. Shows as reduced `variant.pricing.price` compared to `priceUndiscounted`. See `product-variants` rule for discount detection.

**EditorJS** — Rich text format used for `product.description`. JSON structure with blocks (paragraph, header, list, image). Must be rendered client-side — not plain text, don't treat it as a string.

**Fulfillment Triangle** — The Channel ↔ ShippingZone ↔ Warehouse relationship. **All three connections must exist** for a variant to be purchasable. Missing any link = `isAvailable: false`. The #1 cause of "product has stock but can't be purchased." See `saleor-domain-model.md`.

**Global ID** — Base64-encoded identifier used everywhere in the API. Example: `atob("UHJvZHVjdDoxMjM=")` decodes to `Product:123`. Treat as opaque — don't parse the internal format.

**quantityAvailable** — Field on `ProductVariant`: how many units a customer can buy right now. Computed server-side as `stock.quantity - allocations - reservations`, summed across all warehouses reachable from the channel. Only the final number is returned.

**Subscription Query** — GraphQL subscription format that defines webhook payload fields. Lets you specify exactly which data Saleor sends in webhook event payloads, avoiding over-fetching. See `webhook-handlers` rule.

**TaxedMoney** — `{ net { amount currency } gross { amount currency } }`. Use `gross` for customer-facing display (tax-inclusive). Never hardcode currency — it comes from the channel.

**TransactionItem** — Modern payment record (replaces legacy `Payment`). Tracks `authorizedAmount`, `chargedAmount`, `refundedAmount`, `canceledAmount` independently. `pspReference` links to the external payment provider. `availableActions` lists what can be done next (CHARGE, REFUND, CANCEL).

**Variant Selection Attribute** — Attribute configured on ProductType that creates distinct purchasable variants (e.g., Size, Color). Non-selection attributes are informational only (e.g., Material) and don't create variants. See `product-variants` rule.

**Channel Listing** — Per-channel settings for an entity. Products have visibility listings (`ProductChannelListing`), variants have price listings (`ProductVariantChannelListing`). The price for a variant lives on its channel listing, not the variant itself.

**Reservation** — Temporary stock hold during an active checkout, with automatic expiry. Affects `quantityAvailable`. Released if the checkout expires or is completed. Controlled by channel's `checkoutSettings`.
