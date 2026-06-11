import type {
	AddressInput,
	PaymentGatewaysInitializeMutationVariables,
	TransactionInitializeMutationVariables,
	TransactionProcessMutationVariables,
} from "@/checkout/graphql/generated/operations";
import type {
	CheckoutActionResult,
	CheckoutCompleteActionResult,
	PaymentGatewaysInitializeActionResult,
	TransactionInitializeActionResult,
	TransactionProcessActionResult,
} from "@/checkout/lib/checkout-action-types";
import type { CheckoutFetchResult } from "@/checkout/lib/checkout-types";

/**
 * Host-provided mutation/fetch surface for the payment layer.
 *
 * The payment modules (`lib/payment/*`, Stripe components, `CheckoutDataProvider`)
 * call Saleor exclusively through this interface instead of importing
 * `@/app/(checkout)/actions` directly. The Next.js implementation lives in
 * `@/app/(checkout)/checkout-transport` and is installed once by `CheckoutApp`;
 * tests install fakes via `setCheckoutTransport`.
 */
export type CheckoutTransport = {
	/** Live checkout read bypassing any host-side cache (maps to `syncCheckoutFromServer`). */
	fetchCheckout: (checkoutId: string) => Promise<CheckoutFetchResult>;
	updateBillingAddress: (input: {
		checkoutId: string;
		billingAddress: AddressInput;
		saveAddress: boolean;
	}) => Promise<CheckoutActionResult>;
	initializePaymentGateways: (
		variables: PaymentGatewaysInitializeMutationVariables,
	) => Promise<PaymentGatewaysInitializeActionResult>;
	initializeTransaction: (
		variables: TransactionInitializeMutationVariables,
	) => Promise<TransactionInitializeActionResult>;
	processTransaction: (
		variables: TransactionProcessMutationVariables,
	) => Promise<TransactionProcessActionResult>;
	/** `checkoutComplete` — converts a fully-paid checkout into an order. */
	completeCheckout: (checkoutId: string) => Promise<CheckoutCompleteActionResult>;
};

// Module-level holder, set once by the checkout shell before any payment code runs.
// Matches the existing module-level coordination style of this layer (single-flight
// locks in execute-stripe-checkout-payment / finalize-checkout-order).
let activeTransport: CheckoutTransport | null = null;

export function setCheckoutTransport(transport: CheckoutTransport): void {
	activeTransport = transport;
}

export function getCheckoutTransport(): CheckoutTransport {
	if (!activeTransport) {
		throw new Error(
			"CheckoutTransport is not installed. Render CheckoutApp (which installs the Next.js transport) or call setCheckoutTransport() first.",
		);
	}
	return activeTransport;
}
