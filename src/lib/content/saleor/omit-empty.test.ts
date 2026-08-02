import { describe, expect, it } from "vitest";
import { omitEmpty } from "@/lib/content/saleor/omit-empty";

describe("omitEmpty", () => {
	it("drops undefined and empty strings", () => {
		expect(omitEmpty({ a: "x", b: "", c: undefined })).toEqual({ a: "x" });
	});

	it("keeps booleans and numbers", () => {
		expect(omitEmpty({ on: false, count: 0 })).toEqual({ on: false, count: 0 });
	});
});
