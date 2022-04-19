import { ChannelPaymentOptions, PaymentOption } from "types/api";

export const getActivePaymentProvider = (paymentOption: PaymentOption) =>
  paymentOption.availableProviders.find(
    (provider) => provider.id === paymentOption.activeProvider?.id
  )?.id || "";

export const getFormDefaultValues = (
  channelPaymentOptions: ChannelPaymentOptions | undefined
) =>
  channelPaymentOptions?.paymentOptions.reduce(
    (values, paymentOption) => ({
      ...values,
      [paymentOption.id]: getActivePaymentProvider(paymentOption),
    }),
    {}
  );
