import { FieldErrors } from "react-hook-form";

export type ErrorScope =
  | "checkoutShippingUpdate"
  | "checkoutBillingUpdate"
  | "userAddressCreate"
  | "userAddressUpdate"
  | "checkoutPay"
  | "userRegister";

export type ApiErrors<TFormData> = Array<{
  field: keyof TFormData;
  code: "REQUIRED" | "INVALID";
  message: string;
}>;

export type Errors<TFormData> = Partial<FieldErrors<TFormData>>;

export type SetErrors<TFormData> = (errors: Errors<TFormData>) => void;
export type SetApiErrors<TFormData> = (apiErrors: ApiErrors<TFormData>) => void;
