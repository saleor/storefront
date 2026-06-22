"use client";

import { useState, useCallback, useMemo, useEffect, type FC } from "react";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import {
	CheckoutSummaryContext,
	buildPaymentSummaryRows,
	useCheckoutSummaryLabels,
} from "./checkout-summary-context";
import { type CheckoutFragment, type CountryCode, type AddressFragment } from "@/checkout/graphql";
import { useUser } from "@/checkout/hooks/use-user";
import { useCheckoutPayment } from "@/checkout/hooks/use-checkout-payment";
import { MobileStickyAction } from "./mobile-sticky-action";
import { useCheckoutStepNumber } from "@/checkout/hooks/use-checkout-steps";
import { useTranslations } from "next-intl";
import {
	PaymentGatewayAlerts,
	PaymentMethodArea,
	PaymentError,
	PaymentTrustSignals,
	BillingAddressSection,
	type BillingAddressData,
} from "@/checkout/components/payment";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { getFormattedMoney, formatMoneyWithFallback } from "@/checkout/lib/utils/money";
import { AuthorizedPaymentRecovery } from "@/checkout/components/payment/stripe/authorized-payment-recovery";
import { isCheckoutFreeOrder } from "@/checkout/lib/payment/checkout-pay-amount";
import { shouldShowPaymentMethodArea } from "@/checkout/lib/payment/should-show-payment-method-area";
import { usesClientPaymentSubmit } from "@/checkout/lib/payment";
import { consumePaymentCompletionError } from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutPaymentReturnError } from "@/checkout/providers/checkout-payment-return-error";

interface PaymentStepProps {
	checkout: CheckoutFragment;
	onBack: () => void;
	onGoToInformation?: () => void;
	onPaymentBusyChange?: (busy: boolean) => void;
}

export const PaymentStep: FC<PaymentStepProps> = ({
	checkout,
	onBack,
	onGoToInformation,
	onPaymentBusyChange,
}) => {
	const { user, authenticated } = useUser();
	const tActions = useTranslations("checkout.actions");
	const tPayment = useTranslations("checkout.payment");
	const isShippingRequired = checkout.isShippingRequired;
	const paymentStep = useCheckoutStepNumber("PAYMENT", isShippingRequired);
	const hasShippingAddress = !!checkout.shippingAddress;
	const shippingAddress = checkout.shippingAddress;

	const [isPaymentBusy, setIsPaymentBusy] = useState(false);
	const [sameAsBilling, setSameAsBilling] = useState(isShippingRequired && hasShippingAddress);
	const [billingData, setBillingData] = useState<BillingAddressData>(() => ({
		countryCode: (checkout.billingAddress?.country?.code as CountryCode) || "US",
		formData: {
			firstName: checkout.billingAddress?.firstName || "",
			lastName: checkout.billingAddress?.lastName || "",
			streetAddress1: checkout.billingAddress?.streetAddress1 || "",
			streetAddress2: checkout.billingAddress?.streetAddress2 || "",
			companyName: checkout.billingAddress?.companyName || "",
			city: checkout.billingAddress?.city || "",
			postalCode: checkout.billingAddress?.postalCode || "",
			countryArea: checkout.billingAddress?.countryArea || "",
			phone: checkout.billingAddress?.phone || "",
		},
	}));

	const { error: returnError, clearError: clearReturnError } = useCheckoutPaymentReturnError();

	const {
		submit,
		errors,
		setPaymentError,
		setBillingErrors,
		setPriceChangeNotice,
		priceChangeNotice,
		provider,
		canSubmit,
		isLoading,
		isCompletingOrder,
	} = useCheckoutPayment({
		checkout,
		billingData,
		sameAsBilling,
		hasShippingAddress,
		shippingAddress,
		userAddresses: user?.addresses,
		authenticated,
	});

	const usesClientSubmit = usesClientPaymentSubmit(provider);
	const isFreeOrder = isCheckoutFreeOrder(checkout);

	const handlePaymentError = useCallback(
		(message: string) => {
			clearReturnError();
			setPaymentError(message);
		},
		[clearReturnError, setPaymentError],
	);

	useEffect(() => {
		const stashedError = consumePaymentCompletionError();
		if (stashedError) {
			handlePaymentError(stashedError);
		}
	}, [handlePaymentError]);

	const handlePaymentActivityChange = useCallback(
		(active: boolean) => {
			setIsPaymentBusy(active);
			onPaymentBusyChange?.(active);
		},
		[onPaymentBusyChange],
	);

	useEffect(() => {
		return () => {
			onPaymentBusyChange?.(false);
		};
	}, [onPaymentBusyChange]);

	const handleBillingDataChange = useCallback((data: BillingAddressData) => {
		setBillingData(data);
	}, []);

	const summaryLabels = useCheckoutSummaryLabels();
	const summaryRows = useMemo(
		() => buildPaymentSummaryRows(checkout, summaryLabels),
		[checkout, summaryLabels],
	);

	const handleGoToStep = (step: number) => {
		if (step === 1 && onGoToInformation) {
			onGoToInformation();
		} else if (step === 2) {
			onBack();
		}
	};

	const total = checkout.totalPrice?.gross;
	const totalStr = formatMoneyWithFallback(total);

	const buttonText = isLoading
		? isCompletingOrder
			? tActions("creatingOrder")
			: isFreeOrder
				? tActions("placingOrder")
				: tActions("processingPayment")
		: isFreeOrder
			? tActions("completeOrder")
			: tActions("payTotal", { total: totalStr });

	const hasInvalidDelivery = checkout.problems?.some(
		(p) => p.__typename === "CheckoutProblemDeliveryMethodInvalid",
	);

	const billingFieldErrors = useMemo(() => {
		const { payment, billing, ...fieldErrors } = errors;
		return fieldErrors;
	}, [errors]);

	const isDisabled = isLoading || hasInvalidDelivery || (!canSubmit && !isFreeOrder);

	const paymentContent = (
		<>
			{priceChangeNotice ? (
				<div
					className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4"
					role="status"
				>
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
					<div>
						<p className="font-medium text-amber-800">{tPayment("totalUpdatedTitle")}</p>
						<p className="mt-1 text-sm text-amber-700">
							{tPayment("totalUpdatedBody", {
								previous: getFormattedMoney({
									amount: priceChangeNotice.previousAmount,
									currency: priceChangeNotice.currency,
								}),
								next: getFormattedMoney({
									amount: priceChangeNotice.newAmount,
									currency: priceChangeNotice.currency,
								}),
							})}
						</p>
					</div>
				</div>
			) : null}

			<CheckoutSummaryContext
				checkout={checkout}
				rows={summaryRows}
				onGoToStep={isPaymentBusy ? undefined : handleGoToStep}
			/>

			{hasInvalidDelivery && (
				<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
					<div>
						<p className="font-medium text-amber-800">{tPayment("deliveryInvalidTitle")}</p>
						<p className="mt-1 text-sm text-amber-700">{tPayment("deliveryInvalidBody")}</p>
					</div>
				</div>
			)}

			<PaymentGatewayAlerts gateways={checkout.availablePaymentGateways} />

			{usesClientSubmit && !isFreeOrder ? (
				<AuthorizedPaymentRecovery checkout={checkout} onError={handlePaymentError} />
			) : null}

			{usesClientSubmit ? (
				<BillingAddressSection
					billingAddress={checkout.billingAddress}
					shippingAddress={shippingAddress}
					userAddresses={authenticated ? (user?.addresses as AddressFragment[]) : undefined}
					defaultBillingAddressId={user?.defaultBillingAddress?.id}
					isShippingRequired={isShippingRequired}
					errors={billingFieldErrors}
					sectionError={errors.billing}
					onChange={handleBillingDataChange}
					onSameAsShippingChange={setSameAsBilling}
					initialSameAsShipping={sameAsBilling}
					disabled={isPaymentBusy}
				/>
			) : null}

			<PaymentError message={errors.payment || returnError || undefined} />

			{shouldShowPaymentMethodArea(checkout) ? (
				<PaymentMethodArea
					provider={provider}
					checkout={checkout}
					billing={{
						billingData,
						sameAsBilling,
						hasShippingAddress,
						shippingAddress,
						userAddresses: user?.addresses,
						authenticated,
					}}
					onPaymentError={handlePaymentError}
					onBillingErrors={setBillingErrors}
					onPriceChangeNotice={setPriceChangeNotice}
					onPaymentActivityChange={handlePaymentActivityChange}
				/>
			) : null}

			{!usesClientSubmit ? (
				<BillingAddressSection
					billingAddress={checkout.billingAddress}
					shippingAddress={shippingAddress}
					userAddresses={authenticated ? (user?.addresses as AddressFragment[]) : undefined}
					defaultBillingAddressId={user?.defaultBillingAddress?.id}
					isShippingRequired={isShippingRequired}
					errors={billingFieldErrors}
					sectionError={errors.billing}
					onChange={handleBillingDataChange}
					onSameAsShippingChange={setSameAsBilling}
					initialSameAsShipping={sameAsBilling}
				/>
			) : null}

			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={onBack}
					disabled={isPaymentBusy}
					className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
				>
					<ChevronLeft className="h-4 w-4" />
					{isShippingRequired ? tActions("returnToShipping") : tActions("returnToInformation")}
				</button>
				{!usesClientSubmit ? (
					<div className="hidden flex-col items-end gap-3 md:flex">
						<PaymentTrustSignals />
						<Button type="submit" disabled={isDisabled} className="h-12 min-w-[200px] px-8">
							{isLoading ? (
								<span className="flex items-center gap-2">
									<LoadingSpinner />
									{buttonText}
								</span>
							) : (
								buttonText
							)}
						</Button>
					</div>
				) : null}
			</div>

			{!usesClientSubmit ? (
				<MobileStickyAction
					step={paymentStep}
					isShippingRequired={isShippingRequired}
					type="submit"
					onAction={submit}
					isLoading={isLoading}
					disabled={isDisabled}
					total={totalStr}
					loadingText={isCompletingOrder ? tActions("creatingOrder") : tActions("processingPayment")}
					showPaymentTrust
				/>
			) : null}
		</>
	);

	return (
		<>
			{usesClientSubmit ? (
				<div className="space-y-8">{paymentContent}</div>
			) : (
				<form className="space-y-8" onSubmit={submit}>
					{paymentContent}
				</form>
			)}
		</>
	);
};
