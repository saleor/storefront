import { OrderCreateFromCheckoutErrorCode } from "@/checkout-app/graphql";

type InternalErrorCodes =
  | "COULD_NOT_CREATE_ORDER_FROM_CHECKOUT"
  | "TOTAL_AMOUNT_MISMATCH"
  | "UNKNOWN_PROVIDER"
  | "MISSING_CHECKOUT_OR_ORDER_ID"
  | "ORDER_DOES_NOT_EXIST"
  | "ALREADY_PAID";

export type ErrorCode = InternalErrorCodes | OrderCreateFromCheckoutErrorCode;

export type Errors = ErrorCode[];
