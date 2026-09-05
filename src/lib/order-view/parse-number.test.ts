import { describe, expect, it } from "vitest";

import { parseOrderNumber } from "./parse-number";

describe("parseOrderNumber", () => {
	it("accepts a plain Saleor order number", () => {
		expect(parseOrderNumber("848")).toBe(848);
	});

	it("rejects trailing junk that parseInt would accept", () => {
		expect(parseOrderNumber("848abc")).toBeNull();
		expect(parseOrderNumber("848.0")).toBeNull();
	});

	it("rejects zero, signs, and blanks", () => {
		expect(parseOrderNumber("0")).toBeNull();
		expect(parseOrderNumber("+848")).toBeNull();
		expect(parseOrderNumber("  ")).toBeNull();
	});
});
