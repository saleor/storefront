"use client";

import { useCallback, useMemo, useState, type FC } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { removeCheckoutLines, updateCheckoutLineQuantity } from "@/app/(checkout)/actions";
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
	availabilityIssueForLines,
	availabilityIssueWithoutLine,
	unavailableGiftLineIds,
	type CheckoutAvailability,
} from "@/checkout/lib/checkout-availability";
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
	const { availability, setDestinationIssue } = useCheckoutAvailability();
	const tErrors = useTranslations("checkout.errors");
	// RootViews shows PaymentCompletingScreen while `transition === "completing"` — keep this
	// as defense-in-depth if SaleorCheckout is ever mounted outside RootViews.
	const [isPaymentBusy, setIsPaymentBusy] = useState(false);
	const [isUpdatingUnavailableLine, setIsUpdatingUnavailableLine] = useState(false);
	const [unavailableLineError, setUnavailableLineError] = useState<string | null>(null);
	const refreshCheckoutRsc = useRefreshCheckoutRsc();
	const isPaymentFlowActive = transition === "completing";
	const isCheckoutNavigationLocked = isPaymentFlowActive || isPaymentBusy;

	const removeUnavailableLines = useCallback(
		async (lineIds: readonly string[]) => {
			if (!checkout || isUpdatingUnavailableLine || lineIds.length === 0) {
				return;
			}

			const failedMessage = tErrors("itemUnavailableRemoveFailed", { count: lineIds.length });
			setIsUpdatingUnavailableLine(true);
			setUnavailableLineError(null);
			try {
				const result = await removeCheckoutLines(checkout.id, [...lineIds]);
				if (!result.ok) {
					setUnavailableLineError(failedMessage);
					return;
				}

				// Stock lines come from the new checkout's `problems`. A destination issue keeps its
				// lines still in the cart; read the current one, a step may have replaced it meanwhile.
				setCheckout(result.checkout);
				setDestinationIssue((current) => availabilityIssueForLines(current, result.checkout.lines));

				if (result.checkout.lines.length === 0) {
					refreshCheckoutRsc();
				}
			} catch {
				setUnavailableLineError(failedMessage);
			} finally {
				setIsUpdatingUnavailableLine(false);
			}
		},
		[checkout, isUpdatingUnavailableLine, refreshCheckoutRsc, tErrors, setDestinationIssue, setCheckout],
	);
	const removeUnavailableLine = useCallback(
		(lineId: string) => removeUnavailableLines([lineId]),
		[removeUnavailableLines],
	);
	const reduceUnavailableLine = useCallback(
		async (lineId: string, quantity: number) => {
			if (!checkout || isUpdatingUnavailableLine || quantity < 1) {
				return;
			}

			const failedMessage = tErrors("itemReduceFailed");
			setIsUpdatingUnavailableLine(true);
			setUnavailableLineError(null);
			try {
				const result = await updateCheckoutLineQuantity(checkout.id, lineId, quantity);
				if (!result.ok) {
					setUnavailableLineError(failedMessage);
					return;
				}

				// The line now asks for what Saleor has for this address. If that changed meanwhile,
				// the new checkout's `problems` flag it again.
				setCheckout(result.checkout);
				setDestinationIssue((current) => availabilityIssueWithoutLine(current, lineId));
			} catch {
				setUnavailableLineError(failedMessage);
			} finally {
				setIsUpdatingUnavailableLine(false);
			}
		},
		[checkout, isUpdatingUnavailableLine, tErrors, setDestinationIssue, setCheckout],
	);

	const giftLineIds = useMemo(() => unavailableGiftLineIds(checkout), [checkout]);

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
								unavailableLines={availability?.lines}
								unavailableKey={availability?.key}
								unavailableGiftLineIds={giftLineIds}
								onRemoveUnavailableLine={removeUnavailableLine}
								onReduceUnavailableLine={reduceUnavailableLine}
								isUpdatingUnavailableLine={isUpdatingUnavailableLine}
							/>
						</div>
						<div className="rounded-lg border border-border bg-card p-6 md:p-8">
							<div ref={stepRef} tabIndex={-1} className="outline-none">
								{availability ? (
									<div className="mb-8">
										<UnavailableItemsBanner
											availability={availability}
											error={unavailableLineError}
											isBusy={isUpdatingUnavailableLine}
											onRemove={(lineIds) => void removeUnavailableLines(lineIds)}
										/>
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
								unavailableLines={availability?.lines}
								unavailableKey={availability?.key}
								unavailableGiftLineIds={giftLineIds}
								onRemoveUnavailableLine={removeUnavailableLine}
								onReduceUnavailableLine={reduceUnavailableLine}
								isUpdatingUnavailableLine={isUpdatingUnavailableLine}
							/>
						</div>
					</div>
				</div>
			</main>
		</CheckoutPageShell>
	);
};

type UnavailableItemsBannerProps = {
	availability: CheckoutAvailability;
	error: string | null;
	isBusy: boolean;
	onRemove: (lineIds: readonly string[]) => void;
};

/** What blocks the order and how to fix it. The summary lists the lines and their actions. */
function UnavailableItemsBanner({ availability, error, isBusy, onRemove }: UnavailableItemsBannerProps) {
	const tErrors = useTranslations("checkout.errors");
	const { stock, destination, lines, removableLineIds } = availability;
	const soldOut = stock.filter((line) => line.availableQuantity === 0).length;
	const short = stock.length - soldOut;
	const destinationOnly = lines.filter((line) => line.availableQuantity === null).length;
	// Lines the destination issue flagged that the stock messages already cover.
	const stockIds = new Set(stock.map((line) => line.id));
	const destinationCoveredByStock = destination?.lineIds.some((id) => stockIds.has(id)) ?? false;

	return (
		<CheckoutIssueBanner
			// No matched line still means at least one item is unavailable.
			title={tErrors("itemUnavailableTitle", { count: Math.max(lines.length, 1) })}
			action={
				removableLineIds.length ? (
					<Button
						type="button"
						variant="outline-solid"
						size="sm"
						disabled={isBusy}
						onClick={() => onRemove(removableLineIds)}
					>
						{tErrors("itemUnavailableRemove", { count: removableLineIds.length })}
					</Button>
				) : undefined
			}
		>
			<div className="space-y-1">
				{soldOut ? <p>{tErrors("itemOutOfStockMessage", { count: soldOut })}</p> : null}
				{short ? <p>{tErrors("itemShortStockMessage", { count: short })}</p> : null}
				{destination && destinationOnly ? (
					<p>{tErrors("itemUnavailableRemoveMessage", { count: destinationOnly })}</p>
				) : null}
				{/* No line the shopper can remove (none matched, or only a gift): only the address can change. */}
				{destination && !destinationOnly && !destinationCoveredByStock ? (
					<p>{tErrors("itemUnavailableMessage")}</p>
				) : null}
				{error ? <p className="text-destructive">{error}</p> : null}
			</div>
		</CheckoutIssueBanner>
	);
}
