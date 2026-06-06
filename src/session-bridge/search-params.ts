import type { ReadonlyURLSearchParams } from "next/navigation";

import type { ParamBasicValue } from "./types";

/**
 * Maps public URL param names to internal names.
 * URL uses shorter/external names; app code uses descriptive names.
 */
export const checkoutSearchParamKeys = {
	redirectUrl: "redirectUrl",
	checkout: "checkoutId",
	order: "orderId",
	token: "passwordResetToken",
	email: "passwordResetEmail",
	saleorApiUrl: "saleorApiUrl",
	transaction: "transaction",
	processingPayment: "processingPayment",
	redirectResult: "redirectResult",
	resultCode: "resultCode",
	type: "type",
	payment_intent: "paymentIntent",
	payment_intent_client_secret: "paymentIntentClientSecret",
	step: "step",
} as const;

type UnmappedQueryParam = keyof typeof checkoutSearchParamKeys;

type QueryParam = (typeof checkoutSearchParamKeys)[UnmappedQueryParam];

export type CheckoutQueryParams = Record<QueryParam, ParamBasicValue> & {
	countryCode?: string;
	channel?: string;
	saleorApiUrl?: string;
};

/**
 * Read checkout-related query params from Next.js search params (mapped names).
 */
export function getQueryParams(searchParams: ReadonlyURLSearchParams): CheckoutQueryParams {
	const result: Record<string, string | undefined> = {};

	for (const [key, value] of searchParams.entries()) {
		if (key in checkoutSearchParamKeys) {
			const mappedKey = checkoutSearchParamKeys[key as UnmappedQueryParam];
			result[mappedKey] = value;
		}
	}

	return result as CheckoutQueryParams;
}

/**
 * Build a query string with internal keys translated back to URL keys.
 */
export function createQueryString(
	currentParams: ReadonlyURLSearchParams,
	updates: Record<string, string | null>,
): string {
	const params = new URLSearchParams(currentParams.toString());

	const internalToUrlKey = Object.entries(checkoutSearchParamKeys).reduce(
		(acc, [urlKey, internalKey]) => {
			acc[internalKey] = urlKey;
			return acc;
		},
		{} as Record<string, string>,
	);

	for (const [internalKey, value] of Object.entries(updates)) {
		const urlKey = internalToUrlKey[internalKey];
		if (!urlKey) continue;

		if (value === null) {
			params.delete(urlKey);
		} else {
			params.set(urlKey, value);
		}
	}

	return params.toString();
}

/**
 * Checkout session id from mapped params. Null on order confirmation (`order` param).
 */
export function extractCheckoutIdFromParams(params: CheckoutQueryParams): string | null {
	if (params.orderId) {
		return null;
	}

	if (typeof params.checkoutId !== "string") {
		return null;
	}

	return params.checkoutId;
}
