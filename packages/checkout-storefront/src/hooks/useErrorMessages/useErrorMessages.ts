import { ErrorCode, GenericErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { useCallback, useMemo } from "react";
import { useFormattedMessages } from "../useFormattedMessages";
import { warnAboutMissingTranslation } from "../useFormattedMessages/utils";
import { fieldErrorMessages as errorMessages } from "./messages";

export type ErrorMessages = Record<ErrorCode, string>;

interface UseErrorMessages {
  errorMessages: ErrorMessages;
  getMessageByErrorCode: (code: GenericErrorCode) => string;
}

export const useErrorMessages = (): UseErrorMessages => {
  const formatMessage = useFormattedMessages();

  const getMessageByErrorCode = useCallback(
    (errorCode: ErrorCode) => {
      try {
        const formattedMessage = formatMessage(errorMessages[errorCode]);
        return formattedMessage;
      } catch (e) {
        warnAboutMissingTranslation(errorCode);
        return "";
      }
    },
    [formatMessage]
  );

  const translatedErrorMessages: ErrorMessages = useMemo(
    () =>
      Object.keys(errorMessages).reduce(
        (result, key) => ({
          ...result,
          [key]: getMessageByErrorCode(key as ErrorCode),
        }),
        {} as ErrorMessages
      ),
    [getMessageByErrorCode]
  );

  return {
    errorMessages: translatedErrorMessages,
    getMessageByErrorCode,
  };
};
