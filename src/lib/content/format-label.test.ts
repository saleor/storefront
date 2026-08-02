import { describe, expect, it } from "vitest";
import { formatContentLabel } from "./format-label";

describe("formatContentLabel", () => {
	it("interpolates placeholders", () => {
		expect(formatContentLabel("{count} items", { count: 3 })).toBe("3 items");
		expect(formatContentLabel("Qty: {count}", { count: 2 })).toBe("Qty: 2");
		expect(formatContentLabel("Remove {product}", { product: "Hoodie" })).toBe("Remove Hoodie");
	});
});
