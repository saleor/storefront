import AdyenCheckout from "@adyen/adyen-web";
import { CardElementData } from "@adyen/adyen-web/dist/types/components/Card/types";
import DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";
import {
  AdyenDropInCreateSessionResponse,
  PostAdyenDropInPaymentsDetailsResponse,
  PostAdyenDropInPaymentsResponse,
} from "checkout-common";
import { PaymentResponse as AdyenApiPaymentResponse } from "@adyen/api-library/lib/src/typings/checkout/paymentResponse";

export type AdyenCheckoutInstanceOnSubmit = (
  state: {
    isValid?: boolean;
    data: CardElementData & Record<string, any>;
  },
  component: DropinElement
) => Promise<void> | void;

export type AdyenCheckoutInstanceOnAdditionalDetails = (
  state: { isValid?: boolean; data: CardElementData & Record<string, any> },
  component: DropinElement
) => Promise<void> | void;

export function createAdyenCheckoutInstance(
  adyenSessionResponse: AdyenDropInCreateSessionResponse,
  {
    onSubmit,
    onAdditionalDetails,
  }: {
    onSubmit: AdyenCheckoutInstanceOnSubmit;
    onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails;
  }
) {
  return AdyenCheckout({
    environment: "test",
    clientKey: adyenSessionResponse.clientKey,
    session: {
      id: adyenSessionResponse.session.id,
      sessionData: adyenSessionResponse.session.sessionData,
    },
    onPaymentCompleted: (result: any, component: any) => {
      console.info(result, component);
    },
    onError: (error: any, component: any) => {
      console.error(error.name, error.message, error.stack, component);
    },
    onSubmit,
    onAdditionalDetails,
    // Any payment method specific configuration. Find the configuration specific to each payment method: https://docs.adyen.com/payment-methods
    // For example, this is 3D Secure configuration for cards:
    paymentMethodsConfiguration: {
      card: {
        hasHolderName: true,
        holderNameRequired: true,
        billingAddressRequired: false,
      },
    },
    analytics: {
      enabled: false,
    },
  });
}

export function handlePaymentResult(
  result: PostAdyenDropInPaymentsResponse | PostAdyenDropInPaymentsDetailsResponse,
  component: DropinElement
) {
  switch (result.payment.resultCode) {
    // @todo https://docs.adyen.com/online-payments/payment-result-codes
    case AdyenApiPaymentResponse.ResultCodeEnum.AuthenticationFinished:
    case AdyenApiPaymentResponse.ResultCodeEnum.Cancelled:
    case AdyenApiPaymentResponse.ResultCodeEnum.ChallengeShopper:
    case AdyenApiPaymentResponse.ResultCodeEnum.Error:
    case AdyenApiPaymentResponse.ResultCodeEnum.IdentifyShopper:
    case AdyenApiPaymentResponse.ResultCodeEnum.Pending:
    case AdyenApiPaymentResponse.ResultCodeEnum.PresentToShopper:
    case AdyenApiPaymentResponse.ResultCodeEnum.Received:
    case AdyenApiPaymentResponse.ResultCodeEnum.RedirectShopper:
    case AdyenApiPaymentResponse.ResultCodeEnum.Refused: {
      console.error(result);
      component.setStatus("error", {
        message: `${result.payment.resultCode}: ${result.payment.refusalReason}`,
      });
      return;
    }

    case AdyenApiPaymentResponse.ResultCodeEnum.Authorised:
    case AdyenApiPaymentResponse.ResultCodeEnum.Success: {
      const newUrl = `?order=${result.orderId}`;
      window.location.href = newUrl;
      return;
    }
  }
}
