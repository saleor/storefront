import { PaymentProviderID } from "@/checkout-app/types";

export interface FormData {
  email: string;
  password: string;
  createAccount: boolean;
  paymentProviderId: PaymentProviderID;
}
