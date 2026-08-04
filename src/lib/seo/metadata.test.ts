import { afterEach, describe, expect, it, vi } from "vitest";
import { buildBrowsePageMetadata, buildPageMetadata, resolveSeoDescription } from "./metadata";

type OgRecord = Record<string, unknown>;

describe("buildBrowsePageMetadata OpenGraph locale", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("sets og:locale from the URL locale and lists other locales as alternates", () => {
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en,ja,pl");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "default-channel");
		vi.stubEnv("STOREFRONT_CHANNELS", "default-channel");

		const metadata = buildBrowsePageMetadata({
			title: "プリムソール",
			locale: "ja",
			channel: "japan",
			pathSuffix: "/products/purimusoru",
		});

		const og = metadata.openGraph as OgRecord;
		expect(og.locale).toBe("ja_JP");
		expect(og.alternateLocale).toEqual(["en_US", "pl_PL"]);
	});

	it("limits og:locale:alternate to locales in the locale×channel matrix", () => {
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en,ja,pl,de");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "default-channel");
		vi.stubEnv("STOREFRONT_CHANNELS", "default-channel,japan");
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS", "en:default-channel,ja:japan");

		const metadata = buildBrowsePageMetadata({
			title: "プリムソール",
			locale: "ja",
			channel: "japan",
			pathSuffix: "/products/purimusoru",
		});

		const og = metadata.openGraph as OgRecord;
		expect(og.locale).toBe("ja_JP");
		// pl/de are in STOREFRONT_LOCALES but not in the matrix — must not appear.
		expect(og.alternateLocale).toEqual(["en_US"]);
	});

	it("omits og:locale for unknown locale slugs", () => {
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "default-channel");

		const metadata = buildBrowsePageMetadata({
			title: "Page",
			locale: "zz",
			channel: "default-channel",
			pathSuffix: "/products/hoodie",
		});

		const og = metadata.openGraph as OgRecord;
		expect(og.locale).toBeUndefined();
	});

	it("omits openGraph.type for product pages (Next rejects the OG protocol `product` type)", () => {
		const metadata = buildPageMetadata({
			title: "Plimsolls",
			url: "/en/default-channel/products/plimsolls",
			ogType: "product",
		});

		const og = metadata.openGraph as OgRecord;
		expect(og.type).toBeUndefined();
	});

	it("keeps og:type website by default", () => {
		const metadata = buildPageMetadata({ title: "Page", url: "/en/default-channel" });
		expect((metadata.openGraph as OgRecord).type).toBe("website");
	});

	it("strips a smuggled openGraph.type so callers cannot trigger Next E237", () => {
		const metadata = buildPageMetadata({
			title: "Plimsolls",
			url: "/en/default-channel/products/plimsolls",
			ogType: "product",
			openGraph: { type: "product", "product:price:amount": "10" },
		});

		const og = metadata.openGraph as OgRecord;
		expect(og.type).toBeUndefined();
		expect(og["product:price:amount"]).toBe("10");
	});
});

describe("resolveSeoDescription", () => {
	it("prefers seoDescription, then Editor.js body text, then the name", () => {
		expect(
			resolveSeoDescription({
				seoDescription: " SEO copy ",
				body: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Body" } }] }),
				fallbackName: "Name",
			}),
		).toBe("SEO copy");

		expect(
			resolveSeoDescription({
				seoDescription: null,
				body: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Body copy" } }] }),
				fallbackName: "Name",
			}),
		).toBe("Body copy");

		expect(
			resolveSeoDescription({
				seoDescription: "  ",
				body: null,
				fallbackName: "プリムソール",
			}),
		).toBe("プリムソール");
	});
});
