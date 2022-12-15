import { getPaymentMethods } from "@/checkout-storefront/fetch";
import { useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { usePaymentDataActions } from "@/checkout-storefront/state/paymentDataStore";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import { useEffect } from "react";
import { getParsedPaymentMethods } from "@/checkout-storefront/sections/PaymentSection/utils";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { PaymentMethodID, PaymentProviderID } from "checkout-common";

interface PaymentProvidersFormData {
  selectedMethodId: PaymentMethodID | undefined;
}

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

  const [{ data: allPaymentOptions, loading }] = useFetch(getPaymentMethods, {
    args: { channelId, checkoutApiUrl, saleorApiUrl },
    skip: !channelId,
  });

  const availablePaymentMethods = getParsedPaymentMethods(allPaymentOptions);

  const firstAvailableMethod = availablePaymentMethods[0];

  const form = useForm<PaymentProvidersFormData>({
    initialValues: { selectedMethodId: firstAvailableMethod },
    onSubmit: ({ selectedMethodId }) => {
      if (!selectedMethodId || !allPaymentOptions) {
        return;
      }

      setPaymentData({
        paymentMethod: selectedMethodId,
        paymentProvider: allPaymentOptions[selectedMethodId] as PaymentProviderID,
      });
    },
  });

  const {
    values: { selectedMethodId },
    setFieldValue,
    handleSubmit,
  } = form;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (allPaymentOptions && !availablePaymentMethods.length) {
      throw new Error("No available payment providers");
    } else if (!selectedMethodId && firstAvailableMethod) {
      void setFieldValue("selectedMethodId", firstAvailableMethod);
    }
  }, [
    allPaymentOptions,
    availablePaymentMethods.length,
    firstAvailableMethod,
    loading,
    selectedMethodId,
    setFieldValue,
  ]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit, selectedMethodId]);

  return { form, availablePaymentMethods };
};
