import { ValidationErrorCode } from "@/checkout/lib/globalTypes";
import { useFormattedMessages, MessageKey } from "./useFormattedMessages";

export const useErrorMessages = () => {
  const formatMessage = useFormattedMessages();

  const errorMessages = {
    invalidValue: formatMessage("invalid"),
    requiredValue: formatMessage("required"),
  };

  const getMessageByErrorCode = (errorCode: ValidationErrorCode) => {
    switch (errorCode) {
      case "required":
        return errorMessages.requiredValue;

      case "invalid":
        return errorMessages.invalidValue;

      default:
        return formatMessage(errorCode as MessageKey);
    }
  };

  return {
    errorMessages,
    getMessageByErrorCode,
  };
};
