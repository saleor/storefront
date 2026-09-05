/** Saleor `order.number` is digits only. Reject `848abc` / `848.0` — `parseInt` would accept those. */
export function parseOrderNumber(value: string): number | null {
	const trimmed = value.trim();
	if (!/^\d+$/.test(trimmed)) {
		return null;
	}

	const parsed = Number.parseInt(trimmed, 10);
	if (!Number.isSafeInteger(parsed) || parsed < 1) {
		return null;
	}

	return parsed;
}
