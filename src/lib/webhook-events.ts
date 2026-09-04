/**
 * Saleor webhook event → invalidation scope.
 *
 * Saleor sends the event type in the `saleor-event` header (lowercase snake_case,
 * e.g. `product_updated`) on every delivery. Paper drives invalidation from that
 * header rather than guessing from payload shape, so an event we do not act on
 * (orders, checkouts, customers, …) is skipped instead of triggering a broad purge.
 *
 * `affectsListing` separates events that can change how a product appears in a grid
 * (created/deleted/renamed/repriced/new media, plus variant CRUD — channel listing
 * price and priceRange live on the variant) from the high-frequency churn that cannot
 * (stock movements, metadata writes). Inventory sync must not cost a listing cache
 * entry.
 *
 * Event names verified against saleor/webhook/event_types.py (WebhookEventAsyncType).
 */

import { createHash } from "crypto";

/** Entities Paper caches and can therefore invalidate. */
export type WebhookEntity = "product" | "category" | "collection" | "page" | "menu" | "channel";

export interface WebhookEventScope {
	entity: WebhookEntity;
	/** Event can add, remove, or reshape a listing card → bust the listing tag. */
	affectsListing: boolean;
}

const PRODUCT_LISTING: WebhookEventScope = { entity: "product", affectsListing: true };
const PRODUCT_DETAIL_ONLY: WebhookEventScope = { entity: "product", affectsListing: false };

/**
 * Events Paper acts on. Anything absent here is deliberately ignored — adding an entry
 * is how you opt a new event into invalidation.
 */
const WEBHOOK_EVENT_SCOPES: Readonly<Record<string, WebhookEventScope>> = {
	// Listing membership or card content changed.
	product_created: PRODUCT_LISTING,
	product_updated: PRODUCT_LISTING,
	product_deleted: PRODUCT_LISTING,
	product_media_created: PRODUCT_LISTING,
	product_media_updated: PRODUCT_LISTING,
	product_media_deleted: PRODUCT_LISTING,
	product_variant_discounted_price_updated: PRODUCT_LISTING,
	// Variant CRUD can change the card's priceRange. Saleor does not reliably also
	// emit product_updated for a channel-listing price edit.
	product_variant_created: PRODUCT_LISTING,
	product_variant_updated: PRODUCT_LISTING,
	product_variant_deleted: PRODUCT_LISTING,

	// PDP-only: cannot change a listing card, and fires far more often.
	product_metadata_updated: PRODUCT_DETAIL_ONLY,
	product_variant_metadata_updated: PRODUCT_DETAIL_ONLY,
	product_variant_out_of_stock: PRODUCT_DETAIL_ONLY,
	product_variant_back_in_stock: PRODUCT_DETAIL_ONLY,
	product_variant_stock_updated: PRODUCT_DETAIL_ONLY,
	product_variant_out_of_stock_in_channel: PRODUCT_DETAIL_ONLY,
	product_variant_back_in_stock_in_channel: PRODUCT_DETAIL_ONLY,
	product_variant_out_of_stock_for_click_and_collect: PRODUCT_DETAIL_ONLY,
	product_variant_back_in_stock_for_click_and_collect: PRODUCT_DETAIL_ONLY,

	category_created: { entity: "category", affectsListing: true },
	category_updated: { entity: "category", affectsListing: true },
	category_deleted: { entity: "category", affectsListing: true },

	collection_created: { entity: "collection", affectsListing: true },
	collection_updated: { entity: "collection", affectsListing: true },
	collection_deleted: { entity: "collection", affectsListing: true },
	collection_metadata_updated: { entity: "collection", affectsListing: false },

	page_created: { entity: "page", affectsListing: false },
	page_updated: { entity: "page", affectsListing: false },
	page_deleted: { entity: "page", affectsListing: false },

	menu_created: { entity: "menu", affectsListing: false },
	menu_updated: { entity: "menu", affectsListing: false },
	menu_deleted: { entity: "menu", affectsListing: false },
	menu_item_created: { entity: "menu", affectsListing: false },
	menu_item_updated: { entity: "menu", affectsListing: false },
	menu_item_deleted: { entity: "menu", affectsListing: false },

	channel_created: { entity: "channel", affectsListing: false },
	channel_updated: { entity: "channel", affectsListing: false },
	channel_deleted: { entity: "channel", affectsListing: false },
	channel_status_changed: { entity: "channel", affectsListing: false },
	channel_metadata_updated: { entity: "channel", affectsListing: false },
};

/**
 * Resolve the `saleor-event` header to an invalidation scope.
 * Returns null for events Paper does not act on, and for a missing header
 * (manual/direct POSTs fall back to payload-shape inference).
 */
export function resolveWebhookEventScope(eventHeader: string | null | undefined): WebhookEventScope | null {
	if (!eventHeader) return null;
	return WEBHOOK_EVENT_SCOPES[eventHeader.trim().toLowerCase()] ?? null;
}

/**
 * High-churn catalogs (unique SKUs that turn over quickly) fire listing-affecting
 * product events constantly. Busting `listing:all:{channel}` on every sale keeps
 * the all-products grid permanently cold. Category/collection shards still bust.
 *
 * Default is on (current Paper behavior). Set `PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT=0`
 * when the all-products first page changing every few minutes is not worth a
 * regeneration — the `catalog` cacheLife backstop (1 h) is then the freshness path.
 */
export function bustListingAllOnProductEvent(
	raw: string | undefined = process.env.PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT,
): boolean {
	if (raw === undefined || raw.trim() === "") return true;
	const normalized = raw.trim().toLowerCase();
	if (["0", "false", "no", "off"].includes(normalized)) return false;
	if (["1", "true", "yes", "on"].includes(normalized)) return true;
	console.warn(
		`[revalidate] Ignoring invalid PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT="${raw.replace(/[\r\n]/g, "")}". ` +
			`Expected 0/1 (or true/false). Defaulting to on.`,
	);
	return true;
}

/** Header values are attacker-influenced; keep them on one log line. */
export function sanitizeLogValue(value: string | null | undefined): string {
	return value?.replace(/[\r\n]/g, "") ?? "";
}

/**
 * Short fingerprint of a delivery body.
 *
 * Paper's docs warn against running direct Saleor webhooks alongside saleor-paper-app,
 * because both deliver the same events and every invalidation is paid for twice. That
 * misconfiguration is invisible in aggregate metrics but obvious in the logs: the same
 * fingerprint arriving twice within seconds is a duplicate subscription, not two edits.
 *
 * Not used to *drop* deliveries — functions are multi-instance, so dedup here would be
 * unreliable in exactly the way that silently loses invalidations.
 */
export function deliveryFingerprint(rawBody: string): string {
	return createHash("sha1").update(rawBody).digest("hex").slice(0, 12);
}
