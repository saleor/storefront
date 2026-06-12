/** Namespace for checkout/order metadata consumed by webhooks and merchant apps. */
export const MARKETING_CONSENT_METADATA = {
	optIn: "paper.marketing_opt_in",
	optInAt: "paper.marketing_opt_in_at",
	source: "paper.marketing_opt_in_source",
} as const;

export const MARKETING_CONSENT_SOURCE_CHECKOUT_CONTACT = "checkout_contact";

export type MarketingConsentMetadataInput = {
	key: string;
	value: string;
};

export function buildMarketingConsentMetadata(optedIn: boolean): MarketingConsentMetadataInput[] {
	return [
		{ key: MARKETING_CONSENT_METADATA.optIn, value: optedIn ? "true" : "false" },
		{ key: MARKETING_CONSENT_METADATA.optInAt, value: new Date().toISOString() },
		{ key: MARKETING_CONSENT_METADATA.source, value: MARKETING_CONSENT_SOURCE_CHECKOUT_CONTACT },
	];
}
