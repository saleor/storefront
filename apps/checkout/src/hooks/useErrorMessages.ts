import { useFormattedMessages } from "./useFormattedMessages";

export const useErrorMessages = () => {
  const formatMessage = useFormattedMessages();

  return {
    invalidValue: formatMessage("invalid"),
    requiredField: formatMessage("required"),
  };
};
