import { useCallback } from "react";
import { useIntl, MessageDescriptor } from "react-intl";

export const useFormattedMessages = () => {
  const Intl = useIntl();

  return useCallback(
    (message: MessageDescriptor, values?: Record<string, number | string>) =>
      Intl.formatMessage(message, values),
    [Intl]
  );
};
