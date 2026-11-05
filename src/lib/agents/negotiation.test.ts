import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { isStorefrontAgentsEnabled } from "@/config/agents";
import { isAgentPagePath, prefersMarkdown } from "@/lib/agents/negotiation";
import { buildBrowsePageMetadata } from "@/lib/seo/metadata";

afterEach(() => vi.unstubAllEnvs());

describe("agent content negotiation", () => {
	beforeEach(() => {
		vi.stubEnv("STOREFRONT_AGENTS_ENABLED", "true");
		vi.stubEnv("STOREFRONT_CHANNELS", "eu");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "eu");
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en");
	});

	it.each([undefined, "", "false", "1", "TRUE"])("requires exact opt-in, got %s", (value) => {
		vi.stubEnv("STOREFRONT_AGENTS_ENABLED", value);
		expect(isStorefrontAgentsEnabled()).toBe(false);
		const response = middleware(
			new NextRequest("https://shop.example/en/eu/products", { headers: { Accept: "text/markdown" } }),
		);
		expect(response.headers.has("x-middleware-rewrite")).toBe(false);
		expect(response.headers.has("Link")).toBe(false);
		const markdown = middleware(new NextRequest("https://shop.example/en/eu.md"));
		expect(markdown.status).toBe(404);
	});

	it.each([
		[null, false],
		["*/*", false],
		["text/html", false],
		["text/markdown", true],
		["text/markdown;q=0", false],
		["text/markdown;q=0.5,text/html", false],
		["text/markdown,text/html;q=0.5", true],
		["TEXT/MARKDOWN; charset=utf-8", true],
		["text/markdown;q=NaN", false],
		["text/markdown;q=1.5", false],
		["text/markdown;q=0.5,text/*;q=0.8", false],
	])("negotiates %s", (accept, expected) => expect(prefersMarkdown(accept)).toBe(expected));

	it.each([
		"/en/eu/products",
		"/en/eu/products/shirt",
		"/en/eu/categories/clothes",
		"/en/eu/collections/summer",
		"/en/eu/pages/returns",
		"/en/eu",
	])("serves both forms of %s", (path) => {
		for (const explicit of [false, true]) {
			const response = middleware(
				new NextRequest(`https://shop.example${path}${explicit ? ".md" : ""}`, {
					headers: { Accept: explicit ? "*/*" : "text/markdown" },
				}),
			);
			expect(response.headers.get("x-middleware-rewrite")).toBe(`https://shop.example/agent-pages${path}`);
			expect(response.headers.get("Cache-Control")).toContain("no-store");
			expect(response.headers.has("Set-Cookie")).toBe(false);
		}
	});

	it.each(["/checkout", "/api/listing", "/en/eu/account", "/en/eu/cart", "/en/eu/products/shirt/extra"])(
		"excludes %s",
		(path) => {
			expect(isAgentPagePath(path)).toBe(false);
		},
	);

	it.each(["rsc", "next-router-prefetch"])("preserves React navigation %s", (header) => {
		const response = middleware(
			new NextRequest("https://shop.example/en/eu/products", {
				headers: { [header]: "1", Accept: "text/markdown" },
			}),
		);
		expect(response.headers.has("x-middleware-rewrite")).toBe(false);
	});

	it("preserves mutations", () => {
		const response = middleware(
			new NextRequest("https://shop.example/en/eu/products", {
				method: "POST",
				headers: { Accept: "text/markdown" },
			}),
		);
		expect(response.headers.has("x-middleware-rewrite")).toBe(false);
	});

	it("advertises alternatives in HTML headers and metadata only when enabled", () => {
		const response = middleware(
			new NextRequest("https://shop.example/en/eu/products", { headers: { Accept: "text/html" } }),
		);
		expect(response.headers.get("Link")).toContain("/en/eu/products.md");
		expect(response.headers.get("Vary")).toContain("Accept");
		const options = { title: "Products", locale: "en", channel: "eu", pathSuffix: "/products" };
		expect(buildBrowsePageMetadata(options).alternates?.types).toEqual({
			"text/markdown": "/en/eu/products.md",
		});
		vi.stubEnv("STOREFRONT_AGENTS_ENABLED", undefined);
		expect(buildBrowsePageMetadata(options).alternates?.types).toBeUndefined();
	});
});
