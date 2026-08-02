import "server-only";

import { cache } from "react";

import { fetchCheckoutUserOnServer } from "@/checkout/lib/server/fetch-checkout-user";
import { fetchChannelCountriesOnServer } from "@/checkout/lib/server/fetch-channel-countries";
import { fetchCheckoutOnServer } from "@/checkout/lib/server/fetch-checkout";
import type { LocaleSlug } from "@/config/locale";

/**
 * Per-request cached checkout session fetches keyed by checkout id / channel — not `?step=`.
 * If the checkout page RSC re-runs (e.g. `router.replace` on `?checkout=`), duplicate work is deduped.
 */
export const getCheckoutSessionUser = cache(() => fetchCheckoutUserOnServer());

export const getCheckoutSessionCheckout = cache((checkoutId: string, localeSlug: LocaleSlug) =>
	fetchCheckoutOnServer(checkoutId, localeSlug),
);

export const getCheckoutSessionCountries = cache((channelSlug: string) =>
	fetchChannelCountriesOnServer(channelSlug),
);
