import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const requestHeaders = vi.hoisted(() => ({ current: new Headers() }));

vi.mock("next/headers", () => ({
	headers: async () => requestHeaders.current,
	cookies: async () => ({ set: vi.fn(), get: vi.fn() }),
}));
vi.mock("next/navigation", () => ({
	redirect: (url: string) => {
		throw Object.assign(new Error("NEXT_REDIRECT"), { url });
	},
}));
vi.mock("@/lib/browse-locale-server", () => ({ getCheckoutLocaleSlug: async () => "en" }));
vi.mock("@paper/session-bridge", () => ({ buildOrderStatusPath: (token: string) => `/order/${token}` }));
vi.mock("@/checkout/lib/server/fetch-order-by-number", () => ({ fetchOrderByNumberOnServer: vi.fn() }));
vi.mock("@/checkout/lib/server/fetch-order", () => ({ fetchOrderOnServer: vi.fn() }));

import { fetchOrderOnServer } from "@/checkout/lib/server/fetch-order";
import { fetchOrderByNumberOnServer } from "@/checkout/lib/server/fetch-order-by-number";
import { findOrderByNumberAction, verifyOrderEmailAction } from "./order-actions";

const byNumber = vi.mocked(fetchOrderByNumberOnServer);
const byId = vi.mocked(fetchOrderOnServer);
let ipCounter = 0;
let orderCounter = 1000;

/** Every attempt from a new IP: the per-IP limit never applies. */
function fromNewIp() {
	ipCounter += 1;
	requestHeaders.current = new Headers({
		"x-forwarded-for": `198.51.${Math.floor(ipCounter / 250)}.${ipCounter % 250}`,
	});
}

function form(values: Record<string, string>) {
	const data = new FormData();
	for (const [key, value] of Object.entries(values)) data.set(key, value);
	return data;
}

beforeEach(() => {
	vi.stubEnv("NODE_ENV", "development");
	vi.stubEnv("RATE_LIMIT_REDIS_REST_URL", "");
	vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
	vi.stubEnv("KV_REST_API_URL", "");
	vi.stubEnv("ORDER_VIEW_SECRET", "test-secret");
	vi.spyOn(console, "warn").mockImplementation(() => {});
	byNumber.mockReset();
	byId.mockReset();
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
});

const LIMIT = 10;
const orderGlobalId = (n: number) => btoa(`Order:${String(n).padStart(8, "0")}-0000-4000-8000-000000000000`);

describe("findOrderByNumberAction", () => {
	it("stops guessing emails for one order number, even from a new IP each time", async () => {
		const number = String(++orderCounter);
		byNumber.mockResolvedValue({
			status: "found",
			order: { id: orderGlobalId(1), userEmail: "owner@example.com" },
		} as never);

		for (let i = 0; i < LIMIT; i++) {
			fromNewIp();
			await expect(
				findOrderByNumberAction(null, form({ number, email: `guess-${i}@example.com` })),
			).resolves.toEqual({ ok: false, errorKey: "generic" });
		}
		fromNewIp();
		await expect(
			findOrderByNumberAction(null, form({ number, email: "owner@example.com" })),
		).resolves.toEqual({
			ok: false,
			errorKey: "rateLimited",
		});
		expect(byNumber).toHaveBeenCalledTimes(LIMIT);
	});

	it("lets no more than the limit through when many IPs ask at once", async () => {
		const number = String(++orderCounter);
		byNumber.mockResolvedValue({
			status: "found",
			order: { id: orderGlobalId(2), userEmail: "owner@example.com" },
		} as never);

		const attempts = Array.from({ length: 30 }, (_, i) => {
			fromNewIp();
			return findOrderByNumberAction(null, form({ number, email: `guess-${i}@example.com` }));
		});
		const results = await Promise.all(attempts);
		expect(results.filter((result) => result.errorKey === "generic")).toHaveLength(LIMIT);
		expect(byNumber).toHaveBeenCalledTimes(LIMIT);
	});

	it("stops trying one email against many order numbers", async () => {
		byNumber.mockResolvedValue({ status: "missing" } as never);
		const email = `victim-${orderCounter}@example.com`;

		for (let i = 0; i < LIMIT; i++) {
			fromNewIp();
			await findOrderByNumberAction(null, form({ number: String(++orderCounter), email }));
		}
		fromNewIp();
		await expect(
			findOrderByNumberAction(null, form({ number: String(++orderCounter), email: email.toUpperCase() })),
		).resolves.toEqual({ ok: false, errorKey: "rateLimited" });
	});

	it("keeps working in production without a shared store, counting per instance", async () => {
		vi.stubEnv("NODE_ENV", "production");
		byNumber.mockResolvedValue({ status: "missing" } as never);
		fromNewIp();
		await expect(
			findOrderByNumberAction(null, form({ number: String(++orderCounter), email: "a@example.com" })),
		).resolves.toEqual({ ok: false, errorKey: "generic" });
		expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Upstash Redis"), expect.anything());
	});

	it("refuses lookups, before asking Saleor, when the deployment requires a store it lacks", async () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("RATE_LIMIT_STORE", "required");
		fromNewIp();
		await expect(
			findOrderByNumberAction(null, form({ number: String(++orderCounter), email: "a@example.com" })),
		).resolves.toEqual({ ok: false, errorKey: "lookupUnavailable" });
		expect(byNumber).not.toHaveBeenCalled();
	});
});

describe("verifyOrderEmailAction", () => {
	it("stops guessing emails for one order id, even from a new IP each time", async () => {
		const orderId = orderGlobalId(++orderCounter);
		byId.mockResolvedValue({
			status: "found",
			order: { id: orderId, userEmail: "owner@example.com" },
		} as never);

		for (let i = 0; i < LIMIT; i++) {
			fromNewIp();
			await verifyOrderEmailAction(null, form({ orderId, email: `guess-${i}@example.com` }));
		}
		fromNewIp();
		await expect(
			verifyOrderEmailAction(null, form({ orderId, email: "owner@example.com" })),
		).resolves.toEqual({
			ok: false,
			errorKey: "rateLimited",
		});
	});

	it("takes only Saleor's own spelling of an order id, so other spellings get no counter of their own", async () => {
		const uuid = `${String(++orderCounter).padStart(8, "0")}-abcd-4ef0-8abc-def012345678`;
		for (const spelling of [
			btoa(`Order:${uuid.toUpperCase()}`),
			btoa(`Order:${uuid.replaceAll("-", "")}`),
			`${btoa(`Order:${uuid}`)}!`,
		]) {
			fromNewIp();
			await expect(
				verifyOrderEmailAction(null, form({ orderId: spelling, email: "a@example.com" })),
			).resolves.toEqual({
				ok: false,
				errorKey: "generic",
			});
		}
		expect(byId).not.toHaveBeenCalled();
	});
});
