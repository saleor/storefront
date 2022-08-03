import { Errors } from "@/saleor-app-checkout/backend/payments/types";

import { PaymentProviderID } from "checkout-common";

type MollieResponse = {
  provider: "mollie";
  data: {
    paymentUrl: string;
  };
};

type AdyenResponse = {
  provider: "adyen";
  data: {
    paymentUrl: string;
  };
};

type StripeResponse = {
  provider: "stripe";
  data: {
    paymentUrl: string;
  };
};

export type PayRequestSuccessResponse = {
  provider: PaymentProviderID;
  ok: true;
  orderId: string;
} & (MollieResponse | AdyenResponse | StripeResponse);

export type PayRequestErrorResponse = {
  ok: false;
  orderId?: string;
  errors: Errors;
  provider?: PaymentProviderID;
};

export type PayRequestResponse = PayRequestSuccessResponse | PayRequestErrorResponse;
