import { PaymentProvider, PaymentProviderID } from "checkout-common";

export const getFormDefaultValues = (
  selectedPaymentProvider: PaymentProvider<PaymentProviderID> | undefined
) =>
  selectedPaymentProvider?.settings?.reduce(
    (values, setting) => ({
      ...values,
      [setting.id]: setting.value,
    }),
    {}
  );

export const extractSettingsData = (
  selectedPaymentProvider: PaymentProvider<PaymentProviderID>
) => {
  const encryptedSettings = selectedPaymentProvider.settings.filter(({ encrypt }) => encrypt);
  const publicSettings = selectedPaymentProvider.settings.filter(({ encrypt }) => !encrypt);
  const hasEncryptedSettings = encryptedSettings.length > 0;
  const hasPublicSettings = publicSettings.length > 0;

  return {
    encryptedSettings,
    publicSettings,
    hasEncryptedSettings,
    hasPublicSettings,
  };
};
