import { useMessageFormatter } from "@react-aria/i18n";
import english from "@lib/translations/en-US.json";

export const useFormattedMessages = () => {
  const formatMessage = useMessageFormatter({ "en-US": english });

  return (
    messageKey: keyof typeof english,
    values?: Record<string, string | number>
  ) => formatMessage(messageKey, values);
};
