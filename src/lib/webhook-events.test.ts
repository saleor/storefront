import { describe, it, expect } from "vitest";
import { deliveryFingerprint, resolveWebhookEventScope, sanitizeLogValue } from "./webhook-events";

describe("resolveWebhookEventScope", () => {
	it("returns null for events Paper does not act on", () => {
		// The regression this guards: these used to fall through to a broad purge of
		// the product listing on every locale.
		expect(resolveWebhookEventScope("order_created")).toBeNull();
		expect(resolveWebhookEventScope("checkout_updated")).toBeNull();
		expect(resolveWebhookEventScope("customer_created")).toBeNull();
		expect(resolveWebhookEventScope("gift_card_created")).toBeNull();
	});

	it("returns null for a missing header so payload inference can take over", () => {
		expect(resolveWebhookEventScope(null)).toBeNull();
		expect(resolveWebhookEventScope(undefined)).toBeNull();
		expect(resolveWebhookEventScope("")).toBeNull();
	});

	it("maps catalog events to their entity", () => {
		expect(resolveWebhookEventScope("product_updated")?.entity).toBe("product");
		expect(resolveWebhookEventScope("product_variant_updated")?.entity).toBe("product");
		expect(resolveWebhookEventScope("category_updated")?.entity).toBe("category");
		expect(resolveWebhookEventScope("collection_updated")?.entity).toBe("collection");
		expect(resolveWebhookEventScope("page_updated")?.entity).toBe("page");
		expect(resolveWebhookEventScope("menu_item_updated")?.entity).toBe("menu");
		expect(resolveWebhookEventScope("channel_updated")?.entity).toBe("channel");
	});

	it("marks events that can change a listing card", () => {
		expect(resolveWebhookEventScope("product_created")?.affectsListing).toBe(true);
		expect(resolveWebhookEventScope("product_updated")?.affectsListing).toBe(true);
		expect(resolveWebhookEventScope("product_deleted")?.affectsListing).toBe(true);
		expect(resolveWebhookEventScope("product_media_updated")?.affectsListing).toBe(true);
		expect(resolveWebhookEventScope("product_variant_discounted_price_updated")?.affectsListing).toBe(true);
	});

	it("keeps stock and metadata churn off the listing cache", () => {
		// These fire constantly on inventory sync; busting listings here would leave
		// the listing cache permanently cold.
		const detailOnly = [
			"product_metadata_updated",
			"product_variant_created",
			"product_variant_updated",
			"product_variant_deleted",
			"product_variant_metadata_updated",
			"product_variant_out_of_stock",
			"product_variant_back_in_stock",
			"product_variant_stock_updated",
			"product_variant_out_of_stock_in_channel",
			"product_variant_back_in_stock_in_channel",
			"product_variant_out_of_stock_for_click_and_collect",
			"product_variant_back_in_stock_for_click_and_collect",
		];

		for (const event of detailOnly) {
			expect(resolveWebhookEventScope(event), event).toEqual({
				entity: "product",
				affectsListing: false,
			});
		}
	});

	it("normalizes header casing and whitespace", () => {
		expect(resolveWebhookEventScope("PRODUCT_UPDATED")?.entity).toBe("product");
		expect(resolveWebhookEventScope("  product_updated  ")?.entity).toBe("product");
	});
});

describe("sanitizeLogValue", () => {
	it("strips newlines so a header cannot forge extra log lines", () => {
		expect(sanitizeLogValue("product_updated\n[Revalidate] forged")).toBe(
			"product_updated[Revalidate] forged",
		);
		expect(sanitizeLogValue(null)).toBe("");
	});
});

describe("deliveryFingerprint", () => {
	it("is stable for the same body so duplicate deliveries are greppable", () => {
		const body = JSON.stringify({ product: { slug: "blue-hoodie" } });
		expect(deliveryFingerprint(body)).toBe(deliveryFingerprint(body));
	});

	it("differs for different bodies", () => {
		expect(deliveryFingerprint('{"a":1}')).not.toBe(deliveryFingerprint('{"a":2}'));
	});
});
