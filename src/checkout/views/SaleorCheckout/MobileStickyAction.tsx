"use client";

import { type FC } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/ui/components/ui/Button";
import { LoadingSpinner } from "@/checkout/ui-kit/LoadingSpinner";
import { getStepNumber } from "./flow";

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
}) => {
	// Determine button text based on step
	const getButtonText = () => {
		if (isLoading && loadingText) return loadingText;

		const paymentStep = getStepNumber("PAYMENT", isShippingRequired);
		const shippingStep = getStepNumber("SHIPPING", isShippingRequired);
		const infoStep = getStepNumber("INFO", isShippingRequired);

		if (step === paymentStep) {
			return total ? `Pay ${total}` : "Pay now";
		}

		if (step === infoStep) {
			return isShippingRequired ? "Continue to shipping" : "Continue to payment";
		}

		if (step === shippingStep) {
			return "Continue to payment";
		}

		return "Continue";
	};

	return (
		<div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 md:hidden">
			<Button
				type={type}
				onClick={onAction}
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
