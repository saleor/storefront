import { OrderCreateFromCheckoutErrorCode } from "@/graphql";

type InternalErrorCodes =
  | "COULD_NOT_CREATE_ORDER_FROM_CHECKOUT"
  | "TOTAL_AMOUNT_MISMATCH"
  | "UNKNOWN_PROVIDER";

export type ErrorCode = InternalErrorCodes | OrderCreateFromCheckoutErrorCode;

export type Errors = ErrorCode[];
