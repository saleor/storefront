import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
	it("keeps semantic type size when merged with text color utilities", () => {
		expect(cn("text-display text-foreground")).toBe("text-display text-foreground");
		expect(cn("text-h1 text-foreground")).toBe("text-h1 text-foreground");
		expect(cn("text-h2 text-muted-foreground")).toBe("text-h2 text-muted-foreground");
	});

	it("still deduplicates conflicting font-size utilities", () => {
		expect(cn("text-h1 text-h2")).toBe("text-h2");
	});
});
