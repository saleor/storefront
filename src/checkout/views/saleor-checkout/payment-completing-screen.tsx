"use client";

import { useTranslations } from "next-intl";
import { SaleorThrobber } from "@/checkout/ui-kit/saleor-throbber";
import { useCheckoutStepNumber } from "@/checkout/hooks/use-checkout-steps";
import { CheckoutPageShell } from "./checkout-page-shell";

type PaymentCompletingScreenProps = {
	isShippingRequired?: boolean;
	storefrontChannel?: string | null;
};

/**
 * Full-page state while payment is confirmed and checkoutComplete runs.
 * Gateway-agnostic — shown for Stripe, dummy, and future Saleor payment apps.
 */
export function PaymentCompletingScreen({
	isShippingRequired = true,
	storefrontChannel,
}: PaymentCompletingScreenProps) {
	const t = useTranslations("checkout.payment");
	const step = useCheckoutStepNumber("PAYMENT", isShippingRequired);

	return (
		<CheckoutPageShell
			step={step}
			isShippingRequired={isShippingRequired}
			storefrontChannel={storefrontChannel}
		>
			<main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 md:py-8 md:pb-8 lg:px-8">
				<div className="min-w-0 flex-1">
					<div
						className="flex min-h-[min(560px,calc(100dvh-11rem))] flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center md:p-12"
						role="status"
						aria-live="polite"
						aria-busy="true"
					>
						<SaleorThrobber size={40} className="text-muted-foreground" />

						<h1 className="mt-5 text-lg font-semibold tracking-tight text-foreground md:text-xl">
							{t("completingTitle")}
						</h1>
						<p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
							{t("completingBody")}
						</p>
					</div>
				</div>
			</main>
		</CheckoutPageShell>
	);
}
