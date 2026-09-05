import { describe, expect, it } from "vitest";

import { uniqueSelectOptions } from "./unique-select-options";

describe("uniqueSelectOptions", () => {
	it("keeps a single option unchanged", () => {
		expect(uniqueSelectOptions([{ value: "CA", label: "California" }])).toEqual([
			{ value: "CA", label: "California" },
		]);
	});

	it("merges bilingual labels that share a Saleor raw code", () => {
		expect(
			uniqueSelectOptions([
				{ value: "VI", label: "Araba" },
				{ value: "VI", label: "Álava" },
			]),
		).toEqual([{ value: "VI", label: "Araba / Álava" }]);
	});

	it("drops a verbose that only adds a suffix to the other label", () => {
		expect(
			uniqueSelectOptions([
				{ value: "An Giang", label: "An Giang" },
				{ value: "An Giang", label: "An Giang Province" },
			]),
		).toEqual([{ value: "An Giang", label: "An Giang" }]);
	});

	it("joins complementary scripts for the same prefecture", () => {
		expect(
			uniqueSelectOptions([
				{ value: "東京都", label: "Tokyo" },
				{ value: "東京都", label: "東京都" },
			]),
		).toEqual([{ value: "東京都", label: "Tokyo / 東京都" }]);
	});

	it("skips empty values and uses the code when every label is blank", () => {
		expect(
			uniqueSelectOptions([
				{ value: "  ", label: "Nope" },
				{ value: "VI", label: "   " },
			]),
		).toEqual([{ value: "VI", label: "VI" }]);
	});
});
