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

export type PayRequestSuccessResponse = {
  provider: PaymentProviderID;
  ok: true;
  orderId: string;
} & (MollieResponse | AdyenResponse);

export type PayRequestErrorResponse = {
  ok: false;
  orderId?: string;
  errors: Errors;
};

export type PayRequestResponse =
  | PayRequestSuccessResponse
  | PayRequestErrorResponse;
