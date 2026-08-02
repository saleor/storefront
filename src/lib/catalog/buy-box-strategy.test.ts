import { describe, expect, it } from "vitest";
import { PDP_VARIANT_CAP } from "@/config/variants";
import { resolveBuyBoxStrategy, resolvePdpVariantDeepLink } from "./buy-box-strategy";

describe("resolveBuyBoxStrategy", () => {
	it("defaults to matrix under the variant cap", () => {
		expect(resolveBuyBoxStrategy({ totalCount: PDP_VARIANT_CAP })).toBe("matrix");
		expect(resolveBuyBoxStrategy({ totalCount: 1 })).toBe("matrix");
		expect(resolveBuyBoxStrategy({ totalCount: null })).toBe("matrix");
	});

	it("uses over_budget above the cap", () => {
		expect(resolveBuyBoxStrategy({ totalCount: PDP_VARIANT_CAP + 1 })).toBe("over_budget");
	});

	it("prefers external when the product type is opted in", () => {
		expect(
			resolveBuyBoxStrategy({
				totalCount: PDP_VARIANT_CAP + 50,
				productTypeSlug: "Match-Ticket",
				externalProductTypeSlugs: ["match-ticket"],
			}),
		).toBe("external");
		expect(
			resolveBuyBoxStrategy({
				totalCount: 10,
				productTypeSlug: "match-ticket",
				externalProductTypeSlugs: ["match-ticket"],
			}),
		).toBe("external");
	});
});

describe("resolvePdpVariantDeepLink", () => {
	it("prefers variant id over sku", () => {
		expect(resolvePdpVariantDeepLink({ variant: "UHJvZHVjdFZhcmlhbnQ6MQ==", sku: "SKU-1" })).toEqual({
			kind: "id",
			id: "UHJvZHVjdFZhcmlhbnQ6MQ==",
		});
	});

	it("reads sku when variant is absent", () => {
		expect(resolvePdpVariantDeepLink({ sku: " ARGESP-125 " })).toEqual({
			kind: "sku",
			sku: "ARGESP-125",
		});
	});

	it("returns null when neither param is set", () => {
		expect(resolvePdpVariantDeepLink({})).toBeNull();
		expect(resolvePdpVariantDeepLink({ variant: "  ", sku: "" })).toBeNull();
	});
});
