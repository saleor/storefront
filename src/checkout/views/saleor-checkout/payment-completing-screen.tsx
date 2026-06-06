import { SaleorThrobber } from "@/checkout/ui-kit/saleor-throbber";
import { getStepNumber } from "./flow";
import { CheckoutPageShell } from "./checkout-page-shell";

type PaymentCompletingScreenProps = {
	isShippingRequired?: boolean;
};

/**
 * Full-page state while payment is confirmed and checkoutComplete runs.
 * Gateway-agnostic — shown for Stripe, dummy, and future Saleor payment apps.
 */
export function PaymentCompletingScreen({ isShippingRequired = true }: PaymentCompletingScreenProps) {
	const step = getStepNumber("PAYMENT", isShippingRequired);

	return (
		<CheckoutPageShell step={step} isShippingRequired={isShippingRequired}>
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
							Processing your order
						</h1>
						<p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
							We&apos;re confirming your payment and creating your order. This usually takes a few seconds —
							please don&apos;t close or refresh this page.
						</p>
					</div>
				</div>
			</main>
		</CheckoutPageShell>
	);
}
