import { ErrorCode } from "@/checkout/lib/globalTypes";

export type AlertType = "success" | "error";

export interface AlertSuccessData {
  scope: CheckoutScope;
}

export interface AlertErrorData {
  scope: CheckoutScope;
  code: ErrorCode;
  field: string;
}

export interface Alert {
  message: string;
  id: string;
  type: AlertType;
}

export type CheckoutScope =
  | "checkoutShippingUpdate"
  | "checkoutBillingUpdate"
  | "checkoutDeliveryMethodUpdate"
  | "userAddressCreate"
  | "userAddressUpdate"
  | "userAddressDelete"
  | "checkoutPay"
  | "userRegister"
  | "requestPasswordReset"
  | "checkoutLinesUpdate"
  | "checkoutEmailUpdate"
  | "resetPassword"
  | "login";
