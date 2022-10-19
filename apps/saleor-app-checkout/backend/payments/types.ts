import { OrderCreateFromCheckoutErrorCode, OrderFragment } from "@/saleor-app-checkout/graphql";
import { OrderPaymentMetafield } from "@/saleor-app-checkout/types";
import { PayRequestResponse } from "@/saleor-app-checkout/types/api/pay";
import { PaymentMethodID, PaymentProviderID } from "checkout-common";

type InternalErrorCodes =
  | "COULD_NOT_CREATE_ORDER_FROM_CHECKOUT"
  | "TOTAL_AMOUNT_MISMATCH"
  | "UNKNOWN_PROVIDER"
  | "UNKNOWN_METHOD"
  | "MISSING_CHECKOUT_OR_ORDER_ID"
  | "ORDER_DOES_NOT_EXIST"
  | "ALREADY_PAID"
  | "EXPIRED";

export type ErrorCode = InternalErrorCodes | OrderCreateFromCheckoutErrorCode;

export type Errors = ErrorCode[];

export interface CreatePaymentData {
  saleorApiUrl: string;
  order: OrderFragment;
  redirectUrl: string;
  appUrl: string;
  method: PaymentMethodID;
}

export interface CreatePaymentResult {
  // The URL where the user should be redirected to to complete the payment
  url?: string | undefined | null;
  // Vendor-specific ID of the payment session
  id: string;
}

export interface ReuseExistingSessionParams {
  orderId: string;
  provider: PaymentProviderID;
  method: PaymentMethodID;
  privateMetafield: string;
}
interface ReuseExistingVendorSessionParams extends ReuseExistingSessionParams {
  payment: OrderPaymentMetafield;
}
export type ReuseExistingSessionResult = Promise<PayRequestResponse | undefined> | undefined;

export type ReuseExistingVendorSessionFn = (
  saleorApiUrl: string,
  params: ReuseExistingVendorSessionParams
) => ReuseExistingSessionResult;
