import { IntlShape, MessageDescriptor } from "react-intl";

export const withLabels = <
  K extends string | number | symbol,
  T extends Record<string, any> & { id: K }
>(
  intl: IntlShape,
  messages: Record<K, MessageDescriptor>,
  items: T[]
): (T & { id: K; label: string })[] => {
  return items.map((item) => ({
    ...item,
    label: intl.formatMessage(messages[item.id]),
  }));
};

export const withNames = <
  K extends string | number | symbol,
  T extends Record<string, any> & { id: K }
>(
  intl: IntlShape,
  messages: Record<K, MessageDescriptor>,
  items: T[]
): (T & { id: K; name: string })[] => {
  return items.map((item) => ({
    ...item,
    name: intl.formatMessage(messages[item.id]),
  }));
};
