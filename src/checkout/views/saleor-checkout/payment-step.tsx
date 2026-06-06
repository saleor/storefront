"use client";

import { useState, useCallback, useMemo, type FC } from "react";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { CheckoutSummaryContext, buildPaymentSummaryRows } from "./checkout-summary-context";
import { type CheckoutFragment, type CountryCode, type AddressFragment } from "@/checkout/graphql";
import { useUser } from "@/checkout/hooks/use-user";
import { useCheckoutPayment } from "@/checkout/hooks/use-checkout-payment";
import { MobileStickyAction } from "./mobile-sticky-action";
import { getStepNumber } from "./flow";
import {
	PaymentGatewayAlerts,
	PaymentMethodArea,
	PaymentError,
	BillingAddressSection,
	type BillingAddressData,
} from "@/checkout/components/payment";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { getFormattedMoney, formatMoneyWithFallback } from "@/checkout/lib/utils/money";

interface PaymentStepProps {
	checkout: CheckoutFragment;
	onBack: () => void;
	onGoToInformation?: () => void;
}

export const PaymentStep: FC<PaymentStepProps> = ({ checkout, onBack, onGoToInformation }) => {
	const { user, authenticated } = useUser();

	const isShippingRequired = checkout.isShippingRequired;
	const hasShippingAddress = !!checkout.shippingAddress;
	const shippingAddress = checkout.shippingAddress;

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

	const { submit, errors, priceChangeNotice, provider, canSubmit, isLoading, isCompletingOrder } =
		useCheckoutPayment({
			checkout,
			billingData,
			sameAsBilling,
			hasShippingAddress,
			shippingAddress,
			userAddresses: user?.addresses,
			authenticated,
		});

	const handleBillingDataChange = useCallback((data: BillingAddressData) => {
		setBillingData(data);
	}, []);

	const summaryRows = buildPaymentSummaryRows(checkout);

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
			? "Creating order..."
			: "Processing payment..."
		: `Pay ${totalStr}`;

	const hasInvalidDelivery = checkout.problems?.some(
		(p) => p.__typename === "CheckoutProblemDeliveryMethodInvalid",
	);

	const billingFieldErrors = useMemo(() => {
		const { payment, billing, ...fieldErrors } = errors;
		return fieldErrors;
	}, [errors]);

	const isDisabled = isLoading || hasInvalidDelivery || !canSubmit;

	return (
		<form className="space-y-8" onSubmit={submit}>
			{priceChangeNotice ? (
				<div
					className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4"
					role="status"
				>
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
					<div>
						<p className="font-medium text-amber-800">Your order total was updated</p>
						<p className="mt-1 text-sm text-amber-700">
							The total changed from{" "}
							<span className="font-medium">
								{getFormattedMoney({
									amount: priceChangeNotice.previousAmount,
									currency: priceChangeNotice.currency,
								})}
							</span>{" "}
							to{" "}
							<span className="font-medium">
								{getFormattedMoney({
									amount: priceChangeNotice.newAmount,
									currency: priceChangeNotice.currency,
								})}
							</span>
							. Review the updated order summary before completing your payment.
						</p>
					</div>
				</div>
			) : null}

			<CheckoutSummaryContext checkout={checkout} rows={summaryRows} onGoToStep={handleGoToStep} />

			{hasInvalidDelivery && (
				<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
					<div>
						<p className="font-medium text-amber-800">Shipping method no longer available</p>
						<p className="mt-1 text-sm text-amber-700">
							Please go back to the shipping step and select a valid shipping method before completing your
							order.
						</p>
					</div>
				</div>
			)}

			<PaymentGatewayAlerts gateways={checkout.availablePaymentGateways} />

			<PaymentMethodArea provider={provider} />

			<PaymentError message={errors.payment} />

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

			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ChevronLeft className="h-4 w-4" />
					{isShippingRequired ? "Return to shipping" : "Return to information"}
				</button>
				<Button type="submit" disabled={isDisabled} className="hidden h-12 min-w-[200px] px-8 md:flex">
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

			<MobileStickyAction
				step={getStepNumber("PAYMENT", isShippingRequired)}
				isShippingRequired={isShippingRequired}
				type="submit"
				onAction={submit}
				isLoading={isLoading}
				disabled={isDisabled}
				total={totalStr}
				loadingText={isCompletingOrder ? "Creating order..." : "Processing payment..."}
			/>
		</form>
	);
};
