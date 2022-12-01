import { getPaymentMethods } from "@/checkout-storefront/fetch";
import { useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { usePaymentDataActions } from "@/checkout-storefront/state/paymentDataStore";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import {
  ChannelActivePaymentProvidersByChannel,
  PaymentMethodID,
  PaymentProviderID,
} from "checkout-common";
import { useCallback, useEffect, useState } from "react";
import { getParsedPaymentMethods } from "@/checkout-storefront/sections/PaymentSection/utils";

export const usePaymentMethodsForm = () => {
  const { setPaymentData } = usePaymentDataActions();

  const {
    checkout: {
      channel: { id: channelId },
    },
  } = useCheckout();

  const {
    env: { checkoutApiUrl },
    saleorApiUrl,
  } = useAppConfig();

  // possibly change to form once we switch to formik
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodID | null>(null);

  const [{ data: allPaymentOptions, loading }] = useFetch(getPaymentMethods, {
    args: { channelId, checkoutApiUrl, saleorApiUrl },
    skip: !channelId,
  });

  const availablePaymentMethods = getParsedPaymentMethods(allPaymentOptions);

  const handleSelect = useCallback(
    (paymentMethod: PaymentMethodID) => {
      setSelectedPaymentMethod(paymentMethod);
      setPaymentData({
        paymentMethod,
        paymentProvider: (allPaymentOptions as ChannelActivePaymentProvidersByChannel)[
          paymentMethod
        ] as PaymentProviderID,
      });
    },
    [allPaymentOptions, setPaymentData]
  );

  const firstAvailableMethod = availablePaymentMethods[0];

  useEffect(() => {
    if (loading) {
      return;
    }

    if (allPaymentOptions && !availablePaymentMethods.length) {
      throw new Error("No available payment providers");
    } else if (!selectedPaymentMethod && firstAvailableMethod) {
      handleSelect(firstAvailableMethod);
    }
  }, [
    loading,
    allPaymentOptions,
    availablePaymentMethods.length,
    selectedPaymentMethod,
    handleSelect,
    firstAvailableMethod,
  ]);

  return { onSelectPaymentMethod: handleSelect, availablePaymentMethods, selectedPaymentMethod };
};
