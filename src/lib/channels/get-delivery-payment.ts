import "server-only";

import { getTranslations } from "next-intl/server";

import { getStorefrontLocaleSlugs, resolveLocaleFromSlug } from "@/config/locale";
import { ChannelDeliveryPaymentDocument } from "@/gql/graphql";
import { getLegalLinks } from "@/lib/catalog/get-legal-links";
import {
	buildDeliveryPaymentSummary,
	deliveryExclusionsFor,
	deliveryPaymentMetadataKeys,
	parsePaymentMethods,
	paymentMethodsFromGateways,
	PAYMENT_METHODS_KEY,
	type DeliveryPaymentSummary,
	type PaymentMethodKey,
} from "@/lib/delivery-payment";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";
import { buildStorefrontPath } from "@/lib/storefront-path";

type ChannelDeliveryPayment = {
	countryCodes: string[];
	metadata: Record<string, string>;
};

/**
 * The channel's delivery countries and its delivery and payment metadata. Cached with the
 * channel list and follows its daily revalidate. `channel_metadata_updated` busts it for setups
 * that send it; the Paper app does not (needs MANAGE_CHANNELS). Saleor sends no event for a
 * shipping zone change. Optional read: a field error
 * means a shorter summary, never a broken cart or checkout.
 */
async function getChannelDeliveryPayment(channel: string): Promise<ChannelDeliveryPayment> {
	"use cache";

	const data = await cachedQuery(ChannelDeliveryPaymentDocument, {
		profile: CACHE_PROFILES.channels,
		variables: { channel, keys: deliveryPaymentMetadataKeys(getStorefrontLocaleSlugs()) },
		allowPartialData: true,
	});

	const metadata: Record<string, string> = {};
	for (const [key, value] of Object.entries((data.channel?.metafields ?? {}) as Record<string, unknown>)) {
		if (typeof value === "string") metadata[key] = value;
	}
	return { countryCodes: (data.channel?.countries ?? []).map((country) => country.code), metadata };
}

/**
 * Display strings for "Delivery and payment", for the cart and the start of checkout.
 * `gateways` are the checkout's payment apps, used only when the store states no
 * `payment.methods`. `null` when Saleor lists no delivery countries.
 */
export async function getDeliveryPaymentSummary(input: {
	channel: string;
	localeSlug: string;
	gateways?: ReadonlyArray<{ id: string; name: string }> | null;
}): Promise<DeliveryPaymentSummary | null> {
	const { channel, localeSlug } = input;
	const [facts, legalLinks, t] = await Promise.all([
		getChannelDeliveryPayment(channel),
		getLegalLinks(localeSlug),
		getTranslations({ locale: localeSlug, namespace: "common.deliveryPayment" }),
	]);

	const stated = parsePaymentMethods(facts.metadata[PAYMENT_METHODS_KEY]);
	const shipping = legalLinks.shipping;

	return buildDeliveryPaymentSummary({
		countryCodes: facts.countryCodes,
		exclusions: deliveryExclusionsFor(facts.metadata, localeSlug),
		paymentMethods: stated.length > 0 ? stated : paymentMethodsFromGateways(input.gateways),
		bcp47: resolveLocaleFromSlug(localeSlug).bcp47,
		shippingPage: shipping
			? { href: buildStorefrontPath(localeSlug, channel, shipping.path), title: shipping.title }
			: null,
		messages: {
			title: t("title"),
			deliverTo: (list) => t("deliverTo", { list }),
			deliverToCount: (count) => t("deliverToCount", { count }),
			euCountries: (count) => t("euCountries", { count }),
			notTo: (areas) => t("notTo", { areas }),
			andMore: (list, count) => t("andMore", { list, count }),
			payment: (list) => t("payment", { list }),
			method: (key: PaymentMethodKey) => t(`methods.${key}`),
			toggleLabel: t("toggle"),
			countriesHeading: t("countriesHeading"),
			exclusionsHeading: t("exclusionsHeading"),
		},
	});
}
