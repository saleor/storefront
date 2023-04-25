import { CardElementData } from "@adyen/adyen-web/dist/types/components/Card/types";
import DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";
import { PaymentMethodsResponseObject } from "@adyen/adyen-web/dist/types/core/ProcessResponse/PaymentMethodsResponse/types";
import { PaymentResponse } from "@adyen/adyen-web/dist/types/components/types";

export const adyenGatewayId = "app.saleor.adyen";
export type AdyenGatewayId = typeof adyenGatewayId;

// because it's defined to these in the docs but it's a string in the response type
type AdyenResultCode =
  | "Authorised"
  | "Error"
  | "Pending"
  | "PresentToShopper"
  | "Refused"
  | "Received";

export interface AdyenGatewayInitializePayload {
  paymentMethodsResponse: PaymentMethodsResponseObject;
  clientKey: string;
  environment: string;
}

export interface AdyenPaymentResponse extends Omit<PaymentResponse, "resultCode"> {
  resultCode: AdyenResultCode;
  refusalReason?: string;
}

export interface AdyenTransactionInitializeResponse {
  paymentResponse: AdyenPaymentResponse;
}

export interface AdyenTransactionProcessResponse {
  paymentDetailsResponse: AdyenPaymentResponse;
}

// -------

export type ApplePayCallback = <T>(value: T) => void;

export type AdyenCheckoutInstanceState = {
  isValid?: boolean;
  data: CardElementData & Record<string, any>;
};

export type AdyenCheckoutInstanceOnSubmit = (
  state: AdyenCheckoutInstanceState,
  component: DropinElement
) => Promise<void> | void;

export type AdyenCheckoutInstanceOnAdditionalDetails = (
  state: AdyenCheckoutInstanceState,
  component: DropinElement
) => Promise<void> | void;
