import { isOrderViewHmacToken } from "./token";

export type ClassifiedOrderViewKey =
	| { kind: "hmac"; token: string }
	| { kind: "orderId"; orderId: string }
	| { kind: "number"; number: string };

export function isSaleorOrderGlobalId(value: string): boolean {
	try {
		const decoded = Buffer.from(value, "base64").toString("utf8");
		return decoded.startsWith("Order:");
	} catch {
		return false;
	}
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
