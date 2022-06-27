import { PaymentMethodID } from "@/checkout-app/types";
import { getPaymentMethods } from "@/checkout/fetch";
import { useFetch } from "@/checkout/hooks/useFetch";
import { reduce } from "lodash-es";
import { useEffect, useState } from "react";

type AvailablePaymentMethods = PaymentMethodID[];

export interface UsePaymentMethods {
  selectedPaymentMethod: PaymentMethodID | undefined;
  setSelectedPaymentMethod: (value: PaymentMethodID) => void;
  availablePaymentMethods: AvailablePaymentMethods;
}

export const usePaymentMethods = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodID>();

  const [{ data: allPaymentMethods, loading }] = useFetch(getPaymentMethods);

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

  const selectedPaymentProvider =
    allPaymentMethods?.[selectedPaymentMethod as PaymentMethodID];

  return {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    availablePaymentMethods,
    selectedPaymentProvider,
  };
};
