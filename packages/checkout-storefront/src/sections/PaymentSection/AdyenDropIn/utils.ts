import { Locale } from "@/checkout-storefront/lib/regions";
import {
  AdyenCheckoutInstanceOnAdditionalDetails,
  AdyenCheckoutInstanceOnSubmit,
  AdyenGatewayInitializePayload,
  ApplePayCallback,
} from "@/checkout-storefront/sections/PaymentSection/AdyenDropIn/types";
import { CoreOptions } from "@adyen/adyen-web/dist/types/core/types";

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
        reject: ApplePayCallback,
        event: ApplePayJS.ApplePayPaymentMethodSelectedEvent
      ) => {
        resolve(event.paymentMethod);
      },
      onShippingContactSelected: (
        resolve: ApplePayCallback,
        reject: ApplePayCallback,
        event: ApplePayJS.ApplePayShippingContactSelectedEvent
      ) => {
        resolve(event.shippingContact);
      },
      onShippingMethodSelected: (
        resolve: ApplePayCallback,
        reject: ApplePayCallback,
        event: ApplePayJS.ApplePayShippingMethodSelectedEvent
      ) => {
        resolve(event.shippingMethod);
      },
    },
  },
});
