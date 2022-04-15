import { useMessageFormatter } from "@react-aria/i18n";
import english from "@/lib/translations/en-US.json";

export type MessageKey = keyof typeof english;

export const useFormattedMessages = () => {
  const formatMessage = useMessageFormatter({ "en-US": english });

  return (messageKey: MessageKey, values?: Record<string, string | number>) =>
    formatMessage(messageKey, values);
};
