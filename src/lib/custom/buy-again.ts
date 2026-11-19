export type BuyAgainItem = {
	key: string;
	variantId: string | null;
	name: string;
	option: string;
	image: string | null;
	quantity: number;
	available: number;
	price: number | null;
	currency: string;
};

export type BuyAgainOrder = {
	id: string;
	number: string;
	date: string;
	status: string;
	channel: string;
	total: number;
	currency: string;
	items: BuyAgainItem[];
};

export type ReorderLine = { variantId: string; quantity: number };
export type VariantAvailability = { id: string; available: number };

export function planBuyAgain(
	requested: ReorderLine[],
	availability: VariantAvailability[],
	existing: ReorderLine[],
) {
	const quantities = new Map<string, number>();
	for (const line of requested) {
		quantities.set(line.variantId, (quantities.get(line.variantId) ?? 0) + line.quantity);
	}
	const stock = new Map(availability.map((variant) => [variant.id, variant.available]));
	const inCart = new Map<string, number>();
	for (const line of existing) {
		inCart.set(line.variantId, (inCart.get(line.variantId) ?? 0) + line.quantity);
	}
	const lines: ReorderLine[] = [];
	let skipped = 0;
	for (const [variantId, requestedQuantity] of quantities) {
		const remaining = Math.max(0, (stock.get(variantId) ?? 0) - (inCart.get(variantId) ?? 0));
		const quantity = Math.min(requestedQuantity, remaining);
		skipped += requestedQuantity - quantity;
		if (quantity > 0) lines.push({ variantId, quantity });
	}
	return { lines, skipped };
}
