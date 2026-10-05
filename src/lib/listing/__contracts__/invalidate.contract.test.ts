import { describe, expect, it } from "vitest";
import { listingTagsForDelivery, planListingTags } from "@/lib/listing/invalidate";
import { resolveWebhookEventScope } from "@/lib/saleor";

describe("listing invalidation", () => {
	it("busts the product's category and named collections, plus the all-products grid", () => {
		const tags = planListingTags("product", { categorySlug: "shoes", collectionSlugs: ["summer"] }, "us").map(
			(entry) => entry.tag,
		);
		expect(tags).toContain("listing:all:us");
		expect(tags).toContain("listing:category:us:shoes");
		expect(tags).toContain("listing:collection:us:summer");
		expect(tags).not.toContain("listing:collection-any:us");
	});

	it("uses the collection catch-all when the payload does not name collections", () => {
		const tags = planListingTags("product", { categorySlug: "shoes" }, "us").map((entry) => entry.tag);
		expect(tags).toContain("listing:collection-any:us");
	});

	it("skips listing:all when the env flag is off", () => {
		const previous = process.env.PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT;
		process.env.PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT = "0";
		try {
			const tags = planListingTags("product", { categorySlug: "shoes", collectionSlugs: [] }, "us").map(
				(entry) => entry.tag,
			);
			expect(tags).not.toContain("listing:all:us");
			expect(tags).toContain("listing:category:us:shoes");
		} finally {
			if (previous === undefined) delete process.env.PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT;
			else process.env.PAPER_BUST_LISTING_ALL_ON_PRODUCT_EVENT = previous;
		}
	});

	it("does not bust listings for stock or metadata, and does for product updates", () => {
		const stock = resolveWebhookEventScope("product_variant_stock_updated");
		const updated = resolveWebhookEventScope("product_updated");
		expect(stock?.affectsListing).toBe(false);
		expect(updated?.affectsListing).toBe(true);
		expect(listingTagsForDelivery(stock, "product", { categorySlug: "shoes" }, "us")).toEqual([]);
		expect(
			listingTagsForDelivery(updated, "product", { categorySlug: "shoes" }, "us").length,
		).toBeGreaterThan(0);
		expect(
			listingTagsForDelivery(null, "category", { slug: "shoes" }, "us").map((entry) => entry.tag),
		).toEqual(["listing:category:us:shoes"]);
	});
});
