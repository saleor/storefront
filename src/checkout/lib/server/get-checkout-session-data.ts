import "server-only";

import { cache } from "react";

import { fetchCheckoutUserOnServer } from "@/checkout/lib/server/fetch-checkout-user";
import { fetchChannelCountriesOnServer } from "@/checkout/lib/server/fetch-channel-countries";
import { fetchCheckoutOnServer } from "@/checkout/lib/server/fetch-checkout";
import { formatCountryNameOnServer } from "@/checkout/lib/server/format-country-name";
import type { CountryCode } from "@/checkout/graphql";
import type { LocaleSlug } from "@/config/locale";
import { getShopCountryCodes } from "@/lib/channels/get-shop-countries";

/**
 * Per-request cached checkout session fetches keyed by checkout id / channel — not `?step=`.
 * If the checkout page RSC re-runs (e.g. `router.replace` on `?checkout=`), duplicate work is deduped.
 */
export const getCheckoutSessionUser = cache(() => fetchCheckoutUserOnServer());

export const getCheckoutSessionCheckout = cache((checkoutId: string, localeSlug: LocaleSlug) =>
	fetchCheckoutOnServer(checkoutId, localeSlug),
);

export const getCheckoutSessionCountries = cache(async (channelSlug: string, localeSlug: LocaleSlug) => {
	const { countries, defaultCountryCode } = await fetchChannelCountriesOnServer(channelSlug);
	return {
		countries: countries.map((code) => ({
			code,
			label: formatCountryNameOnServer(code, localeSlug),
		})),
		defaultCountryCode,
	};
});

/**
 * Every country, for the billing address of an order that is shipped. Sorted by name in the
 * shopper's language. Empty when Saleor cannot be read; billing then offers the shipping
 * countries as before.
 */
export const getCheckoutSessionBillingCountries = cache(async (localeSlug: LocaleSlug) => {
	let codes: string[];
	try {
		codes = await getShopCountryCodes();
	} catch (error) {
		console.warn("[Checkout] Shop countries unavailable; billing offers the shipping countries", error);
		return [];
	}
	const collator = new Intl.Collator(localeSlug);
	// Saleor returns codes as strings; they are its own CountryCode values.
	return (codes as CountryCode[])
		.map((code) => ({ code, label: formatCountryNameOnServer(code, localeSlug) }))
		.sort((a, b) => collator.compare(a.label, b.label));
});
