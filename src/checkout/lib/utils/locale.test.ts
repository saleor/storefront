import { describe, expect, it } from "vitest";
import { countries } from "@/checkout/lib/consts/countries";
import { ENGLISH_COUNTRY_NAMES } from "@/checkout/lib/consts/english-country-names";
import { getCountryName } from "@/checkout/lib/utils/locale";

describe("getCountryName", () => {
	it("returns a stable static label for FK (Intl differs across runtimes)", () => {
		expect(getCountryName("FK")).toBe("Falkland Islands");
		expect(getCountryName("FK")).not.toContain("Malvinas");
	});

	it("stays in sync with countries.ts (prevents missing-label hydration gaps)", () => {
		expect(Object.keys(ENGLISH_COUNTRY_NAMES).sort()).toEqual([...countries].sort());
	});

	it("never returns an empty label for known codes", () => {
		for (const code of countries) {
			expect(getCountryName(code).length).toBeGreaterThan(0);
		}
	});

	it("falls back to the country code when the map has no entry", () => {
		expect(getCountryName("ZZ" as never)).toBe("ZZ");
	});
});
