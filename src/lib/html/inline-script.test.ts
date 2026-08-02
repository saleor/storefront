import { describe, expect, it } from "vitest";
import { serializeForInlineScript } from "@/lib/html/inline-script";

describe("serializeForInlineScript", () => {
	it("round-trips ordinary values as valid JSON", () => {
		expect(JSON.parse(serializeForInlineScript({ a: 1, b: "two" }))).toEqual({ a: 1, b: "two" });
		expect(JSON.parse(serializeForInlineScript("hello"))).toBe("hello");
	});

	it("escapes a </script> breakout attempt", () => {
		const result = serializeForInlineScript("</script><script>alert(1)</script>");
		expect(result).not.toContain("</script>");
		expect(result).not.toContain("<");
		expect(result).not.toContain("/");
		expect(JSON.parse(result)).toBe("</script><script>alert(1)</script>");
	});

	it("escapes U+2028 and U+2029 line separators", () => {
		const result = serializeForInlineScript("line\u2028and\u2029more");
		expect(result).not.toContain("\u2028");
		expect(result).not.toContain("\u2029");
		expect(JSON.parse(result)).toBe("line\u2028and\u2029more");
	});

	it("escapes unsafe characters nested in objects", () => {
		const result = serializeForInlineScript({ name: "</script>" });
		expect(result).not.toContain("</script>");
		expect(JSON.parse(result)).toEqual({ name: "</script>" });
	});
});
