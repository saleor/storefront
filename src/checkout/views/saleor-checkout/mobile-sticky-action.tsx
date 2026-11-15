"use client";

import { type FC } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/ui/button";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { useCheckoutStepNumber } from "@/checkout/hooks/use-checkout-steps";
import { OrderLegalNotice } from "@/checkout/components/payment/order-legal-notice";
import {
	PaymentTrustSignals,
	type PaymentTrustProvider,
} from "@/checkout/components/payment/payment-trust-signals";

interface MobileStickyActionProps {
	/** Current step number */
	step: number;
	/** Whether shipping is required (affects step labels) */
	isShippingRequired: boolean;
	/** Whether the action is loading */
	isLoading?: boolean;
	/** Whether the action button should be disabled */
	disabled?: boolean;
	/** Custom loading text */
	loadingText?: string;
	/** Total shown directly above the button on the payment step, never on it. */
	total?: string;
	/** Whether the total includes VAT, so the line can say so. */
	totalIncludesTax?: boolean;
	/** Click handler */
	onAction?: () => void;
	/** Button type */
	type?: "button" | "submit";
	/** Show payment trust copy above the CTA (payment step, server-submit flows). */
	showPaymentTrust?: boolean;
	paymentTrustProvider?: PaymentTrustProvider;
}

/**
 * Sticky action bar for mobile checkout.
 * Shows at the bottom of the screen with context-aware CTA.
 */
export const MobileStickyAction: FC<MobileStickyActionProps> = ({
	step,
	isShippingRequired,
	isLoading = false,
	disabled = false,
	loadingText,
	total,
	totalIncludesTax = false,
	onAction,
	type = "button",
	showPaymentTrust = false,
	paymentTrustProvider = "default",
}) => {
	const t = useTranslations("checkout.actions");
	const tSummary = useTranslations("checkout.summary");
	const paymentStep = useCheckoutStepNumber("PAYMENT", isShippingRequired);
	const shippingStep = useCheckoutStepNumber("SHIPPING", isShippingRequired);
	const infoStep = useCheckoutStepNumber("INFO", isShippingRequired);

	const getButtonText = () => {
		if (isLoading && loadingText) return loadingText;

		if (step === paymentStep) {
			return t("buyNow");
		}

		if (step === infoStep) {
			return isShippingRequired ? t("continueToShipping") : t("continueToPayment");
		}

		if (step === shippingStep) {
			return t("continueToPayment");
		}

		return t("continue");
	};

	const isPaymentStep = step === paymentStep;

	return (
		<div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 md:hidden">
			{showPaymentTrust && isPaymentStep ? (
				<PaymentTrustSignals variant="compact" provider={paymentTrustProvider} className="mb-3" />
			) : null}
			{/* The bar is always on screen, so the notice belongs here, next to the button it is about. */}
			{isPaymentStep ? <OrderLegalNotice className="mb-3 text-center text-[11px] leading-snug" /> : null}
			{/* The button carries only the order words; the total sits directly above it. */}
			{isPaymentStep && total ? (
				<div className="mb-3 flex items-baseline justify-between gap-3 text-sm">
					<span className="text-muted-foreground">{tSummary("total")}</span>
					<span className="tabular-nums">
						<span className="font-semibold text-foreground">{total}</span>
						{totalIncludesTax ? (
							<span className="ml-1.5 text-xs text-muted-foreground">{tSummary("includingVat")}</span>
						) : null}
					</span>
				</div>
			) : null}
			<Button
				type={type}
				onClick={type === "button" ? onAction : undefined}
				disabled={disabled || isLoading}
				className="h-12 w-full text-base font-semibold"
			>
				{isLoading ? (
					<span className="flex items-center gap-2">
						<LoadingSpinner />
						{getButtonText()}
					</span>
				) : (
					<span className="flex items-center gap-2">
						{getButtonText()}
						<ChevronRight className="h-5 w-5" />
					</span>
				)}
			</Button>
		</div>
	);
};
