import { describe, expect, it, vi } from "vitest";
import { permanentRedirect } from "next/navigation";
import { redirectToCanonicalCatalogSlug } from "./canonical-slug";

vi.mock("next/navigation", () => ({
	permanentRedirect: vi.fn(),
}));

describe("redirectToCanonicalCatalogSlug", () => {
	it("no-ops when the URL slug is already canonical", () => {
		redirectToCanonicalCatalogSlug({
			locale: "pl",
			channel: "pl",
			urlSlug: "bluza",
			kind: "products",
			entity: { slug: "hoodie", translation: { slug: "bluza" } },
		});

		expect(permanentRedirect).not.toHaveBeenCalled();
	});

	it("preserves search params on redirect", () => {
		redirectToCanonicalCatalogSlug({
			locale: "pl",
			channel: "pl",
			urlSlug: "hoodie",
			kind: "products",
			entity: { slug: "hoodie", translation: { slug: "bluza" } },
			searchParams: { variant: "abc", sort: "price" },
		});

		expect(permanentRedirect).toHaveBeenCalledWith("/pl/pl/products/bluza?variant=abc&sort=price");
	});
});
