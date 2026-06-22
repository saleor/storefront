import { describe, expect, it, vi } from "vitest";
import { buildPolicyLabelValues, formatPolicyAwareLabel } from "@/lib/content/policy-format";
import type { StorefrontPolicies } from "@/lib/content/types";

const policies: StorefrontPolicies = {
	shipping: { freeShippingThreshold: 75 },
	returns: { windowDays: 30 },
};

describe("buildPolicyLabelValues", () => {
	it("formats the threshold in the channel currency", () => {
		const values = buildPolicyLabelValues(policies, { currency: "USD", locale: "en-US" });
		expect(values.freeShippingThreshold).toBe("$75.00");
		expect(values.returnsWindowDays).toBe(30);
	});

	it("yields an empty threshold token when no free-shipping program exists", () => {
		const values = buildPolicyLabelValues(
			{ ...policies, shipping: { freeShippingThreshold: null } },
			{ currency: "USD", locale: "en-US" },
		);
		expect(values.freeShippingThreshold).toBe("");
	});
});

describe("formatPolicyAwareLabel", () => {
	it("interpolates policy tokens in localized copy", () => {
		const result = formatPolicyAwareLabel("Darmowa dostawa powyżej {freeShippingThreshold}", {
			freeShippingThreshold: "40,00 zł",
			returnsWindowDays: 10,
		});
		expect(result).toBe("Darmowa dostawa powyżej 40,00 zł");
	});

	it("warns in development when translation drops policy placeholders", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		vi.stubEnv("NODE_ENV", "development");

		formatPolicyAwareLabel(
			"Darmowa dostawa powyżej $75",
			{ freeShippingThreshold: "40,00 zł", returnsWindowDays: 10 },
			{
				defaultTemplate: "Free shipping over {freeShippingThreshold}",
				context: "announcementBar.message",
			},
		);

		expect(warn).toHaveBeenCalledWith(expect.stringContaining("freeShippingThreshold"));
		vi.unstubAllEnvs();
		warn.mockRestore();
	});
});
