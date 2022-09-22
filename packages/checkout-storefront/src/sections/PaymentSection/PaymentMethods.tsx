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

export interface PaymentMethodsProps {
  selectedPaymentMethod: PaymentMethodID;
  onSelect: (event: SyntheticEvent) => void;
  setPaymentProvider: (paymentProviderID: PaymentProviderID) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedPaymentMethod,
  onSelect,
  setPaymentProvider,
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
    if (!loading && allPaymentOptions && !availablePaymentMethods.length) {
      throw new Error("No available payment providers");
    }
  }, [loading, allPaymentOptions, availablePaymentMethods]);

  const paymentProviderID = useMemo(
    () => allPaymentOptions?.[selectedPaymentMethod],
    [selectedPaymentMethod, allPaymentOptions]
  );

  useEffect(() => {
    if (paymentProviderID) {
      setPaymentProvider(paymentProviderID);
    }
  }, [setPaymentProvider, paymentProviderID]);

  return (
    <SelectBoxGroup label={formatMessage("paymentProvidersLabel")} className="flex flex-row gap-2">
      {availablePaymentMethods.map((paymentMethodId: PaymentMethodID) => (
        <SelectBox
          className="shrink"
          value={paymentMethodId}
          selectedValue={selectedPaymentMethod}
          onSelect={onSelect}
        >
          <Text>{formatMessage(camelCase(paymentMethodId) as MessageKey)}</Text>
        </SelectBox>
      ))}
    </SelectBoxGroup>
  );
};
