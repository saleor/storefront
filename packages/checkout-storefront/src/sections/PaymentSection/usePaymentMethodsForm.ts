import { getPaymentMethods } from "@/checkout-storefront/fetch";
import { useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { useSetSelectedPaymentData } from "@/checkout-storefront/state/paymentMethodsStore";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import {
  ChannelActivePaymentProvidersByChannel,
  PaymentMethodID,
  PaymentProviderID,
} from "checkout-common";
import { useEffect, useState } from "react";

export type AvailablePaymentMethods = PaymentMethodID[];

export const usePaymentMethodsForm = () => {
  const setSelectedPaymentData = useSetSelectedPaymentData();
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

  const getParsedPaymentMethods = (
    allPaymentMethods: ChannelActivePaymentProvidersByChannel | null | undefined
  ): AvailablePaymentMethods => {
    if (!allPaymentMethods) {
      return [];
    }

    return Object.entries(allPaymentMethods)
      .filter(([, paymentProviderId]) => !!paymentProviderId)
      .map(([paymentMethodId]) => paymentMethodId) as AvailablePaymentMethods;
  };

  const availablePaymentMethods = getParsedPaymentMethods(allPaymentOptions);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (allPaymentOptions && !availablePaymentMethods.length) {
      throw new Error("No available payment providers");
    } else if (!selectedPaymentMethod && availablePaymentMethods[0]) {
      setSelectedPaymentMethod(availablePaymentMethods[0]);
    }
  }, [loading, allPaymentOptions, availablePaymentMethods, selectedPaymentMethod]);

  const handleSelect = (paymentMethod: PaymentMethodID) => {
    setSelectedPaymentMethod(paymentMethod);
    setSelectedPaymentData({
      paymentMethod,
      paymentProvider: (allPaymentOptions as ChannelActivePaymentProvidersByChannel)[
        paymentMethod
      ] as PaymentProviderID,
    });
  };

  return { onSelectPaymentMethod: handleSelect, availablePaymentMethods, selectedPaymentMethod };
};
