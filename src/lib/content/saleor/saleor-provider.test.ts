import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { saleorContentProvider } from "@/lib/content/saleor/saleor-provider";
import { cachedQuery } from "@/lib/saleor";

vi.mock("@/lib/saleor", () => ({
	cachedQuery: vi.fn(),
	CACHE_PROFILES: { storefrontContent: { id: "storefront-content" } },
}));

describe("saleorContentProvider", () => {
	beforeEach(() => {
		vi.mocked(cachedQuery).mockReset();
	});

	it("does not swallow a Saleor failure as cached defaults", async () => {
		vi.mocked(cachedQuery).mockRejectedValue(new Error("network error"));

		await expect(
			saleorContentProvider.load({
				channel: "default-channel",
				locale: "en",
			}),
		).rejects.toThrow("network error");

		expect(defaultStorefrontContent.chrome).toBeTruthy();
	});
});
