import { PaymentMethodID, PaymentProviderID } from "checkout-common";

export interface CheckoutFormData {
  email: string;
  password: string;
  createAccount: boolean;
  paymentProviderId: PaymentProviderID;
  paymentMethodId: PaymentMethodID;
  validating: boolean;
}
