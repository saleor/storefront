"use client";

import { useCallback, useState, type FC } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { removeCheckoutLine } from "@/app/(checkout)/actions";
import { Button } from "@/ui/components/ui/button";
import { CheckoutIssueBanner } from "@/checkout/components/checkout-issue-banner";
import { useCheckout } from "@/checkout/hooks/use-checkout";
import { useCheckoutStep } from "@/checkout/hooks/use-checkout-step";
import { useCheckoutStepFromUrl } from "@/checkout/hooks/use-checkout-step-from-url";
import { useCustomerAttach } from "@/checkout/hooks/use-customer-attach";
import { useShippingDeliveries } from "@/checkout/hooks/use-shipping-deliveries";
import { useCheckoutSteps } from "@/checkout/hooks/use-checkout-steps";
import { useRefreshCheckoutRsc } from "@/checkout/hooks/use-refresh-checkout-rsc";
import {
	CheckoutAvailabilityProvider,
	useCheckoutAvailability,
} from "@/checkout/providers/checkout-availability";
import { EmptyCartPage } from "@/checkout/views/empty-cart-page";
import { CheckoutPageShell } from "./checkout-page-shell";
import { OrderSummary } from "./order-summary";
import { InformationStep } from "./information-step";
import { ShippingStep } from "./shipping-step";
import { PaymentStep } from "./payment-step";
import { useCheckoutTransition } from "@/checkout/hooks/use-checkout-transition";
import { CheckoutSkeleton } from "./checkout-skeleton";
import { PaymentCompletingScreen } from "./payment-completing-screen";

export const SaleorCheckout: FC = () => {
	return (
		<CheckoutAvailabilityProvider>
			<SaleorCheckoutView />
		</CheckoutAvailabilityProvider>
	);
};

const SaleorCheckoutView: FC = () => {
	const searchParams = useSearchParams();
	const transition = useCheckoutTransition();
	const { checkout, setCheckout, refetch } = useCheckout();
	const { availabilityIssue, setAvailabilityIssue } = useCheckoutAvailability();
	const tErrors = useTranslations("checkout.errors");
	// RootViews shows PaymentCompletingScreen while `transition === "completing"` — keep this
	// as defense-in-depth if SaleorCheckout is ever mounted outside RootViews.
	const [isPaymentBusy, setIsPaymentBusy] = useState(false);
	const [isRemovingUnavailableLine, setIsRemovingUnavailableLine] = useState(false);
	const [removeUnavailableError, setRemoveUnavailableError] = useState<string | null>(null);
	const refreshCheckoutRsc = useRefreshCheckoutRsc();
	const isPaymentFlowActive = transition === "completing";
	const isCheckoutNavigationLocked = isPaymentFlowActive || isPaymentBusy;

	const removeUnavailableLine = useCallback(
		async (lineId: string) => {
			if (!checkout || isRemovingUnavailableLine) {
				return;
			}

			setIsRemovingUnavailableLine(true);
			setRemoveUnavailableError(null);
			try {
				const result = await removeCheckoutLine(checkout.id, lineId);
				if (!result.ok) {
					setRemoveUnavailableError(tErrors("itemUnavailableRemoveFailed"));
					return;
				}

				setCheckout(result.checkout);
				const remainingIds = (availabilityIssue?.lineIds ?? []).filter((id) => id !== lineId);
				setAvailabilityIssue(
					remainingIds.length && availabilityIssue ? { ...availabilityIssue, lineIds: remainingIds } : null,
				);

				if (result.checkout.lines.length === 0) {
					refreshCheckoutRsc();
				}
			} catch {
				setRemoveUnavailableError(tErrors("itemUnavailableRemoveFailed"));
			} finally {
				setIsRemovingUnavailableLine(false);
			}
		},
		[
			availabilityIssue,
			checkout,
			isRemovingUnavailableLine,
			refreshCheckoutRsc,
			tErrors,
			setAvailabilityIssue,
			setCheckout,
		],
	);

	useCustomerAttach();

	const isShippingRequired = checkout?.isShippingRequired ?? true;
	const checkoutSteps = useCheckoutSteps(isShippingRequired);
	const urlStep = useCheckoutStepFromUrl(searchParams, isShippingRequired);
	const { currentStep, stepRef, goToStep, completeStep } = useCheckoutStep({
		isShippingRequired,
		searchParams,
		setCheckout,
	});

	const { deliveries: shippingDeliveries, isLoading: isLoadingShippingDeliveries } = useShippingDeliveries(
		checkout,
		currentStep.id === "SHIPPING",
	);

	if (isPaymentFlowActive) {
		return (
			<PaymentCompletingScreen
				isShippingRequired={isShippingRequired}
				storefrontChannel={checkout?.channel.slug}
			/>
		);
	}

	if (!checkout) {
		return <CheckoutSkeleton step={urlStep.index} isShippingRequired={isShippingRequired} />;
	}

	if (checkout.lines.length === 0) {
		return <EmptyCartPage />;
	}

	return (
		<CheckoutPageShell
			step={currentStep.index}
			onStepClick={
				isCheckoutNavigationLocked
					? undefined
					: (stepIndex) => {
							const step = checkoutSteps.find((s) => s.index === stepIndex);
							if (step) goToStep(step.id);
						}
			}
			isShippingRequired={isShippingRequired}
			storefrontChannel={checkout.channel.slug}
		>
			<main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 md:py-8 md:pb-8 lg:px-8">
				<div className="flex flex-col gap-8 md:flex-row">
					<div className="min-w-0 flex-1">
						<div className="mb-4 overflow-hidden rounded-lg border border-border bg-card md:hidden">
							<OrderSummary
								checkout={checkout}
								onCheckoutChange={() => void refetch()}
								unavailableLineIds={availabilityIssue?.lineIds}
								onRemoveUnavailableLine={removeUnavailableLine}
								isRemovingUnavailableLine={isRemovingUnavailableLine}
							/>
						</div>
						<div className="rounded-lg border border-border bg-card p-6 md:p-8">
							<div ref={stepRef} tabIndex={-1} className="outline-none">
								{availabilityIssue ? (
									<div className="mb-8">
										<CheckoutIssueBanner
											title={tErrors("itemUnavailableTitle")}
											action={
												availabilityIssue.lineIds[0] ? (
													<Button
														type="button"
														variant="outline-solid"
														size="sm"
														disabled={isRemovingUnavailableLine}
														onClick={() => void removeUnavailableLine(availabilityIssue.lineIds[0])}
													>
														{tErrors("itemUnavailableRemove")}
													</Button>
												) : undefined
											}
										>
											<p>
												{availabilityIssue.lineIds.length
													? tErrors("itemUnavailableRemoveMessage")
													: tErrors("itemUnavailableMessage")}
											</p>
											{removeUnavailableError ? (
												<p className="mt-2 text-destructive">{removeUnavailableError}</p>
											) : null}
										</CheckoutIssueBanner>
									</div>
								) : null}
								{currentStep.id === "INFO" ? (
									<InformationStep
										checkout={checkout}
										onComplete={(updated) =>
											completeStep(updated, updated.isShippingRequired ? "SHIPPING" : "PAYMENT")
										}
									/>
								) : null}
								{currentStep.id === "SHIPPING" ? (
									<ShippingStep
										checkout={checkout}
										deliveries={shippingDeliveries}
										isLoadingDeliveries={isLoadingShippingDeliveries}
										onBack={() => goToStep("INFO")}
										onComplete={(updated) => completeStep(updated, "PAYMENT")}
									/>
								) : null}
								{currentStep.id === "PAYMENT" ? (
									<PaymentStep
										checkout={checkout}
										onBack={() => goToStep(isShippingRequired ? "SHIPPING" : "INFO")}
										onGoToInformation={() => goToStep("INFO")}
										onPaymentBusyChange={setIsPaymentBusy}
									/>
								) : null}
							</div>
						</div>
					</div>

					<div className="hidden md:block md:shrink-0 md:basis-[30%]">
						<div className="overflow-hidden rounded-lg border border-border bg-card md:sticky md:top-8">
							<OrderSummary
								checkout={checkout}
								onCheckoutChange={() => void refetch()}
								unavailableLineIds={availabilityIssue?.lineIds}
								onRemoveUnavailableLine={removeUnavailableLine}
								isRemovingUnavailableLine={isRemovingUnavailableLine}
							/>
						</div>
					</div>
				</div>
			</main>
		</CheckoutPageShell>
	);
};
