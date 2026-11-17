import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { canonicalOrderGlobalId, classifyOrderViewKey, isSaleorOrderGlobalId } from "./classify";

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

describe("canonicalOrderGlobalId", () => {
	const uuid = "0f8e4b0a-1c2d-4e3f-8a9b-0c1d2e3f4a5b";
	const canonical = btoa(`Order:${uuid}`);

	it("accepts Saleor's own spelling", () => {
		expect(canonicalOrderGlobalId(canonical)).toBe(canonical);
	});

	it("rejects other spellings of the same order and other types", () => {
		expect(canonicalOrderGlobalId(btoa(`Order:${uuid.toUpperCase()}`))).toBeNull();
		expect(canonicalOrderGlobalId(btoa(`Order:${uuid.replaceAll("-", "")}`))).toBeNull();
		expect(canonicalOrderGlobalId(btoa(`Order:{${uuid}}`))).toBeNull();
		expect(canonicalOrderGlobalId(btoa(`Checkout:${uuid}`))).toBeNull();
		expect(canonicalOrderGlobalId(`${canonical}\n`)).toBeNull();
		expect(canonicalOrderGlobalId("")).toBeNull();
	});
});
