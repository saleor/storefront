import { describe, expect, it } from "vitest";
import { canRecordFixture } from "./fixtures";

describe("canRecordFixture", () => {
	it("records anonymous queries only", () => {
		const query = JSON.stringify({ query: "query ProductDetails { product { id } }" });
		expect(canRecordFixture("none", query)).toBe(true);
		expect(canRecordFixture("session", query)).toBe(false);
		expect(canRecordFixture("app", query)).toBe(false);
	});

	it("refuses mutations so passwords and tokens are not written to disk", () => {
		const mutation = JSON.stringify({
			query:
				"mutation AccountRegister($input: AccountRegisterInput!) { accountRegister(input: $input) { user { id } } }",
			variables: { input: { email: "a@b.c", password: "secret" } },
		});
		expect(canRecordFixture("none", mutation)).toBe(false);
	});
});
