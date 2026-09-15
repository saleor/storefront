import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/channel-slugs", () => ({ getStorefrontChannelSlugs: vi.fn(async () => ["eu"]) }));
vi.mock("@/lib/agents/pages", () => ({
	getAgentPage: vi.fn(async () => ({ suffix: "/products/shirt", body: "# Shirt" })),
}));
vi.mock("@/lib/agents/discovery", () => ({
	getAgentDiscovery: vi.fn(async () => "# Store"),
	getCatalogExamples: vi.fn(() => "# Queries"),
}));

import { GET as page } from "@/app/agent-pages/[...path]/route";
import { GET as discovery } from "@/app/agents.md/route";
import { GET as llms } from "@/app/llms.txt/route";
import { GET as examples } from "@/app/agents/catalog.md/route";
import { getAgentPage } from "@/lib/agents/pages";

afterEach(() => {
	vi.unstubAllEnvs();
	vi.clearAllMocks();
});

const request = new NextRequest("https://shop.example/agent-pages/en/eu/products/shirt");
const context = (path: string[]) => ({ params: Promise.resolve({ path }) });

describe("public agent routes", () => {
	beforeEach(() => {
		vi.stubEnv("STOREFRONT_AGENTS_ENABLED", "true");
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en,pl");
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS", "en:eu");
	});
	it("disables every entry point without fetching catalog data when unset", async () => {
		vi.stubEnv("STOREFRONT_AGENTS_ENABLED", undefined);
		const responses = await Promise.all([
			discovery(),
			llms(),
			examples(),
			page(request, context(["en", "eu", "products", "shirt"])),
		]);
		for (const response of responses) expect(response.status).toBe(404);
		expect(getAgentPage).not.toHaveBeenCalled();
	});
	it.each([
		["en", "internal", "products"],
		["pl", "eu", "products"],
		["zz", "eu", "products"],
		["en", "eu", "account"],
		["en", "eu", "products", "shirt", "extra"],
	])("rejects invalid context %j", async (...path) => {
		expect((await page(request, context(path))).status).toBe(404);
		expect(getAgentPage).not.toHaveBeenCalled();
	});
	it("serves Markdown and identifies the canonical alternate without session cookies", async () => {
		const response = await page(request, context(["en", "eu", "products", "shirt"]));
		expect(response.status).toBe(200);
		expect(response.headers.get("Content-Type")).toContain("text/markdown");
		expect(response.headers.get("Content-Location")).toBe("/en/eu/products/shirt.md");
		expect(response.headers.has("Set-Cookie")).toBe(false);
		expect(await response.text()).toBe("# Shirt");
	});
	it("mirrors discovery at llms.txt", async () => {
		expect(await (await discovery()).text()).toBe(await (await llms()).text());
	});
	it("returns a retryable uncacheable response for upstream exceptions", async () => {
		vi.mocked(getAgentPage).mockRejectedValueOnce(new Error("Unavailable"));
		const log = vi.spyOn(console, "error").mockImplementation(() => {});
		const response = await page(request, context(["en", "eu", "products", "shirt"]));
		expect(response.status).toBe(503);
		expect(response.headers.get("Cache-Control")).toBe("no-store");
		log.mockRestore();
	});
});
