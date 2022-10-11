import { CheckoutScope } from "@/checkout-storefront/hooks";
import { PaymentMethodID, PaymentProviderID } from "checkout-common";

export interface CheckoutFormData {
  email: string;
  password: string;
  createAccount: boolean;
  paymentProviderId: PaymentProviderID;
  paymentMethodId: PaymentMethodID;
  validating: boolean;
  updateState: Record<CheckoutUpdateStateScope, boolean>;
}

export type CheckoutUpdateStateScope =
  | Extract<
      CheckoutScope,
      | "checkoutShippingUpdate"
      | "checkoutCustomerAttach"
      | "checkoutAddPromoCode"
      | "checkoutDeliveryMethodUpdate"
      | "checkoutEmailUpdate"
      | "checkoutBillingUpdate"
    >
  | "checkoutFetch";
