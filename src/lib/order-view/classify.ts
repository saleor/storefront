import { isSaleorGlobalIdOf } from "@/lib/variant-name";
import { isOrderViewHmacToken } from "./token";

export type ClassifiedOrderViewKey =
	| { kind: "hmac"; token: string }
	| { kind: "orderId"; orderId: string }
	| { kind: "number"; number: string };

export function isSaleorOrderGlobalId(value: string): boolean {
	return isSaleorGlobalIdOf(value, "Order");
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
