"use client";

import { Suspense } from "react";
import { useCheckoutTransition } from "@/checkout/hooks/use-checkout-transition";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { PageNotFound } from "@/checkout/views/page-not-found";
import {
	SaleorCheckout,
	CheckoutLoadingFallback,
	PaymentCompletingScreen,
} from "@/checkout/views/saleor-checkout";
import { EmptyCartPage } from "@/checkout/views/empty-cart-page";

export const RootViews = () => {
	const { loadState, checkout } = useCheckoutData();
	const transition = useCheckoutTransition();

	// After checkoutComplete, cookie deletion re-renders this RSC tree with `not_found` while
	// navigation to `/checkout/complete` is still in flight — keep the processing screen up.
	if (transition === "completing") {
		return <PaymentCompletingScreen isShippingRequired={checkout?.isShippingRequired ?? true} />;
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
