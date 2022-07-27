import { PaymentMethodID } from "checkout-common";
import { getPaymentMethods } from "@/checkout-storefront/fetch";
import { useFetch } from "@/checkout-storefront/hooks/useFetch";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import { reduce } from "lodash-es";
import { useEffect, useState } from "react";

type AvailablePaymentMethods = PaymentMethodID[];

export interface UsePaymentMethods {
  selectedPaymentMethod: PaymentMethodID | undefined;
  setSelectedPaymentMethod: (value: PaymentMethodID) => void;
  availablePaymentMethods: AvailablePaymentMethods;
}

export const usePaymentMethods = (channelId: string) => {
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodID>();

  const [{ data: allPaymentMethods, loading }] = useFetch(getPaymentMethods, {
    args: { channelId, checkoutApiUrl },
    skip: !channelId,
  });

  const availablePaymentMethods = reduce(
    allPaymentMethods,
    (result, paymentProviderId, paymentMethodId) =>
      (!!paymentProviderId.length
        ? [...result, paymentMethodId]
        : result) as AvailablePaymentMethods,
    [] as AvailablePaymentMethods
  );

  useEffect(() => {
    if (!loading && allPaymentMethods && !availablePaymentMethods.length) {
      throw new Error("No available payment providers");
    }
  }, [loading]);

  const selectedPaymentProvider = allPaymentMethods?.[selectedPaymentMethod as PaymentMethodID];

  return {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    availablePaymentMethods,
    selectedPaymentProvider,
  };
};
