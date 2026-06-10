"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { revalidateStorefrontChrome } from "@/lib/auth/revalidate-storefront-chrome";
import {
	AddressValidationRulesDocument,
	CheckoutAddPromoCodeDocument,
	CheckoutBillingAddressUpdateDocument,
	CheckoutCompleteDocument,
	CheckoutCreateDocument,
	CheckoutCustomerAttachDocument,
	CheckoutDeliveryMethodUpdateDocument,
	CheckoutEmailUpdateDocument,
	CheckoutLinesAddDocument,
	CheckoutRemovePromoCodeDocument,
	CheckoutShippingAddressUpdateDocument,
	DeliveryOptionsCalculateDocument,
	RequestPasswordResetDocument,
	PaymentGatewaysInitializeDocument,
	TransactionInitializeDocument,
	TransactionProcessDocument,
	UserSetDefaultAddressDocument,
	type AddressValidationRulesQuery,
	type AddressValidationRulesQueryVariables,
	type CheckoutAddPromoCodeMutation,
	type CheckoutAddPromoCodeMutationVariables,
	type CheckoutBillingAddressUpdateMutation,
	type CheckoutBillingAddressUpdateMutationVariables,
	type CheckoutCompleteMutation,
	type CheckoutCompleteMutationVariables,
	type CheckoutCreateMutation,
	type CheckoutCreateMutationVariables,
	type CheckoutCustomerAttachMutation,
	type CheckoutCustomerAttachMutationVariables,
	type CheckoutDeliveryMethodUpdateMutation,
	type CheckoutDeliveryMethodUpdateMutationVariables,
	type CheckoutEmailUpdateMutation,
	type CheckoutEmailUpdateMutationVariables,
	type CheckoutLinesAddMutation,
	type CheckoutLinesAddMutationVariables,
	type CheckoutRemovePromoCodeMutation,
	type CheckoutRemovePromoCodeMutationVariables,
	type CheckoutShippingAddressUpdateMutation,
	type CheckoutShippingAddressUpdateMutationVariables,
	type DeliveryOptionsCalculateMutation,
	type DeliveryOptionsCalculateMutationVariables,
	type RequestPasswordResetMutation,
	type RequestPasswordResetMutationVariables,
	type PaymentGatewaysInitializeMutation,
	type PaymentGatewaysInitializeMutationVariables,
	type TransactionInitializeMutation,
	type TransactionInitializeMutationVariables,
	type TransactionProcessMutation,
	type TransactionProcessMutationVariables,
	type UserSetDefaultAddressMutation,
	type UserSetDefaultAddressMutationVariables,
	type AddressInput,
	type AddressTypeEnum,
	type CountryCode,
} from "@/checkout/graphql/generated/operations";
import type {
	AddressValidationRulesActionResult,
	CheckoutActionResult,
	CheckoutCompleteActionResult,
	CheckoutFieldError,
	DeliveryOptionsActionResult,
	PaymentGatewaysInitializeActionResult,
	SimpleActionResult,
	TransactionInitializeActionResult,
	TransactionProcessActionResult,
} from "@/checkout/lib/checkout-action-types";
import type { CheckoutFetchResult } from "@/checkout/lib/checkout-types";
import { getDummyPaymentGuardError, isDummyPaymentAllowed } from "@/checkout/lib/payment-gateways";
import {
	getCheckoutPayAmount,
	hasMaterialCheckoutTotalChange,
} from "@/checkout/lib/payment/checkout-pay-amount";
import { getStripePaymentGuardError, isStripePaymentEnabled } from "@/checkout/lib/payment/providers/stripe";
import { fetchCheckoutOnServer } from "@/checkout/lib/server/fetch-checkout";
import { toCheckoutActionResult } from "@/checkout/lib/server/mutation-result";
import { toTypedDocument } from "@/checkout/lib/server/to-typed-document";
import { localeConfig } from "@/config/locale";
import { getRequestOrigin, isAllowedRedirectUrl } from "@/lib/auth/validate-redirect-url";
import { executeAuthenticatedGraphQL, executePublicGraphQL, executeRawGraphQL } from "@/lib/graphql";
import * as Checkout from "@/lib/checkout";
import { saveCheckoutId } from "@/app/actions";

const checkoutEmailUpdateDocument = toTypedDocument<
	CheckoutEmailUpdateMutation,
	CheckoutEmailUpdateMutationVariables
>(CheckoutEmailUpdateDocument);

const checkoutShippingAddressUpdateDocument = toTypedDocument<
	CheckoutShippingAddressUpdateMutation,
	CheckoutShippingAddressUpdateMutationVariables
>(CheckoutShippingAddressUpdateDocument);

const checkoutCustomerAttachDocument = toTypedDocument<
	CheckoutCustomerAttachMutation,
	CheckoutCustomerAttachMutationVariables
>(CheckoutCustomerAttachDocument);

const checkoutCreateDocument = toTypedDocument<CheckoutCreateMutation, CheckoutCreateMutationVariables>(
	CheckoutCreateDocument,
);

const checkoutLinesAddDocument = toTypedDocument<CheckoutLinesAddMutation, CheckoutLinesAddMutationVariables>(
	CheckoutLinesAddDocument,
);

const checkoutDeliveryMethodUpdateDocument = toTypedDocument<
	CheckoutDeliveryMethodUpdateMutation,
	CheckoutDeliveryMethodUpdateMutationVariables
>(CheckoutDeliveryMethodUpdateDocument);

const deliveryOptionsCalculateDocument = toTypedDocument<
	DeliveryOptionsCalculateMutation,
	DeliveryOptionsCalculateMutationVariables
>(DeliveryOptionsCalculateDocument);

const checkoutBillingAddressUpdateDocument = toTypedDocument<
	CheckoutBillingAddressUpdateMutation,
	CheckoutBillingAddressUpdateMutationVariables
>(CheckoutBillingAddressUpdateDocument);

const paymentGatewaysInitializeDocument = toTypedDocument<
	PaymentGatewaysInitializeMutation,
	PaymentGatewaysInitializeMutationVariables
>(PaymentGatewaysInitializeDocument);

const transactionInitializeDocument = toTypedDocument<
	TransactionInitializeMutation,
	TransactionInitializeMutationVariables
>(TransactionInitializeDocument);

const transactionProcessDocument = toTypedDocument<
	TransactionProcessMutation,
	TransactionProcessMutationVariables
>(TransactionProcessDocument);

const checkoutCompleteDocument = toTypedDocument<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>(
	CheckoutCompleteDocument,
);

const addressValidationRulesDocument = toTypedDocument<
	AddressValidationRulesQuery,
	AddressValidationRulesQueryVariables
>(AddressValidationRulesDocument);

const checkoutAddPromoCodeDocument = toTypedDocument<
	CheckoutAddPromoCodeMutation,
	CheckoutAddPromoCodeMutationVariables
>(CheckoutAddPromoCodeDocument);

const checkoutRemovePromoCodeDocument = toTypedDocument<
	CheckoutRemovePromoCodeMutation,
	CheckoutRemovePromoCodeMutationVariables
>(CheckoutRemovePromoCodeDocument);

const requestPasswordResetDocument = toTypedDocument<
	RequestPasswordResetMutation,
	RequestPasswordResetMutationVariables
>(RequestPasswordResetDocument);

const userSetDefaultAddressDocument = toTypedDocument<
	UserSetDefaultAddressMutation,
	UserSetDefaultAddressMutationVariables
>(UserSetDefaultAddressDocument);

/** Live checkout read for client sync — bypasses Next.js router/RSC cache. */
export async function syncCheckoutFromServer(checkoutId: string): Promise<CheckoutFetchResult> {
	return fetchCheckoutOnServer(checkoutId);
}

export async function updateCheckoutEmail(checkoutId: string, email: string): Promise<CheckoutActionResult> {
	const result = await executeAuthenticatedGraphQL(checkoutEmailUpdateDocument, {
		variables: {
			checkoutId,
			email,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	return toCheckoutActionResult(result.data.checkoutEmailUpdate);
}

export async function updateCheckoutShippingAddress(
	checkoutId: string,
	shippingAddress: AddressInput,
	saveAddress?: boolean,
): Promise<CheckoutActionResult> {
	const result = await executeAuthenticatedGraphQL(checkoutShippingAddressUpdateDocument, {
		variables: {
			checkoutId,
			shippingAddress,
			saveAddress,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	return toCheckoutActionResult(result.data.checkoutShippingAddressUpdate);
}

export async function attachCustomerToCheckout(checkoutId: string): Promise<CheckoutActionResult> {
	const result = await executeAuthenticatedGraphQL(checkoutCustomerAttachDocument, {
		variables: {
			checkoutId,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	return toCheckoutActionResult(result.data.checkoutCustomerAttach);
}

export async function registerCheckoutAccount(input: {
	email: string;
	password: string;
	channel: string;
	redirectUrl: string;
}): Promise<SimpleActionResult> {
	// Confirmation emails embed this URL — reject foreign origins (phishing vector).
	if (!isAllowedRedirectUrl(input.redirectUrl, await getRequestOrigin())) {
		return { ok: false, error: "Invalid redirect URL" };
	}

	const result = await executeRawGraphQL<{
		accountRegister?: {
			errors: Array<{ field?: string | null; message?: string | null; code?: string | null }>;
		};
	}>({
		query: `mutation AccountRegister($input: AccountRegisterInput!) {
			accountRegister(input: $input) {
				errors { field message code }
			}
		}`,
		variables: { input },
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	const errors = result.data.accountRegister?.errors ?? [];
	if (errors.length > 0) {
		const uniqueOnly = errors.every((error) => error.code === "UNIQUE");
		if (uniqueOnly) {
			return { ok: true };
		}

		return {
			ok: false,
			fieldErrors: errors.map(
				(error): CheckoutFieldError => ({
					field: error.field,
					message: error.message ?? "Failed to create account",
					code: error.code as CheckoutFieldError["code"],
				}),
			),
		};
	}

	return { ok: true };
}

type RecoverLine = { variantId: string; quantity: number };

export async function recoverOrphanedCheckout(
	channel: string,
	lines: RecoverLine[],
): Promise<CheckoutActionResult & { checkoutId?: string }> {
	const createResult = await executeAuthenticatedGraphQL(checkoutCreateDocument, {
		variables: {
			channel,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!createResult.ok) {
		return { ok: false, error: createResult.error.message };
	}

	const created = toCheckoutActionResult(createResult.data.checkoutCreate);
	if (!created.ok) {
		return created;
	}

	let checkout = created.checkout;

	if (lines.length > 0) {
		const linesResult = await executeAuthenticatedGraphQL(checkoutLinesAddDocument, {
			variables: {
				checkoutId: checkout.id,
				lines,
				languageCode: localeConfig.graphqlLanguageCode,
			},
			cache: "no-cache",
		});

		if (!linesResult.ok) {
			return { ok: false, error: linesResult.error.message };
		}

		const added = toCheckoutActionResult(linesResult.data.checkoutLinesAdd);
		if (!added.ok) {
			return added;
		}

		checkout = added.checkout;
	}

	await saveCheckoutId(channel, checkout.id);

	return { ok: true, checkout, checkoutId: checkout.id };
}

export async function detachCheckoutCustomer(checkoutId: string): Promise<void> {
	await Checkout.detachCustomer(checkoutId);
}

export async function calculateDeliveryOptions(checkoutId: string): Promise<DeliveryOptionsActionResult> {
	const result = await executeAuthenticatedGraphQL(deliveryOptionsCalculateDocument, {
		variables: { id: checkoutId },
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	const payload = result.data.deliveryOptionsCalculate;
	if (!payload) {
		return { ok: false, error: "No response from Saleor" };
	}

	if (payload.errors?.length) {
		return { ok: false, error: payload.errors[0].message ?? "Failed to load shipping methods" };
	}

	return { ok: true, deliveries: payload.deliveries ?? [] };
}

export async function updateCheckoutDeliveryMethod(
	checkoutId: string,
	deliveryMethodId: string,
): Promise<CheckoutActionResult> {
	const result = await executeAuthenticatedGraphQL(checkoutDeliveryMethodUpdateDocument, {
		variables: {
			checkoutId,
			deliveryMethodId,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	return toCheckoutActionResult(result.data.checkoutDeliveryMethodUpdate);
}

export async function updateCheckoutBillingAddress(input: {
	checkoutId: string;
	billingAddress: AddressInput;
	saveAddress: boolean;
}): Promise<CheckoutActionResult> {
	const result = await executeAuthenticatedGraphQL(checkoutBillingAddressUpdateDocument, {
		variables: {
			checkoutId: input.checkoutId,
			billingAddress: input.billingAddress,
			saveAddress: input.saveAddress,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	return toCheckoutActionResult(result.data.checkoutBillingAddressUpdate);
}

export async function initializePaymentGateways(
	variables: PaymentGatewaysInitializeMutationVariables,
): Promise<PaymentGatewaysInitializeActionResult> {
	const result = await executeAuthenticatedGraphQL(paymentGatewaysInitializeDocument, {
		variables,
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	const payload = result.data.paymentGatewayInitialize;
	if (!payload) {
		return { ok: false, error: "No response from Saleor" };
	}

	if (payload.errors?.length) {
		return { ok: false, error: payload.errors[0].message ?? "Payment gateway initialization failed" };
	}

	return { ok: true, data: payload };
}

export async function initializeCheckoutTransaction(
	variables: TransactionInitializeMutationVariables,
): Promise<TransactionInitializeActionResult> {
	const dummyGuardError = getDummyPaymentGuardError(variables.paymentGateway?.id);
	if (dummyGuardError) {
		return { ok: false, error: dummyGuardError };
	}

	const stripeGuardError = getStripePaymentGuardError(variables.paymentGateway?.id);
	if (stripeGuardError) {
		return { ok: false, error: stripeGuardError };
	}

	// Defense in depth: never trust the client-supplied amount. Saleor re-validates
	// coverage at checkoutComplete, but rejecting here avoids authorizing a wrong amount.
	if (typeof variables.amount === "number") {
		const live = await fetchCheckoutOnServer(variables.checkoutId);
		if (!live.ok || !live.checkout) {
			return { ok: false, error: "Could not verify the checkout total. Please try again." };
		}

		const liveAmount = getCheckoutPayAmount(live.checkout);
		if (liveAmount === null || hasMaterialCheckoutTotalChange(liveAmount, variables.amount)) {
			return {
				ok: false,
				error: "The checkout total has changed. Please review your order and try again.",
			};
		}
	}

	const result = await executeAuthenticatedGraphQL(transactionInitializeDocument, {
		variables,
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	const payload = result.data.transactionInitialize;
	if (!payload) {
		return { ok: false, error: "No response from Saleor" };
	}

	if (payload.errors?.length) {
		return { ok: false, error: payload.errors[0].message ?? "Payment initialization failed" };
	}

	return { ok: true, data: payload };
}

export async function processCheckoutTransaction(
	variables: TransactionProcessMutationVariables,
): Promise<TransactionProcessActionResult> {
	// Mirror the initialize guards: when every integrated gateway is disabled for this
	// environment, a direct call to this action must not drive transactions either.
	// Forks adding gateways should extend this check alongside the initialize guards.
	if (!isStripePaymentEnabled() && !isDummyPaymentAllowed()) {
		return { ok: false, error: "Payments are not enabled in this environment." };
	}

	const result = await executeAuthenticatedGraphQL(transactionProcessDocument, {
		variables,
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	const payload = result.data.transactionProcess;
	if (!payload) {
		return { ok: false, error: "No response from Saleor" };
	}

	if (payload.errors?.length) {
		return { ok: false, error: payload.errors[0].message ?? "Payment processing failed" };
	}

	return { ok: true, data: payload };
}

export async function runCheckoutComplete(checkoutId: string): Promise<CheckoutCompleteActionResult> {
	const result = await executeAuthenticatedGraphQL(checkoutCompleteDocument, {
		variables: { checkoutId },
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	const payload = result.data.checkoutComplete;
	if (!payload) {
		return { ok: false, error: "No response from Saleor" };
	}

	if (payload.errors?.length) {
		return {
			ok: false,
			error: payload.errors[0].message ?? "Failed to complete order",
			fieldErrors: payload.errors.map((error) => ({
				field: error.field,
				message: error.message ?? "Failed to complete order",
				code: error.code,
			})),
		};
	}

	const orderId = payload.order?.id;
	const channelSlug = payload.order?.channel?.slug;
	if (!orderId) {
		return {
			ok: false,
			error: "Payment was processed but the order could not be created. Please try again or contact support.",
		};
	}

	// Return orderId for client `navigateToOrderConfirmation()` — do not `redirect()` here (see
	// navigate-to-order.ts). Cookie clear + cart revalidation run in `after()` so the client can
	// leave `/checkout?checkout=…` first; RootViews keeps PaymentCompletingScreen up meanwhile.
	after(async () => {
		await Checkout.clearCheckoutCookieByValue(checkoutId);
		if (channelSlug) {
			revalidatePath(`/${channelSlug}/cart`);
			revalidateStorefrontChrome(channelSlug);
		}
	});

	return { ok: true, orderId };
}

export async function getAddressValidationRules(
	countryCode: CountryCode,
): Promise<AddressValidationRulesActionResult> {
	const result = await executePublicGraphQL(addressValidationRulesDocument, {
		variables: { countryCode },
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	if (!result.data.addressValidationRules) {
		return { ok: false, error: "Validation rules not available" };
	}

	return { ok: true, rules: result.data.addressValidationRules };
}

export async function applyCheckoutPromoCode(
	checkoutId: string,
	promoCode: string,
): Promise<CheckoutActionResult> {
	const result = await executeAuthenticatedGraphQL(checkoutAddPromoCodeDocument, {
		variables: {
			checkoutId,
			promoCode,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	return toCheckoutActionResult(result.data.checkoutAddPromoCode);
}

export async function removeCheckoutPromoCode(
	checkoutId: string,
	promoCode: string,
): Promise<CheckoutActionResult> {
	const result = await executeAuthenticatedGraphQL(checkoutRemovePromoCodeDocument, {
		variables: {
			checkoutId,
			promoCode,
			languageCode: localeConfig.graphqlLanguageCode,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	return toCheckoutActionResult(result.data.checkoutRemovePromoCode);
}

export async function requestCheckoutPasswordReset(input: {
	email: string;
	channel: string;
	redirectUrl: string;
}): Promise<SimpleActionResult> {
	// Reset emails embed this URL — reject foreign origins (phishing vector).
	if (!isAllowedRedirectUrl(input.redirectUrl, await getRequestOrigin())) {
		return { ok: false, error: "Invalid redirect URL" };
	}

	const result = await executeRawGraphQL<RequestPasswordResetMutation>({
		query: requestPasswordResetDocument.toString(),
		variables: input,
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	// Swallow Saleor validation errors (e.g. unknown email) — same anti-enumeration
	// posture as POST /api/auth/reset-password.
	const errors = result.data.requestPasswordReset?.errors ?? [];
	if (errors.length > 0) {
		console.error("Checkout password reset validation errors");
	}

	return { ok: true };
}

export async function setUserDefaultAddress(
	addressId: string,
	type: AddressTypeEnum,
): Promise<SimpleActionResult> {
	const result = await executeAuthenticatedGraphQL(userSetDefaultAddressDocument, {
		variables: { id: addressId, type },
		cache: "no-cache",
	});

	if (!result.ok) {
		return { ok: false, error: result.error.message };
	}

	const errors = result.data.accountSetDefaultAddress?.errors ?? [];
	if (errors.length > 0) {
		return { ok: false, error: errors[0].message ?? "Failed to set default address" };
	}

	return { ok: true };
}
