import { useIntl, MessageDescriptor } from "react-intl";

/**
 * @deprecated use `useIntl` instead
 */
export const useFormattedMessages = () => {
  const Intl = useIntl();

  return (message: MessageDescriptor) => Intl.formatMessage(message);
};
