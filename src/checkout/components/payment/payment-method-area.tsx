"use client";

import { type FC } from "react";
import { type AddressFragment, type CheckoutFragment } from "@/checkout/graphql";
import { type ResolvedPaymentProvider } from "@/checkout/lib/payment";
import { type CheckoutPriceChangeNotice } from "@/checkout/lib/payment/checkout-pay-amount";
import { IntegratedPaymentUi } from "./integrated-payment-ui";
import { type BillingAddressData } from "./billing-address-section";

type PaymentMethodAreaProps = {
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

/** Renders the payment UI for the resolved provider. */
export const PaymentMethodArea: FC<PaymentMethodAreaProps> = (props) => {
	return <IntegratedPaymentUi {...props} />;
};
