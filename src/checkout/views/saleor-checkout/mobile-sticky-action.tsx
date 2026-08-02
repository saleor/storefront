"use client";

import { type FC } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/ui/button";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { useCheckoutStepNumber } from "@/checkout/hooks/use-checkout-steps";
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
	/** Total to display (for payment step) */
	total?: string;
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
	onAction,
	type = "button",
	showPaymentTrust = false,
	paymentTrustProvider = "default",
}) => {
	const t = useTranslations("checkout.actions");
	const paymentStep = useCheckoutStepNumber("PAYMENT", isShippingRequired);
	const shippingStep = useCheckoutStepNumber("SHIPPING", isShippingRequired);
	const infoStep = useCheckoutStepNumber("INFO", isShippingRequired);

	const getButtonText = () => {
		if (isLoading && loadingText) return loadingText;

		if (step === paymentStep) {
			return total ? t("payTotal", { total }) : t("payNow");
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
