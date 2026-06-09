import { type AddressFragment, type CheckoutFragment } from "@/checkout/graphql";
import { type BillingAddressData } from "@/checkout/components/payment";
import { updateCheckoutBilling } from "@/checkout/lib/payment/update-billing";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { type ServerCheckout } from "@/checkout/lib/checkout-types";

export type CompleteFreeOrderCheckoutParams = {
	checkout: CheckoutFragment;
	billingData: BillingAddressData;
	sameAsBilling: boolean;
	hasShippingAddress: boolean;
	shippingAddress: AddressFragment | null | undefined;
	userAddresses: ReadonlyArray<AddressFragment> | undefined;
	authenticated: boolean;
	refreshCheckout: (options?: { updateState?: boolean }) => Promise<ServerCheckout | null>;
};

export type CompleteFreeOrderCheckoutResult =
	| { ok: true }
	| { ok: false; kind: "billing"; errors: Record<string, string>; focusField?: string }
	| { ok: false; kind: "complete"; error: string };

/** Billing sync + checkoutComplete for $0 totals (no PSP transaction). */
export async function completeFreeOrderCheckout({
	checkout,
	billingData,
	sameAsBilling,
	hasShippingAddress,
	shippingAddress,
	userAddresses,
	authenticated,
	refreshCheckout,
}: CompleteFreeOrderCheckoutParams): Promise<CompleteFreeOrderCheckoutResult> {
	const billingResult = await updateCheckoutBilling({
		checkoutId: checkout.id,
		sameAsBilling,
		hasShippingAddress,
		billingData,
		shippingAddress,
		userAddresses,
		authenticated,
	});

	if (!billingResult.ok) {
		return { ok: false, kind: "billing", errors: billingResult.errors, focusField: billingResult.focusField };
	}

	const liveCheckout = await refreshCheckout({ updateState: false });
	const checkoutToComplete = liveCheckout ?? checkout;

	const completeResult = await finalizeCheckoutOrder(checkoutToComplete.id, checkoutToComplete.channel.slug);

	if (!completeResult.ok) {
		return { ok: false, kind: "complete", error: completeResult.error };
	}

	return { ok: true };
}
