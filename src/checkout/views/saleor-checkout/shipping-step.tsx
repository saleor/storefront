"use client";

import { useState, useCallback, type FC } from "react";
import { Truck, Clock, Leaf, ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";
import { updateCheckoutDeliveryMethod } from "@/app/(checkout)/actions";
import { type CheckoutFragment } from "@/checkout/graphql";
import type { DeliveryOption, ServerCheckout } from "@/checkout/lib/checkout-types";
import { hasDeliveryProblem } from "@/checkout/lib/delivery-problems";
import { resolveSelectedDeliveryId } from "@/checkout/lib/shipping-deliveries";
import { CheckoutSummaryContext, buildShippingSummaryRows } from "./checkout-summary-context";
import { formatShippingPrice } from "@/checkout/lib/utils/money";
import { MobileStickyAction } from "./mobile-sticky-action";
import { getStepNumber } from "./flow";

interface ShippingStepProps {
	checkout: CheckoutFragment;
	deliveries: DeliveryOption[];
	isLoadingDeliveries: boolean;
	onBack: () => void;
	onComplete: (checkout: ServerCheckout) => void;
}

export const ShippingStep: FC<ShippingStepProps> = ({
	checkout,
	deliveries,
	isLoadingDeliveries,
	onBack,
	onComplete,
}) => {
	const hasShippingAddress = !!checkout.shippingAddress;
	const savedDeliveryId = checkout.delivery?.id;

	const [userSelectedMethod, setUserSelectedMethod] = useState<string | undefined>();
	const selectedMethod = resolveSelectedDeliveryId(userSelectedMethod, deliveries, savedDeliveryId);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const showInvalidWarning =
		hasDeliveryProblem(checkout, "CheckoutProblemDeliveryMethodInvalid") &&
		selectedMethod === savedDeliveryId;

	const summaryRows = buildShippingSummaryRows(checkout);

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();
			if (isSubmitting) return;

			if (!selectedMethod) {
				setError("Please select a shipping method");
				(document.querySelector('input[name="shipping"]') as HTMLElement | null)?.focus();
				return;
			}

			setIsSubmitting(true);
			setError(null);

			try {
				if (selectedMethod !== savedDeliveryId) {
					const result = await updateCheckoutDeliveryMethod(checkout.id, selectedMethod);
					if (!result.ok) {
						setError(result.error ?? result.fieldErrors?.[0]?.message ?? "Failed to update shipping method");
						setIsSubmitting(false);
						return;
					}
					onComplete(result.checkout);
					return;
				}

				onComplete(checkout);
			} catch {
				setIsSubmitting(false);
			}
		},
		[selectedMethod, savedDeliveryId, onComplete, checkout, isSubmitting],
	);

	const showSpinner = isLoadingDeliveries && !isSubmitting && deliveries.length === 0;
	const canContinue = !isSubmitting && deliveries.length > 0 && !!selectedMethod && !showSpinner;
	const buttonText = isSubmitting ? "Saving..." : showSpinner ? "Loading..." : "Continue to payment";

	return (
		<form className="space-y-8" onSubmit={handleSubmit}>
			<CheckoutSummaryContext checkout={checkout} rows={summaryRows} onGoToStep={onBack} />

			{showInvalidWarning ? (
				<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
					<p className="text-sm text-amber-800">
						Your previously selected shipping method is no longer available. Please select a new one.
					</p>
				</div>
			) : null}

			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Shipping method</h2>

				{error ? <p className="text-sm text-destructive">{error}</p> : null}

				{showSpinner ? (
					<div className="flex items-center gap-3 rounded-lg border border-border p-4">
						<div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
						<p className="text-sm text-muted-foreground">Loading shipping methods...</p>
					</div>
				) : deliveries.length === 0 ? (
					<div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
						<p className="text-sm text-amber-800">
							{!hasShippingAddress
								? "Please go back and enter your shipping address first."
								: `No shipping methods available for ${
										checkout.shippingAddress?.country?.country || "your address"
									}. Please check your address or contact support.`}
						</p>
					</div>
				) : (
					<div className={cn("space-y-3", isSubmitting && "pointer-events-none opacity-60")}>
						{deliveries.map((delivery) => {
							const method = delivery.shippingMethod;
							if (!method) return null;

							const isSelected = selectedMethod === delivery.id;
							const name = method.name.toLowerCase();
							const Icon =
								name.includes("express") || name.includes("fast")
									? Clock
									: name.includes("eco") || name.includes("green")
										? Leaf
										: Truck;
							const isEco = name.includes("eco") || name.includes("green");
							const isFree = method.price?.amount === 0;

							return (
								<label
									key={delivery.id}
									className={cn(
										"flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
										"focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2",
										isSelected
											? "bg-secondary/50 border-foreground"
											: "hover:border-muted-foreground/50 border-border",
									)}
								>
									<input
										type="radio"
										name="shipping"
										value={delivery.id}
										checked={isSelected}
										onChange={() => {
											setUserSelectedMethod(delivery.id);
											setError(null);
										}}
										className="sr-only"
									/>
									<div
										className={cn(
											"flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
											isSelected ? "border-foreground" : "border-muted-foreground/50",
										)}
									>
										{isSelected ? <div className="h-2.5 w-2.5 rounded-full bg-foreground" /> : null}
									</div>
									<Icon className={cn("h-5 w-5", isEco ? "text-green-600" : "text-muted-foreground")} />
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{method.name}</span>
											{isEco ? (
												<span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
													Eco
												</span>
											) : null}
										</div>
										{method.minimumDeliveryDays && method.maximumDeliveryDays ? (
											<p className="text-sm text-muted-foreground">
												{method.minimumDeliveryDays}-{method.maximumDeliveryDays} business days
											</p>
										) : null}
									</div>
									<span className={cn("font-medium", isFree && "text-green-600")}>
										{formatShippingPrice(method.price)}
									</span>
								</label>
							);
						})}
					</div>
				)}
			</section>

			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ChevronLeft className="h-4 w-4" />
					Return to information
				</button>
				<Button type="submit" disabled={!canContinue} className="hidden h-12 px-8 md:flex">
					{buttonText}
				</Button>
			</div>

			<MobileStickyAction
				step={getStepNumber("SHIPPING", true)}
				isShippingRequired={true}
				type="submit"
				isLoading={showSpinner || isSubmitting}
				disabled={!canContinue}
				loadingText={isSubmitting ? "Saving..." : "Loading..."}
			/>
		</form>
	);
};
