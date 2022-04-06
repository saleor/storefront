import { PaymentProvider, PaymentProviderID } from "types/common";

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
