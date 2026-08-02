"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DefaultChannelSlug } from "@/app/config";
import { useCheckoutBrowseLocale } from "@/checkout/providers/checkout-browse";
import { buildStorefrontPath } from "@/lib/storefront-path";
import {
	getEmailAndTokenFromSearchParams,
	isAccountConfirmationLink,
} from "@/lib/auth/account-confirmation-url";
import { useTranslations } from "next-intl";
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
import { useCheckoutContent } from "@/lib/content";

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
	const { emptySession } = useCheckoutContent();
	const t = useTranslations("checkout.errors");
	const storefrontLocale = useCheckoutBrowseLocale();
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
		const signInHref = buildStorefrontPath(storefrontLocale, channel, "/login");

		return (
			<ConfirmAccountMode
				email={accountCredentials.email}
				token={accountCredentials.token}
				locale={storefrontLocale}
				channel={channel}
				signInHref={signInHref}
				continueShoppingHref={buildStorefrontPath(storefrontLocale, channel)}
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
		return <PageNotFound title={emptySession.title} message={emptySession.message} />;
	}

	if (loadState === "not_found") {
		return <PageNotFound title={t("sessionExpiredTitle")} message={t("sessionExpiredMessage")} />;
	}

	if (loadState === "error") {
		return <PageNotFound title={t("loadFailedTitle")} message={t("loadFailedMessage")} />;
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
