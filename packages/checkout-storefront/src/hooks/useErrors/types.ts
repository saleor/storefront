import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { FieldErrors } from "react-hook-form";

export interface ApiError<TFormData> {
  field: keyof TFormData;
  code: string;
  message: string;
}
export type ApiErrors<TFormData> = ApiError<TFormData>[];

export type Errors<TFormData> = Partial<FieldErrors<TFormData>>;

export interface Error<TFormData> {
  field: keyof TFormData;
  code: ErrorCode;
  message: string;
}
