import { MessageKey, useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { camelCase } from "lodash-es";
import { PaymentMethodID } from "checkout-common";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { Text } from "@saleor/ui-kit";
import { UsePaymentMethods } from "./usePaymentMethods";

export type PaymentMethodsProps = UsePaymentMethods;

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  availablePaymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const formatMessage = useFormattedMessages();

  return (
    <SelectBoxGroup label={formatMessage("paymentProvidersLabel")} className="flex flex-row gap-2">
      {availablePaymentMethods.map((paymentMethodId: PaymentMethodID) => (
        <SelectBox
          className="shrink"
          value={paymentMethodId}
          selectedValue={selectedPaymentMethod}
          onSelect={(value: string) => setSelectedPaymentMethod(value as PaymentMethodID)}
        >
          <Text>{formatMessage(camelCase(paymentMethodId) as MessageKey)}</Text>
        </SelectBox>
      ))}
    </SelectBoxGroup>
  );
};
