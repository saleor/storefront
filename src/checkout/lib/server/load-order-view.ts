import "server-only";

import { connection } from "next/server";

import type { ServerOrder } from "@/checkout/lib/checkout-types";
import { fetchCheckoutUserOnServer } from "@/checkout/lib/server/fetch-checkout-user";
import { fetchOrderOnServer } from "@/checkout/lib/server/fetch-order";
import type { LocaleSlug } from "@/config/locale";
import {
	classifyOrderViewKey,
	emailsMatch,
	inspectOrderViewToken,
	readVerifiedOrderIdFromCookie,
	sanitizeOrderForClient,
	type OrderViewAccess,
} from "@/lib/order-view";

export type LoadedOrderView = {
	access: OrderViewAccess;
	order: ServerOrder;
	orderId: string;
};

async function canElevateToVerified(order: ServerOrder): Promise<boolean> {
	const cookieOrderId = await readVerifiedOrderIdFromCookie();
	if (cookieOrderId && cookieOrderId === order.id) {
		return true;
	}

	const user = await fetchCheckoutUserOnServer();
	return Boolean(user?.email && emailsMatch(order.userEmail, user.email));
}

export async function loadOrderView(
	key: string,
	localeSlug?: LocaleSlug,
): Promise<LoadedOrderView | "find-by-number" | "unavailable" | null> {
	await connection();
	const classified = classifyOrderViewKey(key);

	if (classified.kind === "number") {
		return "find-by-number";
	}

	let orderId: string | null = null;
	let accessFromToken = false;

	if (classified.kind === "hmac") {
		const inspected = inspectOrderViewToken(classified.token);
		if (inspected.status === "invalid") {
			return null;
		}
		orderId = inspected.orderId;
		accessFromToken = inspected.status === "valid";
	} else {
		orderId = classified.orderId;
	}

	const fetched = await fetchOrderOnServer(orderId, localeSlug);
	if (fetched.status === "unavailable") {
		return "unavailable";
	}
	if (fetched.status === "miss") {
		return null;
	}
	const order = fetched.order;

	const access: OrderViewAccess =
		accessFromToken || (await canElevateToVerified(order)) ? "verified" : "public";

	return {
		access,
		order: sanitizeOrderForClient(order, access),
		orderId: order.id,
	};
}
