import { describe, expect, it } from "vitest";

import {
	buildDeliveryPaymentSummary,
	deliveryExclusionsFor,
	deliveryPaymentMetadataKeys,
	EU_COUNTRY_CODES,
	parsePaymentMethods,
	paymentMethodsFromGateways,
	type DeliveryPaymentMessages,
} from "@/lib/delivery-payment";

const messages: DeliveryPaymentMessages = {
	title: "Delivery and payment",
	deliverTo: (list) => `We deliver to ${list}.`,
	deliverToCount: (count) => `We deliver to ${count} countries.`,
	euCountries: (count) => `${count} EU countries`,
	notTo: (areas) => `Not to: ${areas}.`,
	andMore: (list, count) => `${list} and ${count} more`,
	payment: (list) => `Payment by ${list}.`,
	method: (key) => ({ card: "card", test: "test payment" })[key as "card" | "test"] ?? key,
	toggleLabel: "Where we deliver",
	countriesHeading: "We deliver to",
	exclusionsHeading: "Not to these areas",
};

const build = (input: Partial<Parameters<typeof buildDeliveryPaymentSummary>[0]>) =>
	buildDeliveryPaymentSummary({
		countryCodes: [],
		exclusions: [],
		paymentMethods: [],
		bcp47: "en-GB",
		messages,
		shippingPage: null,
		...input,
	});

describe("buildDeliveryPaymentSummary", () => {
	it("summarises the EU plus a few more countries", () => {
		const summary = build({ countryCodes: [...EU_COUNTRY_CODES, "MC"] });
		expect(summary?.deliverTo).toBe("We deliver to 27 EU countries and Monaco.");
		expect(summary?.countries).toHaveLength(28);
		expect(summary?.countries[0]).toBe("Austria");
	});

	it("names up to three countries", () => {
		expect(build({ countryCodes: ["DE", "AT"] })?.deliverTo).toBe("We deliver to Austria and Germany.");
	});

	it("counts the countries when they cannot be summarised", () => {
		expect(build({ countryCodes: ["DE", "AT", "CH", "GB", "NO"] })?.deliverTo).toBe(
			"We deliver to 5 countries.",
		);
	});

	it("names the first three excluded areas and counts the rest", () => {
		const summary = build({
			countryCodes: ["ES"],
			exclusions: ["Canary Islands", "Ceuta", "Melilla", "Heligoland", "Büsingen"],
		});
		expect(summary?.exclusionsShort).toBe("Not to: Canary Islands, Ceuta, Melilla and 2 more.");
		expect(summary?.exclusions).toHaveLength(5);
	});

	it("makes no claim about exclusions or payment when nothing is known", () => {
		const summary = build({ countryCodes: ["DE"] });
		expect(summary?.exclusionsShort).toBeNull();
		expect(summary?.payment).toBeNull();
	});

	it("lists payment methods with brand names kept", () => {
		expect(
			build({ countryCodes: ["DE"], paymentMethods: parsePaymentMethods("card,apple-pay,paypal") })?.payment,
		).toBe(
			"Payment by card, Apple Pay or PayPal.", // en-GB list style
		);
	});

	it("is null without delivery countries", () => {
		expect(build({ countryCodes: [] })).toBeNull();
	});
});

describe("payment method sources", () => {
	it("parses the store's list, ignoring unknown keys and duplicates", () => {
		expect(parsePaymentMethods(" Card, klarna, bitcoin, card ")).toEqual([
			{ key: "card" },
			{ key: "klarna" },
		]);
		expect(parsePaymentMethods(undefined)).toEqual([]);
	});

	it("falls back to what the checkout's payment apps are known to offer", () => {
		expect(
			paymentMethodsFromGateways([
				{ id: "saleor.app.payment.stripe", name: "Stripe" },
				{ id: "saleor.io.gift-card-payment-gateway", name: "Gift card" },
				{ id: "acme.pay", name: "Acme Pay" },
			]),
		).toEqual([{ key: "card" }, { name: "Acme Pay" }]);
	});
});

describe("excluded areas", () => {
	const metadata = {
		"market.deliveryExclusions": "Canary Islands, Ceuta",
		"market.deliveryExclusions.de": "Kanarische Inseln, Ceuta",
	};

	it("prefers the shopper's language and falls back to the plain key", () => {
		expect(deliveryExclusionsFor(metadata, "de")).toEqual(["Kanarische Inseln", "Ceuta"]);
		expect(deliveryExclusionsFor(metadata, "fr")).toEqual(["Canary Islands", "Ceuta"]);
		expect(deliveryExclusionsFor({}, "de")).toEqual([]);
	});

	it("reads the plain key, one per locale and the payment key", () => {
		expect(deliveryPaymentMetadataKeys(["de", "en"])).toEqual([
			"market.deliveryExclusions",
			"market.deliveryExclusions.de",
			"market.deliveryExclusions.en",
			"payment.methods",
		]);
	});
});
