import { Title } from "@/checkout-storefront/components/Title";
import {
  MessageKey,
  useFormattedMessages,
} from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { camelCase } from "lodash-es";
import { RadioBoxGroup } from "@/checkout-storefront/components/RadioBoxGroup";
import { RadioBox } from "@/checkout-storefront/components/RadioBox";
import { UsePaymentMethods } from "./usePaymentMethods";
import { PaymentMethodID } from "checkout-common";

export const PaymentMethods: React.FC<UsePaymentMethods> = ({
  availablePaymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const formatMessage = useFormattedMessages();

  return (
    <div className="mb-10">
      <Title>{formatMessage("paymentProviders")}</Title>
      <RadioBoxGroup label={formatMessage("paymentProvidersLabel")}>
        {availablePaymentMethods.map((paymentMethodId: PaymentMethodID) => {
          return (
            <RadioBox
              value={paymentMethodId}
              title={formatMessage(camelCase(paymentMethodId) as MessageKey)}
              selectedValue={selectedPaymentMethod}
              onSelect={(value: string) =>
                setSelectedPaymentMethod(value as PaymentMethodID)
              }
            />
          );
        })}
      </RadioBoxGroup>
    </div>
  );
};
