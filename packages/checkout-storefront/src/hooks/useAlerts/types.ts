import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";

export type AlertType = "error" | "success";

export interface AlertErrorData {
  scope: CheckoutScope;
  code: ErrorCode;
  field: string;
}

export type CustomError =
  | Pick<AlertErrorData, "code">
  | Pick<AlertErrorData, "code" | "field">
  | { message: string };

export interface Alert {
  message: string;
  id: string;
  type: AlertType;
}

export type CheckoutScope =
  | "checkoutFinalize"
  | "checkoutShippingUpdate"
  | "checkoutCustomerAttach"
  | "checkoutBillingUpdate"
  | "checkoutAddPromoCode"
  | "checkoutDeliveryMethodUpdate"
  | "userAddressCreate"
  | "userAddressUpdate"
  | "userAddressDelete"
  | "checkoutPay"
  | "userRegister"
  | "requestPasswordReset"
  | "checkoutLinesUpdate"
  | "checkoutLinesDelete"
  | "checkoutEmailUpdate"
  | "resetPassword"
  | "signIn";
