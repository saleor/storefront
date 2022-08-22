import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";

export type AlertType = "error";

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
  | "checkoutEmailUpdate"
  | "resetPassword"
  | "login";
