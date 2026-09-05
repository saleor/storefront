import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

import { ORDER_VIEW_TOKEN_PREFIX, ORDER_VIEW_TOKEN_TTL_MS } from "./constants";
import { getOrderViewSecret } from "./secret";

export type InspectedOrderViewToken =
	| { status: "valid"; orderId: string }
	| { status: "expired"; orderId: string }
	| { status: "invalid" };

export function signOrderViewToken(
	orderId: string,
	ttlMs: number = ORDER_VIEW_TOKEN_TTL_MS,
	now: number = Date.now(),
): string {
	const payload = Buffer.from(JSON.stringify({ id: orderId, exp: now + ttlMs }), "utf8").toString(
		"base64url",
	);
	const mac = createHmac("sha256", getOrderViewSecret()).update(payload).digest("base64url");
	return `${ORDER_VIEW_TOKEN_PREFIX}.${payload}.${mac}`;
}

export function inspectOrderViewToken(token: string, now: number = Date.now()): InspectedOrderViewToken {
	const parts = token.split(".");
	if (parts.length !== 3 || parts[0] !== ORDER_VIEW_TOKEN_PREFIX) {
		return { status: "invalid" };
	}

	const [, payload, mac] = parts;
	const expected = createHmac("sha256", getOrderViewSecret()).update(payload).digest("base64url");

	const macBytes = Buffer.from(mac);
	const expectedBytes = Buffer.from(expected);
	if (macBytes.length !== expectedBytes.length || !timingSafeEqual(macBytes, expectedBytes)) {
		return { status: "invalid" };
	}

	try {
		const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
			id?: unknown;
			exp?: unknown;
		};
		if (typeof data.id !== "string" || data.id.length === 0 || typeof data.exp !== "number") {
			return { status: "invalid" };
		}
		if (now > data.exp) {
			return { status: "expired", orderId: data.id };
		}
		return { status: "valid", orderId: data.id };
	} catch {
		return { status: "invalid" };
	}
}

export function verifyOrderViewToken(token: string, now: number = Date.now()): { orderId: string } | null {
	const inspected = inspectOrderViewToken(token, now);
	return inspected.status === "valid" ? { orderId: inspected.orderId } : null;
}

export function isOrderViewHmacToken(value: string): boolean {
	return value.startsWith(`${ORDER_VIEW_TOKEN_PREFIX}.`);
}
