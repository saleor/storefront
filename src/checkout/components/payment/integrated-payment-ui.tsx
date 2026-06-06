"use client";

import { type FC } from "react";
import { type AddressFragment, type CheckoutFragment } from "@/checkout/graphql";
import { isIntegratedPaymentProvider, type ResolvedPaymentProvider } from "@/checkout/lib/payment";
import { type CheckoutPriceChangeNotice } from "@/checkout/lib/payment/checkout-pay-amount";
import { DummyPaymentPlaceholder } from "./dummy-payment-placeholder";
import { StripePayment } from "./stripe/stripe-payment";
import { type BillingAddressData } from "./billing-address-section";

export type IntegratedPaymentUiProps = {
	provider: ResolvedPaymentProvider;
	checkout?: CheckoutFragment;
	billing?: {
		billingData: BillingAddressData;
		sameAsBilling: boolean;
		hasShippingAddress: boolean;
		shippingAddress: AddressFragment | null | undefined;
		userAddresses: ReadonlyArray<AddressFragment> | undefined;
		authenticated: boolean;
	};
	onPaymentError?: (message: string) => void;
	onBillingErrors?: (errors: Record<string, string>, focusField?: string) => void;
	onPriceChangeNotice?: (notice: CheckoutPriceChangeNotice) => void;
};

/**
 * Renders UI for integrated payment providers.
 * Add new provider components here when wiring a Saleor payment app.
 */
export const IntegratedPaymentUi: FC<IntegratedPaymentUiProps> = ({
	provider,
	checkout,
	billing,
	onPaymentError,
	onBillingErrors,
	onPriceChangeNotice,
}) => {
	if (!isIntegratedPaymentProvider(provider)) {
		return null;
	}

	switch (provider.type) {
		case "dummy":
			return <DummyPaymentPlaceholder gatewayName={provider.gateway.name} />;
		case "stripe":
			if (!checkout || !billing || !onPaymentError || !onBillingErrors || !onPriceChangeNotice) {
				return null;
			}

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
};
