import { afterEach, describe, expect, it, vi } from "vitest";

const cachedQuery = vi.fn();

vi.mock("@/lib/saleor", () => ({
	CACHE_PROFILES: { channels: { id: "channels" } },
	cachedQuery: (...args: unknown[]) => cachedQuery(...args),
}));

import { getCachedChannelsList } from "@/lib/channels/get-channels-data";

describe("getCachedChannelsList", () => {
	const token = process.env.SALEOR_APP_TOKEN;

	afterEach(() => {
		if (token === undefined) delete process.env.SALEOR_APP_TOKEN;
		else process.env.SALEOR_APP_TOKEN = token;
		cachedQuery.mockReset();
		vi.restoreAllMocks();
	});

	it("skips Saleor without an app token", async () => {
		delete process.env.SALEOR_APP_TOKEN;
		await expect(getCachedChannelsList()).resolves.toBeNull();
		expect(cachedQuery).not.toHaveBeenCalled();
	});

	it("caches the fallback when the token cannot read channels instead of throwing", async () => {
		process.env.SALEOR_APP_TOKEN = "token-without-channel-permission";
		cachedQuery.mockResolvedValue({ channels: null });
		await expect(getCachedChannelsList()).resolves.toEqual({ channels: null });
		expect(cachedQuery.mock.calls[0]?.[1]).toMatchObject({ allowPartialData: true });
	});

	it("returns the list when Saleor answers", async () => {
		process.env.SALEOR_APP_TOKEN = "token";
		const data = { channels: [{ id: "1", slug: "default-channel" }] };
		cachedQuery.mockResolvedValue(data);
		await expect(getCachedChannelsList()).resolves.toBe(data);
	});
});
