import { useIntl, MessageDescriptor } from "react-intl";

export const useFormattedMessages = () => {
  const { formatMessage } = useIntl();

  return (message: MessageDescriptor) => formatMessage(message);
};
