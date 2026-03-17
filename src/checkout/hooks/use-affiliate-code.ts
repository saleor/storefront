import { useEffect, useRef } from "react";
import { type Checkout, useCheckoutAddPromoCodeMutation } from "@/checkout/graphql";
import { localeConfig } from "@/config/locale";

/**
 * Auto-applies the affiliate promo code from cookie to the checkout.
 *
 * Reads the `affiliate_code` cookie (set by middleware when user visits ?ref=CODE)
 * and applies it as a promo code if the checkout doesn't already have a voucher.
 *
 * Runs once per checkout session. Silently ignores failures (invalid code, expired, etc.)
 * so it never blocks the checkout flow.
 */
export function useAffiliateCode(checkout: Checkout | null | undefined) {
	const [, addPromoCode] = useCheckoutAddPromoCodeMutation();
	const appliedRef = useRef(false);

	useEffect(() => {
		if (!checkout?.id || appliedRef.current) return;

		// Already has a voucher applied — don't override
		if (checkout.voucherCode) {
			appliedRef.current = true;
			return;
		}

		const code = getAffiliateCookie();
		if (!code) return;

		appliedRef.current = true;

		addPromoCode({
			checkoutId: checkout.id,
			promoCode: code,
			languageCode: localeConfig.graphqlLanguageCode,
		}).then((result) => {
			if (result.error || result.data?.checkoutAddPromoCode?.errors?.length) {
				// Invalid/expired code — clear the cookie so we don't retry
				clearAffiliateCookie();
				console.log("[Affiliate] Promo code not valid, cleared cookie");
			} else {
				console.log(`[Affiliate] Auto-applied promo code: ${code}`);
			}
		});
	}, [checkout?.id, checkout?.voucherCode, addPromoCode]);
}

function getAffiliateCookie(): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(/(?:^|;\s*)affiliate_code=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : null;
}

function clearAffiliateCookie() {
	if (typeof document === "undefined") return;
	document.cookie = "affiliate_code=; max-age=0; path=/";
}
