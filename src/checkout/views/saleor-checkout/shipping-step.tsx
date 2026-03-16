"use client";

import { useState, useCallback, useEffect, type FC } from "react";
import { Truck, Clock, Leaf, ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";
import {
	type CheckoutFragment,
	type DeliveryOptionsCalculateMutation,
	useCheckoutDeliveryMethodUpdateMutation,
	useDeliveryOptionsCalculateMutation,
} from "@/checkout/graphql";
import { CheckoutSummaryContext, buildShippingSummaryRows } from "./checkout-summary-context";
import { useCheckout } from "@/checkout/hooks/use-checkout";
import { formatShippingPrice } from "@/checkout/lib/utils/money";
import { localeConfig } from "@/config/locale";
import { MobileStickyAction } from "./mobile-sticky-action";
import { getStepNumber } from "./flow";

type DeliveryOption = DeliveryOptionsCalculateMutation["deliveryOptionsCalculate"] extends
	| { deliveries: infer D }
	| null
	| undefined
	? D extends Array<infer Item>
		? Item
		: never
	: never;

interface ShippingStepProps {
	checkout: CheckoutFragment;
	onBack: () => void;
	onNext: () => void;
}

function hasDeliveryProblem(
	checkout: CheckoutFragment,
	type: "CheckoutProblemDeliveryMethodStale" | "CheckoutProblemDeliveryMethodInvalid",
): boolean {
	return checkout.problems?.some((p) => p.__typename === type) ?? false;
}

export const ShippingStep: FC<ShippingStepProps> = ({ checkout: initialCheckout, onBack, onNext }) => {
	// Use live checkout data that updates after mutations
	const { checkout: liveCheckout, fetching } = useCheckout();
	const checkout = liveCheckout || initialCheckout;

	const hasShippingAddress = !!checkout.shippingAddress;
	const currentDeliveryId = checkout.delivery?.id;

	// Delivery options from deliveryOptionsCalculate mutation
	const [deliveries, setDeliveries] = useState<DeliveryOption[]>([]);
	const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(false);

	// Local state - only saves on Continue
	const [selectedMethod, setSelectedMethod] = useState<string | undefined>(currentDeliveryId);
	const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Problems
	const isStale = hasDeliveryProblem(checkout, "CheckoutProblemDeliveryMethodStale");
	const isInvalid = hasDeliveryProblem(checkout, "CheckoutProblemDeliveryMethodInvalid");

	// Mutations
	const [, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();
	const [, calculateDeliveryOptions] = useDeliveryOptionsCalculateMutation();

	// Fetch delivery options
	const fetchDeliveryOptions = useCallback(async () => {
		setIsLoadingDeliveries(true);
		setError(null);
		try {
			const result = await calculateDeliveryOptions({ id: checkout.id });
			if (result.error) {
				setError("Failed to load shipping methods");
				return;
			}
			const data = result.data?.deliveryOptionsCalculate;
			if (data?.errors?.length) {
				setError(data.errors[0].message ?? "Failed to load shipping methods");
				return;
			}
			const newDeliveries = data?.deliveries ?? [];
			setDeliveries(newDeliveries);

			// If current selection is not in the new list, reset
			if (selectedMethod && !newDeliveries.some((d) => d.id === selectedMethod)) {
				setSelectedMethod(newDeliveries[0]?.id);
			}
			// If no selection yet, default to first
			if (!selectedMethod && newDeliveries.length > 0) {
				setSelectedMethod(newDeliveries[0]?.id);
			}
		} finally {
			setIsLoadingDeliveries(false);
		}
	}, [calculateDeliveryOptions, checkout.id, selectedMethod]);

	// Fetch on mount when address is available
	useEffect(() => {
		if (hasShippingAddress) {
			void fetchDeliveryOptions();
		}
		// Only run on mount and when address changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasShippingAddress, checkout.shippingAddress?.id]);

	// Auto-refresh when delivery is stale
	useEffect(() => {
		if (isStale) {
			void fetchDeliveryOptions();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isStale]);

	// Clear selection when delivery becomes invalid
	useEffect(() => {
		if (isInvalid) {
			setSelectedMethod(undefined);
		}
	}, [isInvalid]);

	// Summary rows for context display
	const summaryRows = buildShippingSummaryRows(checkout);

	const getMethodIcon = (name: string) => {
		const lowerName = name.toLowerCase();
		if (lowerName.includes("express") || lowerName.includes("fast")) return Clock;
		if (lowerName.includes("eco") || lowerName.includes("green")) return Leaf;
		return Truck;
	};

	const isEcoMethod = (name: string) => {
		const lowerName = name.toLowerCase();
		return lowerName.includes("eco") || lowerName.includes("green");
	};

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			if (event) {
				event.preventDefault();
			}

			if (!selectedMethod) {
				setError("Please select a shipping method");
				const firstRadio = document.querySelector('input[name="shipping"]') as HTMLElement;
				firstRadio?.focus();
				return;
			}

			// Skip API call if method hasn't changed
			if (selectedMethod === currentDeliveryId) {
				onNext();
				return;
			}

			setIsSubmittingLocal(true);
			setError(null);

			try {
				const result = await updateDeliveryMethod({
					checkoutId: checkout.id,
					deliveryMethodId: selectedMethod,
					languageCode: localeConfig.graphqlLanguageCode,
				});

				if (result.error) {
					setError("Failed to update shipping method");
					return;
				}

				onNext();
			} finally {
				setIsSubmittingLocal(false);
			}
		},
		[selectedMethod, currentDeliveryId, onNext, updateDeliveryMethod, checkout.id],
	);

	const isLoading = fetching || isLoadingDeliveries;
	const buttonText = isSubmittingLocal ? "Saving..." : "Continue to payment";

	return (
		<form className="space-y-8" onSubmit={handleSubmit}>
			{/* Summary Context */}
			<CheckoutSummaryContext checkout={checkout} rows={summaryRows} onGoToStep={() => onBack()} />

			{/* Invalid delivery warning */}
			{isInvalid && (
				<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
					<p className="text-sm text-amber-800">
						Your previously selected shipping method is no longer available. Please select a new one.
					</p>
				</div>
			)}

			{/* Shipping Methods */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Shipping method</h2>

				{error && <p className="text-sm text-destructive">{error}</p>}

				{isLoading ? (
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
					<div className="space-y-3">
						{deliveries.map((delivery) => {
							const method = delivery.shippingMethod;
							if (!method) return null;

							const Icon = getMethodIcon(method.name);
							const isSelected = selectedMethod === delivery.id;
							const isEco = isEcoMethod(method.name);
							const isFree = method.price?.amount === 0;
							const priceDisplay = formatShippingPrice(method.price);

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
											setSelectedMethod(delivery.id);
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
										{isSelected && <div className="h-2.5 w-2.5 rounded-full bg-foreground" />}
									</div>
									<Icon className={cn("h-5 w-5", isEco ? "text-green-600" : "text-muted-foreground")} />
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{method.name}</span>
											{isEco && (
												<span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
													Eco
												</span>
											)}
										</div>
										{method.minimumDeliveryDays && method.maximumDeliveryDays && (
											<p className="text-sm text-muted-foreground">
												{method.minimumDeliveryDays}-{method.maximumDeliveryDays} business days
											</p>
										)}
									</div>
									<span className={cn("font-medium", isFree && "text-green-600")}>{priceDisplay}</span>
								</label>
							);
						})}
					</div>
				)}
			</section>

			{/* Navigation */}
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ChevronLeft className="h-4 w-4" />
					Return to information
				</button>
				<Button
					type="submit"
					disabled={!selectedMethod || isSubmittingLocal}
					className="hidden h-12 px-8 md:flex"
				>
					{buttonText}
				</Button>
			</div>

			<MobileStickyAction
				step={getStepNumber("SHIPPING", true)}
				isShippingRequired={true}
				type="submit"
				onAction={handleSubmit}
				isLoading={isSubmittingLocal}
				disabled={!selectedMethod}
				loadingText="Saving..."
			/>
		</form>
	);
};
