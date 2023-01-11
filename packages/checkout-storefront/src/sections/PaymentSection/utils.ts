import {
  ChannelActivePaymentProvidersByChannel,
  PaymentMethodID,
  PaymentProviderID,
} from "checkout-common";

export const getParsedPaymentMethods = (
  activePaymentProvidersByChannel: ChannelActivePaymentProvidersByChannel | null | undefined
): PaymentMethodID[] => {
  if (!activePaymentProvidersByChannel) {
    return [];
  }

  return Object.entries(activePaymentProvidersByChannel)
    .filter(([, paymentProviderId]) => !!paymentProviderId)
    .map(([paymentMethodId]) => paymentMethodId) as PaymentMethodID[];
};

export const getParsedPaymentProviders = (
  activePaymentProvidersByChannel: ChannelActivePaymentProvidersByChannel | null | undefined
): readonly PaymentProviderID[] => {
  if (!activePaymentProvidersByChannel) {
    return [];
  }

  return Object.values(activePaymentProvidersByChannel).filter(
    (paymentProviderId): paymentProviderId is Exclude<typeof paymentProviderId, ""> =>
      !!paymentProviderId
  );
};
