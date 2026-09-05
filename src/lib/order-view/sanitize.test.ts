import { describe, expect, it } from "vitest";

import { billingCityCountry, sanitizeOrderForClient } from "./sanitize";

const order = {
	id: "T3JkZXI6MQ==",
	number: "1042",
	userEmail: "ada@shop.example",
	shippingAddress: { streetAddress1: "1 Main", city: "Paris" },
	billingAddress: { city: "Lyon", country: { country: "France" } },
	deliveryMethod: { name: "DHL" },
	voucher: { code: "SAVE10" },
	fulfillments: [{ trackingNumber: "1Z999" }],
	isPaid: true,
	chargeStatus: "FULLY_CHARGED",
	authorizeStatus: "FULLY_AUTHORIZED",
	totalBalance: { amount: 0, currency: "EUR" },
	totalCaptured: { amount: 10, currency: "EUR" },
	total: { gross: { amount: 10, currency: "EUR" } },
};

describe("sanitizeOrderForClient", () => {
	it("strips PII on the public view and keeps totals", () => {
		const publicOrder = sanitizeOrderForClient(order, "public");
		expect(publicOrder.userEmail).toBeNull();
		expect(publicOrder.shippingAddress).toBeNull();
		expect(publicOrder.billingAddress).toBeNull();
		expect(publicOrder.deliveryMethod).toBeNull();
		expect(publicOrder.voucher).toBeNull();
		expect(publicOrder.fulfillments).toEqual([]);
		expect(publicOrder.isPaid).toBeNull();
		expect(publicOrder.chargeStatus).toBeNull();
		expect(publicOrder.totalCaptured).toBeNull();
		expect(publicOrder.total).toEqual(order.total);
		expect(publicOrder.number).toBe("1042");
	});

	it("keeps addresses when verified but drops the voucher code", () => {
		const verified = sanitizeOrderForClient(order, "verified");
		expect(verified.userEmail).toBe("ada@shop.example");
		expect(verified.shippingAddress).toEqual(order.shippingAddress);
		expect(verified.voucher).toBeNull();
	});
});

describe("billingCityCountry", () => {
	it("joins city and country", () => {
		expect(billingCityCountry({ city: "Lyon", country: { country: "France" } })).toBe("Lyon, France");
	});
});
