import { usePaymentDataActions } from "@/checkout-storefront/state/paymentDataStore";
import {
  ChannelActivePaymentProvidersByChannel,
  PaymentMethodID,
  PaymentProviderID,
} from "checkout-common";
import { useCallback, useEffect, useState } from "react";
import { useFetchPaymentMethods } from "@/checkout-storefront/hooks/useFetchPaymentMethods";

export const usePaymentMethodsForm = () => {
  const { setPaymentData } = usePaymentDataActions();

  // possibly change to form once we switch to formik
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodID | null>(null);

  const {
    availablePaymentMethods,
    availablePaymentProviders,
    activePaymentProvidersByChannel,
    loading,
  } = useFetchPaymentMethods();

  const handleSelect = useCallback(
    (paymentMethod: PaymentMethodID) => {
      setSelectedPaymentMethod(paymentMethod);
      setPaymentData({
        paymentMethod,
        paymentProvider: (
          activePaymentProvidersByChannel as ChannelActivePaymentProvidersByChannel
        )[paymentMethod] as PaymentProviderID,
      });
    },
    [activePaymentProvidersByChannel, setPaymentData]
  );

  const firstAvailableMethod = availablePaymentMethods[0];

  useEffect(() => {
    if (loading) {
      return;
    }

    if (activePaymentProvidersByChannel && !availablePaymentMethods.length) {
      throw new Error("No available payment providers");
    } else if (!selectedPaymentMethod && firstAvailableMethod) {
      handleSelect(firstAvailableMethod);
    }
  }, [
    loading,
    activePaymentProvidersByChannel,
    availablePaymentMethods.length,
    selectedPaymentMethod,
    handleSelect,
    firstAvailableMethod,
  ]);

  return {
    onSelectPaymentMethod: handleSelect,
    availablePaymentMethods,
    availablePaymentProviders,
    activePaymentProvidersByChannel,
    selectedPaymentMethod,
  };
};
