import { formatContentLabel } from "@/lib/content/format-label";
import { formatMoney } from "@/lib/utils";
import type { StorefrontPolicies } from "@/lib/content/types";

/** Values for `{freeShippingThreshold}` / `{returnsWindowDays}` tokens in copy templates. */
export type PolicyLabelValues = {
	freeShippingThreshold: string;
	/** Empty when the merchant set no returns window. */
	returnsWindowDays: number | "";
};

/**
 * Format channel-wide policy values for interpolation into copy via `formatContentLabel`.
 * Money is formatted in the channel currency; an absent free-shipping program yields an
 * empty token so templates degrade gracefully.
 */
export function buildPolicyLabelValues(
	policies: StorefrontPolicies,
	{ currency, locale }: { currency: string; locale: string },
): PolicyLabelValues {
	const threshold = policies.shipping.freeShippingThreshold;
	return {
		freeShippingThreshold: threshold != null ? formatMoney(threshold, currency, locale) : "",
		returnsWindowDays: policies.returns.windowDays ?? "",
	};
}

/**
 * True when `template` names a policy value the channel does not have (`{freeShippingThreshold}`
 * without a threshold, `{returnsWindowDays}` without a window). Such copy is dropped rather than
 * shown with a hole in it ("Free shipping over ", "Returns within  days").
 */
export function needsMissingPolicy(template: string, policyValues: PolicyLabelValues): boolean {
	return (Object.keys(policyValues) as (keyof PolicyLabelValues)[]).some(
		(key) => template.includes(`{${key}}`) && policyValues[key] === "",
	);
}

/**
 * Interpolate policy tokens into copy. In development, warns when a localized string
 * dropped placeholders present in the default template (e.g. PL translation with "$75"
 * instead of `{freeShippingThreshold}`) — those strings bypass channel policy + currency.
 */
export function formatPolicyAwareLabel(
	template: string,
	policyValues: PolicyLabelValues,
	options?: { defaultTemplate?: string; context?: string },
): string {
	if (process.env.NODE_ENV === "development" && options?.defaultTemplate) {
		const policyKeys = Object.keys(policyValues) as (keyof PolicyLabelValues)[];
		const missing = policyKeys.filter(
			(key) =>
				options.defaultTemplate!.includes(`{${key}}`) &&
				!template.includes(`{${key}}`) &&
				policyValues[key] !== "" &&
				policyValues[key] !== undefined,
		);
		if (missing.length > 0) {
			console.warn(
				`[content] ${options.context ?? "copy"} is missing policy placeholder(s): ${missing.join(
					", ",
				)} — channel policy/currency will not apply.`,
			);
		}
	}

	return formatContentLabel(template, policyValues);
}
