"use client";

import { useState, type FC } from "react";
import { type AddressFragment, type CheckoutFragment } from "@/checkout/graphql";
import { type ResolvedPaymentProvider } from "@/checkout/lib/payment";
import { type CheckoutPriceChangeNotice } from "@/checkout/lib/payment/checkout-pay-amount";
import { DummyPaymentPlaceholder } from "./dummy-payment-placeholder";
import { PaymentMethodSelector, type PaymentMethodType, type CardData } from "./payment-method-selector";
import { StripePayment, type StripeBillingContext } from "./stripe/stripe-payment";
import { type BillingAddressData } from "./billing-address-section";

type PaymentMethodAreaProps = {
	provider: ResolvedPaymentProvider;
	checkout?: CheckoutFragment;
	billing?: Omit<StripeBillingContext, "billingData"> & { billingData: BillingAddressData };
	onPaymentError?: (message: string) => void;
	onBillingErrors?: (errors: Record<string, string>, focusField?: string) => void;
	onPriceChangeNotice?: (notice: CheckoutPriceChangeNotice) => void;
};

const emptyCardData = (): CardData => ({
	cardNumber: "",
	expiry: "",
	cvc: "",
	nameOnCard: "",
});

/**
 * Renders the payment UI for the resolved provider.
 */
export const PaymentMethodArea: FC<PaymentMethodAreaProps> = ({
	provider,
	checkout,
	billing,
	onPaymentError,
	onBillingErrors,
	onPriceChangeNotice,
}) => {
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");
	const [cardData, setCardData] = useState<CardData>(emptyCardData);

	if (provider.type === "dummy") {
		return <DummyPaymentPlaceholder gatewayName={provider.gateway.name} />;
	}

	if (
		provider.type === "stripe" &&
		checkout &&
		billing &&
		onPaymentError &&
		onBillingErrors &&
		onPriceChangeNotice
	) {
		return (
			<StripePayment
				checkout={checkout}
				gatewayName={provider.gateway.name}
				billing={billing}
				onPaymentError={onPaymentError}
				onBillingErrors={onBillingErrors}
				onPriceChangeNotice={onPriceChangeNotice}
			/>
		);
	}

	return (
		<PaymentMethodSelector
			value={paymentMethod}
			onChange={setPaymentMethod}
			cardData={cardData}
			onCardDataChange={setCardData}
		/>
	);
};
