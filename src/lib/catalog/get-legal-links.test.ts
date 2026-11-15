import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/catalog/get-page-data", () => ({ getPageData: vi.fn() }));

import { getPageData } from "@/lib/catalog/get-page-data";
import { getLegalHrefs, getLegalLinks } from "./get-legal-links";

const getPage = vi.mocked(getPageData);
type Page = Awaited<ReturnType<typeof getPageData>>;

const page = (slug: string, title: string, translatedSlug?: string) =>
	({ slug, title, translation: translatedSlug ? { slug: translatedSlug } : null }) as unknown as Page;

describe("getLegalLinks", () => {
	beforeEach(() => {
		getPage.mockReset();
	});

	it("links only the legal pages that exist in Saleor", async () => {
		getPage.mockImplementation(async (slug) =>
			slug === "privacy" ? page("privacy", "Privacy notice") : null,
		);

		await expect(getLegalLinks("en")).resolves.toEqual({
			privacy: { title: "Privacy notice", path: "/pages/privacy" },
		});
		expect(getPage.mock.calls.map(([slug]) => slug).sort()).toEqual([
			"privacy",
			"shipping",
			"terms",
			"withdrawal",
		]);
	});

	it("uses the page's translated slug and title", async () => {
		getPage.mockImplementation(async (slug) => (slug === "terms" ? page("terms", "AGB", "agb") : null));

		await expect(getLegalLinks("de")).resolves.toEqual({ terms: { title: "AGB", path: "/pages/agb" } });
	});

	it("returns no links for a shop without legal pages", async () => {
		getPage.mockResolvedValue(null);
		await expect(getLegalLinks("en")).resolves.toEqual({});
	});
});

describe("getLegalHrefs", () => {
	beforeEach(() => {
		getPage.mockReset();
	});

	it("builds storefront URLs for the pages that exist", async () => {
		getPage.mockImplementation(async (slug) => (slug === "terms" ? page("terms", "AGB", "agb") : null));

		await expect(getLegalHrefs("de", "eu")).resolves.toEqual({ terms: "/de/eu/pages/agb" });
	});
});
