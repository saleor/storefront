/**
 * The withdrawal statement, shown on the confirm step and recorded exactly as shown. Built from
 * the structured scope in the consumer's language; the scope stays the machine-readable truth.
 */

export type StatementMessages = {
	wholeOrder: (values: { order: string; date: string; name: string }) => string;
	lines: (values: { items: string; order: string; date: string; name: string }) => string;
	itemsDescription: (values: { text: string; order: string; name: string }) => string;
	item: (values: { name: string; quantity: number }) => string;
};

export type StatementItem = { productName: string; variantName: string | null; quantity: number };

export function composeWithdrawalStatement(input: {
	scope:
		| { kind: "wholeOrder" }
		| { kind: "lines"; items: StatementItem[] }
		| { kind: "itemsDescription"; text: string };
	orderNumber: string;
	/** Formatted order date; empty when unknown (lookup by order number). */
	orderDate: string;
	consumerName: string;
	bcp47: string;
	messages: StatementMessages;
}): string {
	const { scope, orderNumber: order, orderDate: date, consumerName: name, messages } = input;
	if (scope.kind === "itemsDescription") {
		return messages.itemsDescription({ text: scope.text.trim(), order, name });
	}
	if (scope.kind === "lines") {
		const list = new Intl.ListFormat(input.bcp47, { type: "conjunction" });
		const items = list.format(
			scope.items.map((item) =>
				messages.item({
					name: item.variantName ? `${item.productName}, ${item.variantName}` : item.productName,
					quantity: item.quantity,
				}),
			),
		);
		return messages.lines({ items, order, date, name });
	}
	return messages.wholeOrder({ order, date, name });
}
