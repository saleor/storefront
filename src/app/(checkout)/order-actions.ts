"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { fetchOrderByNumberOnServer } from "@/checkout/lib/server/fetch-order-by-number";
import { fetchOrderOnServer } from "@/checkout/lib/server/fetch-order";
import { buildOrderStatusPath } from "@paper/session-bridge";
import { getCheckoutLocaleSlug } from "@/lib/browse-locale-server";
import { isStorefrontLocaleSlug } from "@/config/locale";
import {
	ORDER_LOOKUP_TARGET_LIMIT,
	ORDER_VIEW_FIND_RATE_LIMIT,
	canonicalOrderGlobalId,
	emailsMatch,
	normalizeOrderEmail,
	parseOrderNumber,
	setOrderViewCookie,
	signOrderViewToken,
} from "@/lib/order-view";
import {
	clientIpFromHeaders,
	consumeAttempt,
	consumeAttempts,
	hashedKey,
	type LimitOutcome,
} from "@/lib/rate-limit";

export type OrderLookupActionResult = {
	ok: false;
	errorKey: "generic" | "rateLimited" | "lookupUnavailable";
};

function genericMiss(): OrderLookupActionResult {
	return { ok: false, errorKey: "generic" };
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

/*
 * Guessing an email for an order (or an order for an email) is limited three ways: per IP, and
 * per email and per order, so rotating IPs does not help. Every attempt is counted before Saleor
 * is asked, so parallel requests cannot all pass on a count that has not caught up. The per-email
 * and per-order counters hold a keyed hash, not the value, and are shared across instances when a
 * store is configured. Without one they count per instance, which production logs as a warning;
 * `RATE_LIMIT_STORE=required` refuses lookups instead, since the number search runs with an app
 * token that can read every order.
 */

function resultFor(outcome: LimitOutcome): OrderLookupActionResult | null {
	if (outcome.ok) return null;
	return { ok: false, errorKey: outcome.reason === "limited" ? "rateLimited" : "lookupUnavailable" };
}

async function rejectIfIpLimited(action: string): Promise<OrderLookupActionResult | null> {
	const ip = clientIpFromHeaders(await headers());
	return resultFor(await consumeAttempt(`${action}:${ip}`, ORDER_VIEW_FIND_RATE_LIMIT, "strict"));
}

async function rejectIfTargetsLimited(keys: string[]): Promise<OrderLookupActionResult | null> {
	return resultFor(
		await consumeAttempts(
			keys.map((key) => ({ key, limit: ORDER_LOOKUP_TARGET_LIMIT })),
			"strict",
		),
	);
}

const emailKey = (email: string) => hashedKey("order-lookup-email", normalizeOrderEmail(email));

/** Email step-up when the visitor already has the Saleor order id (Customer Emails landing). */
export async function verifyOrderEmailAction(
	_prev: OrderLookupActionResult | null,
	formData: FormData,
): Promise<OrderLookupActionResult> {
	const ipLimited = await rejectIfIpLimited("order-email");
	if (ipLimited) {
		return ipLimited;
	}

	// Only the spelling Saleor itself uses: any other would get a counter of its own.
	const orderId = canonicalOrderGlobalId(String(formData.get("orderId") ?? ""));
	if (!orderId) {
		return genericMiss();
	}

	const email = String(formData.get("email") ?? "");
	const targetsLimited = await rejectIfTargetsLimited([
		hashedKey("order-lookup-id", orderId),
		emailKey(email),
	]);
	if (targetsLimited) {
		return targetsLimited;
	}

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
	const ipLimited = await rejectIfIpLimited("order-find");
	if (ipLimited) {
		return ipLimited;
	}

	const parsed = parseOrderNumber(String(formData.get("number") ?? ""));
	if (parsed == null) {
		return genericMiss();
	}

	const email = String(formData.get("email") ?? "");
	const targetsLimited = await rejectIfTargetsLimited([
		hashedKey("order-lookup-number", String(parsed)),
		emailKey(email),
	]);
	if (targetsLimited) {
		return targetsLimited;
	}

	const lookup = await fetchOrderByNumberOnServer(parsed);
	if (lookup.status === "unavailable") {
		return { ok: false, errorKey: "lookupUnavailable" };
	}

	const storedEmail = lookup.status === "found" ? lookup.order.userEmail : null;
	// Always compare so a sequential number miss is not faster than a wrong email.
	if (!emailsMatch(storedEmail, email) || lookup.status !== "found") {
		return genericMiss();
	}

	return grantOrderView(lookup.order.id, formData);
}
