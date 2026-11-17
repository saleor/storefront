import { isSaleorGlobalIdOf } from "@/lib/variant-name";
import { isOrderViewHmacToken } from "./token";

export type ClassifiedOrderViewKey =
	| { kind: "hmac"; token: string }
	| { kind: "orderId"; orderId: string }
	| { kind: "number"; number: string };

export function isSaleorOrderGlobalId(value: string): boolean {
	return isSaleorGlobalIdOf(value, "Order");
}

const ORDER_UUID = /^Order:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

/**
 * The order id exactly as Saleor writes it (`base64("Order:<lowercase uuid>")`), or null. Saleor
 * also accepts other spellings of the same order (upper case, no hyphens, stray characters), so
 * anything keyed by order id must take only this one, or each spelling gets its own counter.
 */
export function canonicalOrderGlobalId(value: string): string | null {
	if (!isSaleorOrderGlobalId(value)) return null;
	const uuid = ORDER_UUID.exec(atob(value))?.[1];
	return uuid && btoa(`Order:${uuid}`) === value ? value : null;
}

export function classifyOrderViewKey(raw: string): ClassifiedOrderViewKey {
	const key = raw.trim();

	if (isOrderViewHmacToken(key)) {
		return { kind: "hmac", token: key };
	}

	if (/^\d+$/.test(key)) {
		return { kind: "number", number: key };
	}

	return { kind: "orderId", orderId: key };
}
