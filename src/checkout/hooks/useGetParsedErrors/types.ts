import { type FormDataBase } from "@/checkout/hooks/useForm";
import { type ErrorCode } from "@/checkout/lib/globalTypes";

export type CustomErrors = any[];

export interface ApiError<TFormData extends FormDataBase, TErrorCodes extends string = string> {
	field: keyof TFormData;
	code: TErrorCodes;
	message: string;
}

export type ApiErrors<TFormData extends FormDataBase, TErrorCodes extends string = string> = ApiError<
	TFormData,
	TErrorCodes
>[];

export interface ParsedApiError<TFormData extends FormDataBase> {
	field: keyof TFormData;
	code: ErrorCode;
	message: string;
}

export type ParsedApiErrors<TFormData extends FormDataBase> = ParsedApiError<TFormData>[];

export type FormErrors<TFormData extends FormDataBase> = Record<keyof TFormData, string>;
