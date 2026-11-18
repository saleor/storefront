import { describe, expect, it } from "vitest";

import { composeWithdrawalStatement, type StatementMessages } from "./statement";

const de: StatementMessages = {
	wholeOrder: ({ order, date, name }) =>
		date
			? `Hiermit widerrufe ich den Vertrag über den Kauf der Waren aus Bestellung ${order} vom ${date}. Name: ${name}.`
			: `Hiermit widerrufe ich den Vertrag über den Kauf der Waren aus Bestellung ${order}. Name: ${name}.`,
	lines: ({ items, order, date, name }) =>
		`Hiermit widerrufe ich den Vertrag über den Kauf folgender Waren: ${items}. Bestellung ${order} vom ${date}. Name: ${name}.`,
	itemsDescription: ({ text, order, name }) =>
		`Hiermit widerrufe ich den Vertrag über den Kauf folgender Waren aus Bestellung ${order}: ${text}. Name: ${name}.`,
	item: ({ name, quantity }) => `${name} (${quantity}×)`,
};

describe("composeWithdrawalStatement", () => {
	const base = {
		orderNumber: "1042",
		orderDate: "3. November 2026",
		consumerName: "Jana Beispiel",
		bcp47: "de-DE",
		messages: de,
	};

	it("states the whole order", () => {
		expect(composeWithdrawalStatement({ ...base, scope: { kind: "wholeOrder" } })).toBe(
			"Hiermit widerrufe ich den Vertrag über den Kauf der Waren aus Bestellung 1042 vom 3. November 2026. Name: Jana Beispiel.",
		);
	});

	it("lists the chosen items with variant and quantity, joined in the consumer's language", () => {
		expect(
			composeWithdrawalStatement({
				...base,
				scope: {
					kind: "lines",
					items: [
						{ productName: "Bandana", variantName: null, quantity: 1 },
						{ productName: "Trail-Jacke", variantName: "M", quantity: 2 },
					],
				},
			}),
		).toBe(
			"Hiermit widerrufe ich den Vertrag über den Kauf folgender Waren: Bandana (1×) und Trail-Jacke, M (2×). Bestellung 1042 vom 3. November 2026. Name: Jana Beispiel.",
		);
	});

	it("quotes the free-text items for a lookup by order number", () => {
		expect(
			composeWithdrawalStatement({
				...base,
				orderDate: "",
				scope: { kind: "itemsDescription", text: "  die Jacke " },
			}),
		).toBe(
			"Hiermit widerrufe ich den Vertrag über den Kauf folgender Waren aus Bestellung 1042: die Jacke. Name: Jana Beispiel.",
		);
	});
});
