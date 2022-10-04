import { MessageKey, useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React, { SyntheticEvent, useEffect, useMemo } from "react";
import { camelCase, compact } from "lodash-es";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { Text } from "@saleor/ui-kit";
import {
  ChannelActivePaymentProvidersByChannel,
  PaymentMethodID,
  PaymentProviderID,
} from "checkout-common";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import { useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { getPaymentMethods } from "@/checkout-storefront/fetch";
import { AvailablePaymentMethods } from "@/checkout-storefront/sections/PaymentSection/types";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/types";

export interface PaymentMethodsProps {
  selectedPaymentMethod: PaymentMethodID;
  setValue: (key: keyof CheckoutFormData, value: PaymentProviderID | PaymentMethodID) => void;
  onSelect: (event: SyntheticEvent) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedPaymentMethod,
  onSelect,
  setValue,
}) => {
  const formatMessage = useFormattedMessages();
  const {
    checkout: {
      channel: { id: channelId },
    },
  } = useCheckout();

  const {
    env: { checkoutApiUrl },
  } = useAppConfig();

  const [{ data: allPaymentOptions, loading }] = useFetch(getPaymentMethods, {
    args: { channelId, checkoutApiUrl },
    skip: !channelId,
  });

  const getParsedPaymentMethods = (
    allPaymentMethods: ChannelActivePaymentProvidersByChannel | null | undefined
  ): AvailablePaymentMethods => {
    if (!allPaymentMethods) {
      return [];
    }

    return compact(Object.keys(allPaymentMethods)) as AvailablePaymentMethods;
  };

  const availablePaymentMethods = getParsedPaymentMethods(allPaymentOptions);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (allPaymentOptions && !availablePaymentMethods.length) {
      throw new Error("No available payment providers");
    } else if (!selectedPaymentMethod) {
      setValue("paymentMethodId", availablePaymentMethods[0] as PaymentMethodID);
    }
  }, [loading, allPaymentOptions, availablePaymentMethods, selectedPaymentMethod, setValue, channelId]);

  const paymentProviderID = useMemo(
    () => allPaymentOptions?.[selectedPaymentMethod],
    [selectedPaymentMethod, allPaymentOptions]
  );

  useEffect(() => {
    if (paymentProviderID) {
      setValue("paymentProviderId", paymentProviderID);
    }
  }, [setValue, paymentProviderID]);

  return (
    <SelectBoxGroup label={formatMessage("paymentProvidersLabel")} className="flex flex-row gap-2">
      {availablePaymentMethods.map((paymentMethodId: PaymentMethodID) => (
        <SelectBox
          className="shrink"
          value={paymentMethodId}
          selectedValue={selectedPaymentMethod || availablePaymentMethods[0]}
          onChange={onSelect}
        >
          <Text>{formatMessage(camelCase(paymentMethodId) as MessageKey)}</Text>
        </SelectBox>
      ))}
    </SelectBoxGroup>
  );
};
