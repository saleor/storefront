"use client";

import { useEffect, useRef, type FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckoutHeader } from "./CheckoutHeader";
import { OrderSummary } from "./OrderSummary";
import { InformationStep } from "./InformationStep";
import { ShippingStep } from "./ShippingStep";
import { PaymentStep } from "./PaymentStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useUser } from "@/checkout/hooks/useUser";
import { useCustomerAttach } from "@/checkout/hooks/useCustomerAttach";
import { EmptyCartPage } from "../EmptyCartPage";
import { PageNotFound } from "../PageNotFound";
import { CheckoutSkeleton } from "./CheckoutSkeleton";
import { getCheckoutSteps, getCurrentStepFromParams, type CheckoutStepType } from "./flow";
import { createQueryString } from "@/checkout/lib/utils/url";

/**
 * Saleor checkout view with multi-step flow.
 *
 * Uses consistent step-by-step flow for all users.
 * For logged-in users with addresses, InformationStep shows address selector.
 * For guests, InformationStep shows address form.
 *
 * For digital products (isShippingRequired=false), shipping step is skipped.
 *
 * Layout: Full-width header, centered two-column content on gray background.
 */
export const SaleorCheckout: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { checkout, fetching: fetchingCheckout, hasCheckoutId } = useCheckout();
	const { loading: isAuthenticating } = useUser();

	// Auto-attach logged-in user to checkout (runs once, persists across step changes)
	useCustomerAttach();

	// For digital products, skip shipping step (1 = info, 2 = payment, 3 = confirmation)
	// For physical products, full flow (1 = info, 2 = shipping, 3 = payment, 4 = confirmation)
	const isShippingRequired = checkout?.isShippingRequired ?? true;

	// Determine current step from URL
	const currentStep = getCurrentStepFromParams(searchParams, isShippingRequired);

	const stepRef = useRef<HTMLDivElement>(null);

	// Scroll to top and focus content when step changes (mobile UX + a11y)
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
		stepRef.current?.focus();
	}, [currentStep.id]);

	// Checkout is invalid if: no checkout ID in URL, or fetching is done but no checkout data
	const isCheckoutInvalid = !hasCheckoutId || (!fetchingCheckout && !checkout && !isAuthenticating);
	const isEmptyCart = checkout && !checkout.lines.length;

	// Only show skeleton on initial load when we have no data yet
	const showInitialSkeleton = !checkout && (isAuthenticating || fetchingCheckout);

	if (isCheckoutInvalid) {
		return <PageNotFound />;
	}

	if (showInitialSkeleton) {
		return <CheckoutSkeleton />;
	}

	if (isEmptyCart) {
		return <EmptyCartPage />;
	}

	// Navigation helper
	const goToStep = (stepType: CheckoutStepType) => {
		const steps = getCheckoutSteps(isShippingRequired);
		const targetStep = steps.find((s) => s.id === stepType);
		if (targetStep) {
			const newQuery = createQueryString(searchParams, { step: targetStep.slug });
			// Using replace for smoother UX, could use push for history
			router.push(`?${newQuery}`, { scroll: false });
		}
	};

	return (
		<div className="min-h-screen overscroll-none bg-secondary">
			{/* Header - full width, white background */}
			<CheckoutHeader
				step={currentStep.index}
				onStepClick={(stepIndex) => {
					// Find step by index to get its slug
					const steps = getCheckoutSteps(isShippingRequired);
					const step = steps.find((s) => s.index === stepIndex);
					if (step) {
						goToStep(step.id);
					}
				}}
				isShippingRequired={isShippingRequired}
			/>

			{/* Main content - centered, same max-width as main page */}
			{/* pb-24 on mobile accounts for the fixed bottom action bar */}
			<main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 md:py-8 md:pb-8 lg:px-8">
				{/* Two column layout: ~70% Form + ~30% Summary */}
				<div className="flex flex-col gap-8 md:flex-row">
					{/* Left column: Form (~70%) */}
					<div className="min-w-0 flex-1">
						{/* Mobile Order Summary - collapsible, inside scrollable content */}
						<div className="mb-4 overflow-hidden rounded-lg border border-border bg-card md:hidden">
							<OrderSummary checkout={checkout} />
						</div>
						<div className="rounded-lg border border-border bg-card p-6 md:p-8">
							<div ref={stepRef} tabIndex={-1} className="outline-none">
								{currentStep.id === "INFO" && (
									<InformationStep
										checkout={checkout}
										onNext={() => goToStep(isShippingRequired ? "SHIPPING" : "PAYMENT")}
									/>
								)}
								{currentStep.id === "SHIPPING" && (
									<ShippingStep
										checkout={checkout}
										onBack={() => goToStep("INFO")}
										onNext={() => goToStep("PAYMENT")}
									/>
								)}
								{currentStep.id === "PAYMENT" && (
									<PaymentStep
										checkout={checkout}
										onBack={() => goToStep(isShippingRequired ? "SHIPPING" : "INFO")}
										onComplete={() => goToStep("CONFIRMATION")}
										onGoToInformation={() => goToStep("INFO")}
									/>
								)}
								{currentStep.id === "CONFIRMATION" && <ConfirmationStep checkout={checkout} />}
							</div>
						</div>
					</div>

					{/* Right column: Summary (~30%) - hidden on mobile, shown on desktop */}
					<div className="hidden md:block md:shrink-0 md:basis-[30%]">
						<div className="overflow-hidden rounded-lg border border-border bg-card md:sticky md:top-8">
							<OrderSummary checkout={checkout} />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
