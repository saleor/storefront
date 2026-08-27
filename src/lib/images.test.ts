import { describe, expect, it } from "vitest";
import { buildSaleorSrcSet, CATALOG_CARD_RUNGS, PDP_GALLERY_RUNGS, SALEOR_THUMBNAIL_RUNGS } from "./images";

describe("buildSaleorSrcSet", () => {
	it("emits one width descriptor per usable rung", () => {
		expect(
			buildSaleorSrcSet([
				{ width: 256, url: "https://cdn.test/a_256.webp" },
				{ width: 512, url: "https://cdn.test/a_512.webp" },
				{ width: 1024, url: "https://cdn.test/a_1024.webp" },
			]),
		).toBe(
			"https://cdn.test/a_256.webp 256w, https://cdn.test/a_512.webp 512w, https://cdn.test/a_1024.webp 1024w",
		);
	});

	it("drops rungs Saleor did not return", () => {
		expect(
			buildSaleorSrcSet([
				{ width: 256, url: null },
				{ width: 512, url: "https://cdn.test/a_512.webp" },
				{ width: 1024, url: undefined },
				{ width: 2048, url: "https://cdn.test/a_2048.webp" },
			]),
		).toBe("https://cdn.test/a_512.webp 512w, https://cdn.test/a_2048.webp 2048w");
	});

	// A one-candidate srcset tells the browser nothing `src` doesn't, and the
	// undefined is what makes SaleorImage fall back to next/image.
	it("returns undefined when fewer than two rungs are usable", () => {
		expect(buildSaleorSrcSet([{ width: 512, url: "https://cdn.test/a_512.webp" }])).toBeUndefined();
		expect(buildSaleorSrcSet([{ width: 512, url: null }])).toBeUndefined();
		expect(buildSaleorSrcSet([])).toBeUndefined();
	});

	// Saleor returns the same storage URL for two sizes when both snap to one rung;
	// repeating a descriptor would make the browser's selection non-deterministic.
	it("keeps the first URL when a width repeats", () => {
		expect(
			buildSaleorSrcSet([
				{ width: 512, url: "https://cdn.test/a_512.webp" },
				{ width: 512, url: "https://cdn.test/duplicate.webp" },
				{ width: 1024, url: "https://cdn.test/a_1024.webp" },
			]),
		).toBe("https://cdn.test/a_512.webp 512w, https://cdn.test/a_1024.webp 1024w");
	});
});

describe("rung sets", () => {
	// Off-ladder sizes snap to the nearest rung, so the width descriptor we publish
	// would not match the pixels Saleor actually returns.
	it("only request sizes that exist on Saleor's ladder", () => {
		for (const rung of [...CATALOG_CARD_RUNGS, ...PDP_GALLERY_RUNGS]) {
			expect(SALEOR_THUMBNAIL_RUNGS).toContain(rung);
		}
	});

	it("lists rungs in ascending order so srcset descriptors are monotonic", () => {
		for (const rungs of [CATALOG_CARD_RUNGS, PDP_GALLERY_RUNGS]) {
			expect([...rungs]).toEqual([...rungs].sort((a, b) => a - b));
		}
	});
});
