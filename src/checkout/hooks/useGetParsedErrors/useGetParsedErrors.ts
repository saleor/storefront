import { camelCase } from "lodash-es";
import { useCallback } from "react";
import { useErrorMessages } from "../useErrorMessages";
import {
	type ApiError,
	type ApiErrors,
	type FormErrors,
	type ParsedApiError,
	type ParsedApiErrors,
} from "./types";
import { type ErrorCode, type GenericErrorCode } from "@/checkout/lib/globalTypes";
import { type FormDataBase } from "@/checkout/hooks/useForm";

export const useGetParsedErrors = <TFormData extends FormDataBase, TErrorCodes extends string = string>() => {
	const { getMessageByErrorCode } = useErrorMessages();

	const getParsedApiError = useCallback(
		({ code, field }: ApiError<TFormData, TErrorCodes>): ParsedApiError<TFormData> => {
			const errorCode = camelCase(code) as ErrorCode;

			return {
				field,
				code: errorCode,
				message: getMessageByErrorCode(errorCode as GenericErrorCode),
			};
		},
		[getMessageByErrorCode],
	);

	const getParsedApiErrors = useCallback(
		(apiErrors: ApiErrors<TFormData, TErrorCodes>) =>
			apiErrors.map(getParsedApiError) as ParsedApiErrors<TFormData>,
		[getParsedApiError],
	);

	const getFormErrorsFromApiErrors = useCallback(
		(apiErrors: ApiErrors<TFormData, TErrorCodes>) =>
			getParsedApiErrors(apiErrors).reduce(
				(result, { field, message }) => ({ ...result, [field]: message }),
				{},
			) as FormErrors<TFormData>,
		[getParsedApiErrors],
	);

	return { getParsedApiError, getParsedApiErrors, getFormErrorsFromApiErrors };
};
