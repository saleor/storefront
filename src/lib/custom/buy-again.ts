export type RepeatLine = {
	variantId: string | null;
	quantity: number;
};

export type RepeatOrder = {
	id: string;
	number: string;
	created: string;
	status: string;
	channel: string;
	total: number;
	currency: string;
	lines: (RepeatLine & {
		name: string;
		variant: string;
		image: string | null;
		available: number;
	})[];
};

export function planRepeatOrder(
	requested: RepeatLine[],
	stock: ReadonlyMap<string, number>,
	existing: ReadonlyMap<string, number>,
) {
	const quantities = new Map<string, number>();
	let skipped = 0;
	for (const line of requested) {
		if (!line.variantId) {
			skipped += line.quantity;
		} else {
			quantities.set(line.variantId, (quantities.get(line.variantId) ?? 0) + line.quantity);
		}
	}
	const lines: { variantId: string; quantity: number }[] = [];
	for (const [variantId, requestedQuantity] of quantities) {
		const remaining = Math.max(0, (stock.get(variantId) ?? 0) - (existing.get(variantId) ?? 0));
		const quantity = Math.min(requestedQuantity, remaining);
		skipped += requestedQuantity - quantity;
		if (quantity > 0) lines.push({ variantId, quantity });
	}
	return { lines, skipped, added: lines.reduce((sum, line) => sum + line.quantity, 0) };
}
