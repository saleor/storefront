import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { PaymentMethodID } from "checkout-common";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { Text } from "@saleor/ui-kit";
import { UsePaymentMethods } from "./usePaymentMethods";
import { paymentMethodsMessages, labels } from "./messages";

export type PaymentMethodsProps = UsePaymentMethods;

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  availablePaymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const formatMessage = useFormattedMessages();

  return (
    <SelectBoxGroup label={formatMessage(labels.paymentProviders)} className="flex flex-row gap-2">
      {availablePaymentMethods.map((paymentMethodId: PaymentMethodID) => (
        <SelectBox
          className="shrink"
          value={paymentMethodId}
          selectedValue={selectedPaymentMethod}
          onSelect={(value: string) => setSelectedPaymentMethod(value as PaymentMethodID)}
        >
          <Text>{formatMessage(paymentMethodsMessages[paymentMethodId])}</Text>
        </SelectBox>
      ))}
    </SelectBoxGroup>
  );
};
