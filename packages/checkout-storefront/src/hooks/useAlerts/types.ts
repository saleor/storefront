import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";

export type AlertType = "error";

export interface AlertErrorData {
  scope: CheckoutScope;
  code: ErrorCode;
  field: string;
}

export type CustomError =
  | { message: string }
  | (Partial<AlertErrorData> & Pick<AlertErrorData, "code">);

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
  | "checkoutEmailUpdate"
  | "resetPassword"
  | "login";
