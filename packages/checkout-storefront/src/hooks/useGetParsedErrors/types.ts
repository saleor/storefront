import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";

export interface ApiError<TFormData extends FormDataBase> {
  field: keyof TFormData;
  code: string;
  message: string;
}
export type ApiErrors<TFormData extends FormDataBase> = ApiError<TFormData>[];

export type ParsedApiErrors<TFormData extends FormDataBase> = Array<{
  field: keyof TFormData;
  code: ErrorCode;
  message: string;
}>;

export type FormErrors<TFormData extends FormDataBase> = Record<keyof TFormData, string>;
