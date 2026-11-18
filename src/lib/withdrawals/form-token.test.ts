import { describe, expect, it } from "vitest";

import { createConfirmToken, readConfirmToken, readSnapshot, signSnapshot } from "./form-token";

describe("order snapshot", () => {
	it("round-trips and rejects any change", () => {
		const token = signSnapshot([{ id: "T3JkZXI6MQ==", number: "1042" }]);
		expect(readSnapshot(token)).toEqual([{ id: "T3JkZXI6MQ==", number: "1042" }]);
		const [payload, signature] = token.split(".");
		const forged = Buffer.from(JSON.stringify([{ id: "other", number: "1" }])).toString("base64url");
		expect(readSnapshot(`${forged}.${signature}`)).toBeNull();
		expect(readSnapshot(`${payload}.x`)).toBeNull();
		expect(readSnapshot("")).toBeNull();
	});
});

describe("confirm token", () => {
	it("round-trips the idempotency key and measures the elapsed time", () => {
		const key = "0b6f4c2e-5d1a-4f3b-9c8e-7a6d5b4c3e21";
		const token = createConfirmToken(1_000, key);
		expect(readConfirmToken(token, 6_500)).toEqual({ idempotencyKey: key, elapsedMs: 5_500 });
	});

	it("rejects a forged time or key", () => {
		const token = createConfirmToken(1_000, "0b6f4c2e-5d1a-4f3b-9c8e-7a6d5b4c3e21");
		const [key, , signature] = token.split(".");
		expect(readConfirmToken(`${key}.1.${signature}`)).toBeNull();
		expect(readConfirmToken("not-a-token")).toBeNull();
	});
});
