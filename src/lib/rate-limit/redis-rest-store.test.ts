import { describe, expect, it, vi } from "vitest";

import { createRedisRestStore } from "./redis-rest-store";
import { RateLimitStoreError } from "./store";

const config = { url: "https://redis.example.test", token: "token-123" };

function answering(body: unknown, status = 200) {
	return vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }));
}

describe("createRedisRestStore", () => {
	it("adds an attempt in one atomic script under Paper's key prefix", async () => {
		const fetchImpl = answering({ result: [3, 42_000] });
		const store = createRedisRestStore(config, { fetchImpl, now: () => 1_000 });

		expect(await store.increment("login:1.2.3.4", 900_000)).toEqual({ count: 3, resetAt: 43_000 });

		const [url, init] = fetchImpl.mock.calls[0]!;
		expect(url).toBe(config.url);
		expect(init?.method).toBe("POST");
		expect(new Headers(init?.headers).get("authorization")).toBe("Bearer token-123");
		const command = JSON.parse(String(init?.body)) as string[];
		expect(command[0]).toBe("EVAL");
		expect(command[1]).toContain("INCR");
		expect(command.slice(2)).toEqual(["1", "paper:rl:login:1.2.3.4", "900000"]);
	});

	it("fails with a store error when Redis refuses, answers oddly or not at all", async () => {
		const refused = createRedisRestStore(config, { fetchImpl: answering({ error: "WRONGPASS" }, 401) });
		await expect(refused.increment("k", 1_000)).rejects.toThrow(RateLimitStoreError);
		await expect(refused.increment("k", 1_000)).rejects.toThrow(/WRONGPASS/);

		const odd = createRedisRestStore(config, { fetchImpl: answering({ result: "OK" }) });
		await expect(odd.increment("k", 1_000)).rejects.toThrow(RateLimitStoreError);

		const down = createRedisRestStore(config, {
			fetchImpl: vi.fn<typeof fetch>(async () => {
				throw new TypeError("fetch failed");
			}),
		});
		await expect(down.increment("k", 1_000)).rejects.toThrow(RateLimitStoreError);
	});
});
