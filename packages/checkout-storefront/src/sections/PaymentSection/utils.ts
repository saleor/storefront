import { ChannelActivePaymentProvidersByChannel, PaymentMethodID } from "checkout-common";

export const getParsedPaymentMethods = (
  allPaymentMethods: ChannelActivePaymentProvidersByChannel | null | undefined
): PaymentMethodID[] => {
  if (!allPaymentMethods) {
    return [];
  }

  return Object.entries(allPaymentMethods)
    .filter(([, paymentProviderId]) => !!paymentProviderId)
    .map(([paymentMethodId]) => paymentMethodId) as PaymentMethodID[];
};
