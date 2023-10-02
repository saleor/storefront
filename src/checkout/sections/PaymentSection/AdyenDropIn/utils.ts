import { type CoreOptions } from "@adyen/adyen-web/dist/types/core/types";
import { type Locale } from "@/checkout/lib/regions";
import {
	type AdyenCheckoutInstanceOnAdditionalDetails,
	type AdyenCheckoutInstanceOnSubmit,
	type AdyenGatewayInitializePayload,
	type ApplePayCallback,
} from "@/checkout/sections/PaymentSection/AdyenDropIn/types";

interface CreateAdyenCheckoutConfigProps extends AdyenGatewayInitializePayload {
	locale: Locale;
	onSubmit: AdyenCheckoutInstanceOnSubmit;
	onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails;
}

export const createAdyenCheckoutConfig = ({
	paymentMethodsResponse,
	clientKey,
	environment,
	onSubmit,
	onAdditionalDetails,
	locale,
}: CreateAdyenCheckoutConfigProps): CoreOptions => ({
	paymentMethodsResponse,
	environment,
	clientKey,
	onSubmit,
	onAdditionalDetails,
	locale,
	analytics: {
		enabled: false,
	},
	// Any payment method specific configuration. Find the configuration specific to each payment method: https://docs.adyen.com/payment-methods
	// For example, this is 3D Secure configuration for cards:
	paymentMethodsConfiguration: {
		card: {
			hasHolderName: true,
			holderNameRequired: true,
			billingAddressRequired: false,
		},
		applepay: {
			buttonType: "plain",
			buttonColor: "black",
			onPaymentMethodSelected: (
				resolve: ApplePayCallback,
				_reject: ApplePayCallback,
				event: ApplePayJS.ApplePayPaymentMethodSelectedEvent,
			) => {
				resolve(event.paymentMethod);
			},
			onShippingContactSelected: (
				resolve: ApplePayCallback,
				_reject: ApplePayCallback,
				event: ApplePayJS.ApplePayShippingContactSelectedEvent,
			) => {
				resolve(event.shippingContact);
			},
			onShippingMethodSelected: (
				resolve: ApplePayCallback,
				_reject: ApplePayCallback,
				event: ApplePayJS.ApplePayShippingMethodSelectedEvent,
			) => {
				resolve(event.shippingMethod);
			},
		},
	},
});
