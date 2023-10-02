import { useCallback, useMemo } from "react";
import { type MessageDescriptor } from "react-intl";
import { useFormattedMessages } from "../useFormattedMessages";
import { warnAboutMissingTranslation } from "../useFormattedMessages/utils";
import { fieldErrorMessages as errorMessages } from "./messages";
import { type ErrorCode } from "@/checkout/lib/globalTypes";

export type ErrorMessages = Record<ErrorCode, string>;

export const useErrorMessages = <TKey extends string = ErrorCode>(
	customMessages?: Record<TKey, MessageDescriptor>,
) => {
	const formatMessage = useFormattedMessages();

	const messagesToUse = customMessages || errorMessages;

	const getMessageByErrorCode = useCallback(
		(errorCode: string) => {
			try {
				const formattedMessage = formatMessage(
					messagesToUse[errorCode as keyof typeof messagesToUse] as MessageDescriptor,
				);
				return formattedMessage;
			} catch (e) {
				warnAboutMissingTranslation(errorCode);
				return "";
			}
		},
		[formatMessage, messagesToUse],
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
