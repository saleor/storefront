import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { inspectOrderViewToken, signOrderViewToken, verifyOrderViewToken } from "./token";

const ORIGINAL_SECRET = process.env.ORDER_VIEW_SECRET;
const ORIGINAL_REVALIDATE = process.env.REVALIDATE_SECRET;

afterEach(() => {
	process.env.ORDER_VIEW_SECRET = ORIGINAL_SECRET;
	process.env.REVALIDATE_SECRET = ORIGINAL_REVALIDATE;
});

describe("order-view token", () => {
	it("round-trips a signed token", () => {
		process.env.ORDER_VIEW_SECRET = "test-secret-at-least-32-characters!!";
		const token = signOrderViewToken("T3JkZXI6MQ==", 60_000, 1_000);
		expect(token.startsWith("ov1.")).toBe(true);
		expect(verifyOrderViewToken(token, 1_000)).toEqual({ orderId: "T3JkZXI6MQ==" });
	});

	it("rejects a tampered mac", () => {
		process.env.ORDER_VIEW_SECRET = "test-secret-at-least-32-characters!!";
		const token = signOrderViewToken("T3JkZXI6MQ==", 60_000, 1_000);
		const parts = token.split(".");
		parts[2] = "a".repeat(parts[2].length);
		expect(verifyOrderViewToken(parts.join("."), 1_000)).toBeNull();
	});

	it("rejects an expired token for elevation but still yields the order id", () => {
		process.env.ORDER_VIEW_SECRET = "test-secret-at-least-32-characters!!";
		const token = signOrderViewToken("T3JkZXI6MQ==", 1_000, 1_000);
		expect(verifyOrderViewToken(token, 3_000)).toBeNull();
		expect(inspectOrderViewToken(token, 3_000)).toEqual({
			status: "expired",
			orderId: "T3JkZXI6MQ==",
		});
	});

	it("rejects a Saleor order id as a token", () => {
		process.env.ORDER_VIEW_SECRET = "test-secret-at-least-32-characters!!";
		expect(verifyOrderViewToken("T3JkZXI6MQ==")).toBeNull();
	});
});
