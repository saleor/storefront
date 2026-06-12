/** Opt-in marketing checkbox on checkout contact step (persisted via checkout metadata). */
export function isCheckoutMarketingConsentEnabled(): boolean {
	if (process.env.NEXT_PUBLIC_ENABLE_CHECKOUT_MARKETING_OPT_IN === "false") {
		return false;
	}

	return true;
}
