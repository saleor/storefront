import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { useCallback, useMemo } from "react";
import { MessageKey, useFormattedMessages } from "./useFormattedMessages";
import { warnAboutMissingTranslation } from "./useFormattedMessages/utils";

export type ErrorMessages = Record<ErrorCode, string>;

interface UseErrorMessages {
  errorMessages: ErrorMessages;
  getMessageByErrorCode: (code: ErrorCode) => string;
}

const errorMessageKeys: ErrorCode[] = ["invalid", "required", "unique"];

export const useErrorMessages = (): UseErrorMessages => {
  const formatMessage = useFormattedMessages();

  const getMessageByErrorCode = useCallback(
    (errorCode: ErrorCode) => {
      try {
        const formattedMessage = formatMessage(errorCode as MessageKey);
        return formattedMessage;
      } catch (e) {
        warnAboutMissingTranslation(errorCode);
        return "";
      }
    },
    [formatMessage]
  );

  const errorMessages: ErrorMessages = useMemo(
    () =>
      errorMessageKeys.reduce(
        (result, key) => ({
          ...result,
          [key]: getMessageByErrorCode(key),
        }),
        {} as ErrorMessages
      ),
    [getMessageByErrorCode]
  );

  return {
    errorMessages,
    getMessageByErrorCode,
  };
};
