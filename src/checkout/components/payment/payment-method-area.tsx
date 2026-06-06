"use client";

import { useState, type FC } from "react";
import { type ResolvedPaymentProvider } from "@/checkout/lib/payment";
import { DummyPaymentPlaceholder } from "./dummy-payment-placeholder";
import { PaymentMethodSelector, type PaymentMethodType, type CardData } from "./payment-method-selector";

type PaymentMethodAreaProps = {
	provider: ResolvedPaymentProvider;
};

const emptyCardData = (): CardData => ({
	cardNumber: "",
	expiry: "",
	cvc: "",
	nameOnCard: "",
});

/**
 * Renders the payment UI for the resolved provider.
 * Dummy → test placeholder; everything else → demo selector (until Stripe/etc. is wired).
 */
export const PaymentMethodArea: FC<PaymentMethodAreaProps> = ({ provider }) => {
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");
	const [cardData, setCardData] = useState<CardData>(emptyCardData);

	if (provider.type === "dummy") {
		return <DummyPaymentPlaceholder gatewayName={provider.gateway.name} />;
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
