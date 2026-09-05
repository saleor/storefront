export type ClassifiedOrdersByNumber<TOrder> =
	| { status: "found"; order: TOrder }
	| { status: "miss" }
	| { status: "unavailable" };

/**
 * Staff `orders` is fail-closed: only `{ edges: [] }` is a real miss.
 * Permission errors arrive as `data.orders === null` (partial GraphQL success)
 * or as a failed request. Either must not look like "we didn't find your order."
 */
export function classifyOrdersByNumberQuery<TOrder>(
	result: { ok: false } | { ok: true; data: { orders?: { edges: Array<{ node?: TOrder | null }> } | null } },
): ClassifiedOrdersByNumber<TOrder> {
	if (!result.ok || result.data.orders == null) {
		return { status: "unavailable" };
	}

	const order = result.data.orders.edges[0]?.node ?? null;
	return order ? { status: "found", order } : { status: "miss" };
}
