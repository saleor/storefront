import { ErrorCode, FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { FormikErrors } from "formik";

export interface ApiError<TFormData> {
  field: keyof TFormData;
  code: string;
  message: string;
}
export type ApiErrors<TFormData> = ApiError<TFormData>[];

export type Errors<TFormData extends FormDataBase> = FormikErrors<TFormData>;

export interface Error<TFormData> {
  field: keyof TFormData;
  code: ErrorCode;
  message: string;
}
