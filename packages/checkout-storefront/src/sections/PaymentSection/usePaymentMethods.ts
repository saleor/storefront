import { ChannelActivePaymentProvidersByChannel, PaymentMethodID } from "checkout-common";
import { getPaymentMethods } from "@/checkout-storefront/fetch";
import { useFetch } from "@/checkout-storefront/hooks/useFetch";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import { useEffect, useState } from "react";

type AvailablePaymentMethods = PaymentMethodID[];

export interface UsePaymentMethods {
  selectedPaymentMethod: PaymentMethodID | undefined;
  setSelectedPaymentMethod: (value: PaymentMethodID) => void;
  availablePaymentMethods: AvailablePaymentMethods;
}

const entries = <T extends object>(obj: T) => Object.entries(obj) as [keyof T, T[keyof T]][];

const getAllPaymentMethods = (
  allPaymentMethods: ChannelActivePaymentProvidersByChannel | null | undefined
) => {
  if (!allPaymentMethods) {
    return [];
  }
  return entries(allPaymentMethods).reduce<AvailablePaymentMethods>(
    (availablePaymentMethods, [paymentMethodId, paymentProviderId]) => {
      return paymentProviderId
        ? [...availablePaymentMethods, paymentMethodId]
        : availablePaymentMethods;
    },
    []
  );
};

export const usePaymentMethods = (channelId: string) => {
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodID>();

  const [{ data: allPaymentMethods, loading }] = useFetch(getPaymentMethods, {
    args: { channelId, checkoutApiUrl },
    skip: !channelId,
  });

  const availablePaymentMethods = getAllPaymentMethods(allPaymentMethods);

  useEffect(() => {
    if (!loading && allPaymentMethods && !availablePaymentMethods.length) {
      throw new Error("No available payment providers");
    }
  }, [loading]);

  const selectedPaymentProvider =
    selectedPaymentMethod && allPaymentMethods?.[selectedPaymentMethod];

  return {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    availablePaymentMethods,
    selectedPaymentProvider,
  };
};
