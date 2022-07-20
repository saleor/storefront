import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";

export type PayResult = PaySuccessResult | PayErrorResult;

export interface PayErrorResult {
  ok?: boolean;
  errors: ErrorCode[];
}

export interface PaySuccessResult {
  orderId: string;
  data: {
    paymentUrl: string;
  };
}
