"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { fetchOrderByNumberOnServer } from "@/checkout/lib/server/fetch-order-by-number";
import { fetchOrderOnServer } from "@/checkout/lib/server/fetch-order";
import { buildOrderStatusPath } from "@paper/session-bridge";
import { checkRateLimit } from "@/lib/auth/auth-rate-limit";
import { getCheckoutLocaleSlug } from "@/lib/browse-locale-server";
import { isStorefrontLocaleSlug } from "@/config/locale";
import {
	ORDER_VIEW_FIND_RATE_LIMIT,
	emailsMatch,
	parseOrderNumber,
	setOrderViewCookie,
	signOrderViewToken,
} from "@/lib/order-view";

export type OrderLookupActionResult = {
	ok: false;
	errorKey: "generic" | "rateLimited" | "lookupUnavailable";
};

function genericMiss(): OrderLookupActionResult {
	return { ok: false, errorKey: "generic" };
}

async function clientIp(): Promise<string> {
	const headerList = await headers();
	const forwarded = headerList.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0]?.trim() || "unknown";
	}
	return headerList.get("x-real-ip") ?? "unknown";
}

function browseLocaleFromForm(formData: FormData): string | null {
	const raw = String(formData.get("locale") ?? "");
	return isStorefrontLocaleSlug(raw) ? raw : null;
}

async function grantOrderView(orderId: string, formData: FormData): Promise<never> {
	const token = signOrderViewToken(orderId);
	await setOrderViewCookie(token);
	const locale = browseLocaleFromForm(formData) ?? (await getCheckoutLocaleSlug());
	redirect(buildOrderStatusPath(token, locale));
}

async function rateLimitOrNull(action: string): Promise<OrderLookupActionResult | null> {
	const limited = checkRateLimit(`${action}:${await clientIp()}`, ORDER_VIEW_FIND_RATE_LIMIT);
	if (!limited.allowed) {
		return { ok: false, errorKey: "rateLimited" };
	}
	return null;
}

/** Email step-up when the visitor already has the Saleor order id (Customer Emails landing). */
export async function verifyOrderEmailAction(
	_prev: OrderLookupActionResult | null,
	formData: FormData,
): Promise<OrderLookupActionResult> {
	const limited = await rateLimitOrNull("order-email");
	if (limited) {
		return limited;
	}

	const orderId = String(formData.get("orderId") ?? "");
	const email = String(formData.get("email") ?? "");
	const fetched = await fetchOrderOnServer(orderId);
	if (fetched.status === "unavailable") {
		return { ok: false, errorKey: "lookupUnavailable" };
	}

	const order = fetched.status === "found" ? fetched.order : null;
	// Always compare — skip would time-distinguish "no order" from "wrong email."
	if (!emailsMatch(order?.userEmail, email) || !order) {
		return genericMiss();
	}

	return grantOrderView(order.id, formData);
}

/** Number + email lookup. Needs SALEOR_APP_TOKEN with MANAGE_ORDERS. */
export async function findOrderByNumberAction(
	_prev: OrderLookupActionResult | null,
	formData: FormData,
): Promise<OrderLookupActionResult> {
	const limited = await rateLimitOrNull("order-find");
	if (limited) {
		return limited;
	}

	const parsed = parseOrderNumber(String(formData.get("number") ?? ""));
	if (parsed == null) {
		return genericMiss();
	}

	const lookup = await fetchOrderByNumberOnServer(parsed);
	if (lookup.status === "unavailable") {
		return { ok: false, errorKey: "lookupUnavailable" };
	}

	const email = String(formData.get("email") ?? "");
	const storedEmail = lookup.status === "found" ? lookup.order.userEmail : null;
	// Always compare so a sequential number miss is not faster than a wrong email.
	if (!emailsMatch(storedEmail, email) || lookup.status !== "found") {
		return genericMiss();
	}

	return grantOrderView(lookup.order.id, formData);
}
