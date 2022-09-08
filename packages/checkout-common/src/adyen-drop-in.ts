import type { CreateCheckoutSessionResponse } from "@adyen/api-library/lib/src/typings/checkout/createCheckoutSessionResponse";

export type AdyenDropInCreateSessionResponse = {
  session: CreateCheckoutSessionResponse;
  clientKey: string;
};
