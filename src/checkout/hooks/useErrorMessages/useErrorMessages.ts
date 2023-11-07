import { useCallback, useMemo } from "react";
import { type ErrorCode } from "@/checkout/lib/globalTypes";

export const errorMessages = {
	invalid: "Invalid value",
	required: "Required field",
	unique: "Value must be unique",
	emailInvalid: "Email must be a valid email",
	passwordAtLeastCharacters: "Password must be at least 8 characters",
	passwordTooShort: "Provided password is too short. Minimum length is 8 characters.",
	passwordTooSimilar: "Provided password is too similar to your previous password.",
	passwordTooCommon: "Provided password is too common. Use something more fancy.",
	passwordInvalid: "Provided password is invalid.",
	quantityGreaterThanLimit: "Chosen quantity is more than limit allowed.",
	insufficientStock: "Not enough of chosen item in stock.",
	invalidCredentials: "Invalid credentials provided at login.",
	missingFields: "Missing fields in address form: ",
} satisfies Record<ErrorCode, string>;

export type ErrorMessages = Record<ErrorCode, string>;

export const useErrorMessages = <TKey extends string = ErrorCode>(customMessages?: Record<TKey, string>) => {
	const messagesToUse = customMessages || errorMessages;

	const getMessageByErrorCode = useCallback(
		(errorCode: string) => {
			const formattedMessage = messagesToUse[errorCode as keyof typeof messagesToUse];
			if (!formattedMessage) {
				console.warn(`Missing trnalsation: ${errorCode}`);
				return "";
			}
			return formattedMessage;
		},
		[messagesToUse],
	);

	const translatedErrorMessages = useMemo(
		() =>
			Object.keys(messagesToUse).reduce(
				(result, key) => ({
					...result,
					[key]: getMessageByErrorCode(key as TKey),
				}),
				{} as Record<TKey, string>,
			),
		[getMessageByErrorCode, messagesToUse],
	);

	return {
		errorMessages: translatedErrorMessages,
		getMessageByErrorCode,
	};
};
