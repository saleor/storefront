import { Title } from "@/checkout-storefront/components/Title";
import { MessageKey, useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { camelCase } from "lodash-es";
import { UsePaymentMethods } from "./usePaymentMethods";
import { PaymentMethodID } from "checkout-common";
import { CommonSectionProps } from "../Addresses/types";

export const PaymentMethods: React.FC<UsePaymentMethods & CommonSectionProps> = ({
  // availablePaymentMethods,
  collapsed,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const formatMessage = useFormattedMessages();

  // TMP mock before this is fixed https://github.com/saleor/saleor-checkout/issues/171
  // and payment providers work again
  const availablePaymentMethods: PaymentMethodID[] = ["creditCard", "applePay", "paypal"];

  if (collapsed) {
    return null;
  }

  return (
    <div className="section">
      <Title>{formatMessage("paymentProviders")}</Title>
      {/* <Select label={formatMessage("paymentProvidersLabel")}>
        {availablePaymentMethods.map((paymentMethodId: PaymentMethodID) => {
          return (
            <RadioBox
              value={paymentMethodId}
              title={formatMessage(camelCase(paymentMethodId) as MessageKey)}
              selectedValue={selectedPaymentMethod}
              onSelect={(value: string) => setSelectedPaymentMethod(value as PaymentMethodID)}
            />
          );
        })}
      </RadioBoxGroup> */}
    </div>
  );
};
