import { describe, expect, it } from "vitest";
import {
	PUBLIC_ASSET_CACHE_CONTROL,
	PUBLIC_ASSET_FILE_EXTENSIONS,
	isPublicAssetCachePath,
	publicAssetCacheHeaderSource,
} from "./public-asset-cache.data.mjs";

describe("public asset browser cache", () => {
	it("caches same-origin videos so a hero loop is not billed as FDT on every visit", () => {
		for (const path of ["/videos/hero.mp4", "/hero.webm", "/promo.MOV", "/clip.m4v"]) {
			expect(isPublicAssetCachePath(path), path).toBe(true);
		}
	});

	it("caches the public-folder types Paper already ships", () => {
		expect(isPublicAssetCachePath("/logo.svg")).toBe(true);
		expect(isPublicAssetCachePath("/site.webmanifest")).toBe(true);
		expect(isPublicAssetCachePath("/android-chrome-192x192.png")).toBe(true);
	});

	it("does not treat documents or app routes as public assets", () => {
		for (const path of ["/en/us", "/api/og", "/sitemap.xml", "/robots.txt", "/favicon", "/"]) {
			expect(isPublicAssetCachePath(path), path).toBe(false);
		}
	});

	it("header source enumerates every allowlisted extension", () => {
		const source = publicAssetCacheHeaderSource();
		expect(source.startsWith("/(.*)\\.(")).toBe(true);
		for (const ext of PUBLIC_ASSET_FILE_EXTENSIONS) {
			expect(source).toContain(ext);
		}
	});

	it("uses a month-long browser TTL, not document caching", () => {
		expect(PUBLIC_ASSET_CACHE_CONTROL).toContain("max-age=2592000");
		expect(PUBLIC_ASSET_CACHE_CONTROL).not.toContain("max-age=0");
	});
});
