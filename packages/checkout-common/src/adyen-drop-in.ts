import type { CreateCheckoutSessionResponse } from "@adyen/api-library/lib/src/typings/checkout/createCheckoutSessionResponse";
import * as yup from "yup";
import { PaymentProviders } from "./payments";

export type AdyenDropInCreateSessionResponse = {
  session: CreateCheckoutSessionResponse;
  clientKey?: string;
};

export const postDropInAdyenSessionsBody = yup
  .object({
    currency: yup.string().required(),
    totalAmount: yup.number().required(),
    checkoutId: yup.string().required(),
    redirectUrl: yup.string().required(),
    provider: yup
      .string()
      .oneOf([...PaymentProviders])
      .required(),
  })
  .required();
export type PostDropInAdyenSessionsBody = yup.InferType<typeof postDropInAdyenSessionsBody>;
