import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
	cacheLife: vi.fn(),
	cacheTag: vi.fn(),
	io: vi.fn(async () => {}),
}));

import { ProductDetailsDocument } from "@/gql/graphql";
import { CACHE_PROFILES, SaleorDataError, cachedQuery, liveQuery } from "@/lib/saleor";

const variables = { slug: "tee", channel: "default-channel" } as never;

function respondWith(body: unknown, status = 200) {
	globalThis.fetch = vi.fn(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { "Content-Type": "application/json" },
			}),
	) as unknown as typeof fetch;
}

function readCached() {
	return cachedQuery(ProductDetailsDocument, {
		profile: CACHE_PROFILES.products,
		tag: "tee",
		variables,
		maxRetries: 0,
	});
}

describe("cachedQuery failure semantics", () => {
	const originalFetch = globalThis.fetch;
	const originalUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;

	beforeEach(() => {
		process.env.NEXT_PUBLIC_SALEOR_API_URL = "https://saleor.test/graphql/";
		vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		process.env.NEXT_PUBLIC_SALEOR_API_URL = originalUrl;
		vi.restoreAllMocks();
	});

	it("returns null for a missing entity", async () => {
		respondWith({ data: { product: null } });
		await expect(readCached()).resolves.toEqual({ product: null });
	});

	it("throws when Saleor fails the whole request", async () => {
		respondWith({ data: null, errors: [{ message: "boom" }] });
		await expect(readCached()).rejects.toBeInstanceOf(SaleorDataError);
	});

	it("throws on partial data so a failed resolver is not cached as a 404", async () => {
		respondWith({
			data: { product: null },
			errors: [{ message: "statement timeout", path: ["product"], extensions: { code: "GRAPHQL_ERROR" } }],
		});
		const error = await readCached().catch((e: unknown) => e);
		expect(error).toBeInstanceOf(SaleorDataError);
		expect((error as SaleorDataError).type).toBe("graphql");
		expect((error as SaleorDataError).message).toContain("statement timeout");
	});

	it("caches partial data only when the call opts in", async () => {
		respondWith({
			data: { product: null },
			errors: [{ message: "permission denied", path: ["product"] }],
		});
		await expect(
			cachedQuery(ProductDetailsDocument, {
				profile: CACHE_PROFILES.products,
				tag: "tee",
				variables,
				maxRetries: 0,
				allowPartialData: true,
			}),
		).resolves.toEqual({ product: null });
	});

	it("keeps partial data on uncached reads and reports the errors", async () => {
		respondWith({
			data: { product: null },
			errors: [{ message: "statement timeout", path: ["product"] }],
		});
		const result = await liveQuery(ProductDetailsDocument, { variables, maxRetries: 0 });
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data).toEqual({ product: null });
		expect(result.partialErrors).toEqual([{ message: "statement timeout", path: ["product"] }]);
	});
});
