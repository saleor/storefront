"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DefaultChannelSlug } from "@/app/config";
import {
	getEmailAndTokenFromSearchParams,
	isAccountConfirmationLink,
} from "@/lib/auth/account-confirmation-url";
import { ConfirmAccountMode } from "@/ui/components/auth/confirm-account-mode";
import { useCheckoutTransition } from "@/checkout/hooks/use-checkout-transition";
import type { CheckoutLoadState } from "@/checkout/providers/checkout-data";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { createQueryString } from "@/checkout/lib/utils/url";
import { PageNotFound } from "@/checkout/views/page-not-found";
import {
	SaleorCheckout,
	CheckoutLoadingFallback,
	PaymentCompletingScreen,
} from "@/checkout/views/saleor-checkout";
import { EmptyCartPage } from "@/checkout/views/empty-cart-page";

function shouldPrioritizeAccountConfirmation(
	searchParams: URLSearchParams,
	loadState: CheckoutLoadState,
): boolean {
	if (!getEmailAndTokenFromSearchParams(searchParams)) {
		return false;
	}

	if (isAccountConfirmationLink(searchParams)) {
		return true;
	}

	// Legacy registration emails pointed at /checkout?checkout=…&email=…&token=…
	return loadState === "not_found";
}

export const RootViews = () => {
	const searchParams = useSearchParams();
	const { loadState, checkout } = useCheckoutData();
	const transition = useCheckoutTransition();
	const accountCredentials = getEmailAndTokenFromSearchParams(searchParams);

	// After checkoutComplete, cookie deletion re-renders this RSC tree with `not_found` while
	// navigation to `/checkout/complete` is still in flight — keep the processing screen up.
	if (transition === "completing") {
		return <PaymentCompletingScreen isShippingRequired={checkout?.isShippingRequired ?? true} />;
	}

	if (accountCredentials && shouldPrioritizeAccountConfirmation(searchParams, loadState)) {
		const channel = checkout?.channel.slug ?? DefaultChannelSlug ?? "default-channel";
		const signInHref = `/${channel}/login`;

		return (
			<ConfirmAccountMode
				email={accountCredentials.email}
				token={accountCredentials.token}
				channel={channel}
				signInHref={signInHref}
				continueShoppingHref={`/${channel}`}
				onConfirmed={() => {
					const cleaned = createQueryString(searchParams, {
						accountConfirm: null,
						passwordResetEmail: null,
						passwordResetToken: null,
					});
					window.history.replaceState(null, "", cleaned ? `/checkout?${cleaned}` : "/checkout");
				}}
			/>
		);
	}

	if (loadState === "none") {
		return (
			<PageNotFound
				title="Your cart is empty"
				message="Add items from the store, then return here to complete your purchase."
			/>
		);
	}

	if (loadState === "not_found") {
		return (
			<PageNotFound
				title="Checkout session expired"
				message="This cart is no longer available. Add items again to start a new checkout."
			/>
		);
	}

	if (loadState === "error") {
		return (
			<PageNotFound
				title="Couldn't load checkout"
				message="We had trouble loading your cart. Please try again or start a new checkout from the store."
			/>
		);
	}

	if (loadState === "empty") {
		return <EmptyCartPage />;
	}

	return (
		<Suspense fallback={<CheckoutLoadingFallback />}>
			<SaleorCheckout />
		</Suspense>
	);
};
