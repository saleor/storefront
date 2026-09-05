import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { classifyOrderViewKey, isSaleorOrderGlobalId } from "./classify";

describe("classifyOrderViewKey", () => {
	it("classifies HMAC tokens", () => {
		expect(classifyOrderViewKey("ov1.abc.def")).toEqual({ kind: "hmac", token: "ov1.abc.def" });
	});

	it("classifies numeric order numbers", () => {
		expect(classifyOrderViewKey("1042")).toEqual({ kind: "number", number: "1042" });
	});

	it("classifies Saleor global ids as orderId", () => {
		const id = Buffer.from("Order:1", "utf8").toString("base64");
		expect(isSaleorOrderGlobalId(id)).toBe(true);
		expect(classifyOrderViewKey(id)).toEqual({ kind: "orderId", orderId: id });
	});
});
