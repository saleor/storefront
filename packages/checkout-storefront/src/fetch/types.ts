import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";

export type PayResult = PaySuccessResult | PayErrorResult | null;

export interface PayErrorResult {
  ok: false;
  errors: ErrorCode[];
  orderId?: string;
}

export interface PaySuccessResult {
  ok?: undefined;
  orderId: string;
  data: {
    paymentUrl: string;
  };
}
