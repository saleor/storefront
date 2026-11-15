/**
 * Delivery restrictions and accepted payment methods, as a shop must state them "at the latest
 * at the beginning of the ordering process" (Consumer Rights Directive Art. 8(3)).
 *
 * Every fact comes from Saleor:
 * - Countries: the channel's shipping zones (`channel.countries`).
 * - Excluded areas inside those countries: public channel metadata `market.deliveryExclusions`,
 *   with a per-language variant `market.deliveryExclusions.<locale slug>` read first. Saleor
 *   stores postcode ranges, not names, and reading them needs a write permission
 *   (MANAGE_SHIPPING), so the names are stated by the store. Without the key Paper makes no
 *   claim about exclusions.
 * - Payment methods: public channel metadata `payment.methods`, a comma list of the keys below.
 *   Without it, the checkout names what it can take payment with (`paymentMethodsForCheckout`
 *   in the checkout); the cart says nothing about payment.
 *
 * Pure functions: the cart (server) and the checkout session loader build the same summary.
 */

export const DELIVERY_EXCLUSIONS_KEY = "market.deliveryExclusions";
export const PAYMENT_METHODS_KEY = "payment.methods";

/** Metadata keys to read for the given storefront locales. */
export function deliveryPaymentMetadataKeys(localeSlugs: readonly string[]): string[] {
	return [
		DELIVERY_EXCLUSIONS_KEY,
		...localeSlugs.map((slug) => `${DELIVERY_EXCLUSIONS_KEY}.${slug}`),
		PAYMENT_METHODS_KEY,
	];
}

/** The 27 EU member states. */
export const EU_COUNTRY_CODES: ReadonlySet<string> = new Set([
	"AT",
	"BE",
	"BG",
	"HR",
	"CY",
	"CZ",
	"DK",
	"EE",
	"FI",
	"FR",
	"DE",
	"GR",
	"HU",
	"IE",
	"IT",
	"LV",
	"LT",
	"LU",
	"MT",
	"NL",
	"PL",
	"PT",
	"RO",
	"SK",
	"SI",
	"ES",
	"SE",
]);

/** Payment method keys Paper can name. Brands keep their own name; the rest are translated. */
export const PAYMENT_METHOD_KEYS = [
	"card",
	"apple-pay",
	"google-pay",
	"paypal",
	"klarna",
	"sepa-debit",
	"ideal",
	"bancontact",
	"blik",
	"invoice",
	"test",
] as const;
export type PaymentMethodKey = (typeof PAYMENT_METHOD_KEYS)[number];

export const PAYMENT_METHOD_BRAND_NAMES: Partial<Record<PaymentMethodKey, string>> = {
	"apple-pay": "Apple Pay",
	"google-pay": "Google Pay",
	paypal: "PayPal",
	klarna: "Klarna",
	ideal: "iDEAL",
	bancontact: "Bancontact",
	blik: "BLIK",
};

function isPaymentMethodKey(value: string): value is PaymentMethodKey {
	return (PAYMENT_METHOD_KEYS as readonly string[]).includes(value);
}

/** Parse `payment.methods`. Unknown keys are ignored, duplicates dropped. */
export function parsePaymentMethods(value: string | null | undefined): PaymentMethodKey[] {
	const keys = (value ?? "")
		.split(",")
		.map((part) => part.trim().toLowerCase())
		.filter(isPaymentMethodKey);
	return [...new Set(keys)];
}

/** Excluded areas for the shopper's language: `market.deliveryExclusions.<slug>`, else the plain key. */
export function deliveryExclusionsFor(
	metadata: Readonly<Record<string, string>> | null | undefined,
	localeSlug: string,
): string[] {
	const text =
		metadata?.[`${DELIVERY_EXCLUSIONS_KEY}.${localeSlug}`] || metadata?.[DELIVERY_EXCLUSIONS_KEY] || "";
	return text
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);
}

/** Display strings for the delivery and payment summary, built on the server. */
export type DeliveryPaymentSummary = {
	title: string;
	/** "We deliver to 27 EU countries and Monaco." */
	deliverTo: string;
	/** "Not to: Canary Islands, Ceuta, Melilla and 7 more." `null` when the store names none. */
	exclusionsShort: string | null;
	/** "Payment by card, Apple Pay or PayPal." `null` when nothing is known. */
	payment: string | null;
	/** Country names in the shopper's language, sorted. */
	countries: string[];
	exclusions: string[];
	toggleLabel: string;
	countriesHeading: string;
	exclusionsHeading: string;
	/** The shop's shipping page, when it exists. */
	shippingPage: { href: string; title: string } | null;
};

export type DeliveryPaymentMessages = {
	title: string;
	deliverTo: (list: string) => string;
	deliverToCount: (count: number) => string;
	euCountries: (count: number) => string;
	notTo: (areas: string) => string;
	andMore: (list: string, count: number) => string;
	payment: (list: string) => string;
	method: (key: PaymentMethodKey) => string;
	toggleLabel: string;
	countriesHeading: string;
	exclusionsHeading: string;
};

/** How many excluded areas the short line names before "and N more". */
const SHORT_EXCLUSIONS = 3;

export function buildDeliveryPaymentSummary(input: {
	countryCodes: readonly string[];
	exclusions: readonly string[];
	paymentMethods: readonly PaymentMethodKey[];
	bcp47: string;
	messages: DeliveryPaymentMessages;
	shippingPage: { href: string; title: string } | null;
}): DeliveryPaymentSummary | null {
	const { countryCodes, exclusions, paymentMethods, bcp47, messages } = input;
	if (countryCodes.length === 0) {
		return null;
	}

	const regionNames = safeDisplayNames(bcp47);
	const nameOf = (code: string) => regionNames?.of(code) ?? code;
	const collator = new Intl.Collator(bcp47);
	const and = new Intl.ListFormat(bcp47, { type: "conjunction" });
	const or = new Intl.ListFormat(bcp47, { type: "disjunction" });

	const countries = countryCodes.map(nameOf).sort(collator.compare);
	const coversEu = [...EU_COUNTRY_CODES].every((code) => countryCodes.includes(code));
	const others = countryCodes
		.filter((code) => !EU_COUNTRY_CODES.has(code))
		.map(nameOf)
		.sort(collator.compare);
	// Name up to three countries; otherwise "27 EU countries and Monaco", or a count.
	const deliverToItems =
		countryCodes.length <= 3
			? countries
			: coversEu && others.length <= 3
				? [messages.euCountries(EU_COUNTRY_CODES.size), ...others]
				: null;
	const deliverTo = deliverToItems
		? messages.deliverTo(and.format(deliverToItems))
		: messages.deliverToCount(countryCodes.length);

	const shown = exclusions.slice(0, SHORT_EXCLUSIONS);
	const exclusionsShort =
		exclusions.length === 0
			? null
			: messages.notTo(
					exclusions.length > SHORT_EXCLUSIONS
						? messages.andMore(shown.join(", "), exclusions.length - SHORT_EXCLUSIONS)
						: and.format(shown),
				);

	const methodNames = paymentMethods.map((key) => PAYMENT_METHOD_BRAND_NAMES[key] ?? messages.method(key));
	const payment = methodNames.length > 0 ? messages.payment(or.format(methodNames)) : null;

	return {
		title: messages.title,
		deliverTo,
		exclusionsShort,
		payment,
		countries,
		exclusions: [...exclusions],
		toggleLabel: messages.toggleLabel,
		countriesHeading: messages.countriesHeading,
		exclusionsHeading: messages.exclusionsHeading,
		shippingPage: input.shippingPage,
	};
}

function safeDisplayNames(bcp47: string): Intl.DisplayNames | null {
	try {
		return new Intl.DisplayNames([bcp47], { type: "region" });
	} catch {
		return null;
	}
}
