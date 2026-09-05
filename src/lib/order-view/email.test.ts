import { describe, expect, it } from "vitest";

import { emailsMatch, normalizeOrderEmail } from "./email";

describe("emailsMatch", () => {
	it("matches ignoring case and surrounding space", () => {
		expect(emailsMatch("Ada@Shop.example ", "ada@shop.example")).toBe(true);
		expect(normalizeOrderEmail(" Ada@Shop.example ")).toBe("ada@shop.example");
	});

	it("rejects a different email", () => {
		expect(emailsMatch("ada@shop.example", "other@shop.example")).toBe(false);
	});

	it("rejects an empty stored email", () => {
		expect(emailsMatch(null, "ada@shop.example")).toBe(false);
		expect(emailsMatch("", "ada@shop.example")).toBe(false);
	});
});
