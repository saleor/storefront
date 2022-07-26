import { Title } from "@/checkout-storefront/components/Title";
import {
  MessageKey,
  useFormattedMessages,
} from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { camelCase } from "lodash-es";
import { UsePaymentMethods } from "./usePaymentMethods";
import { PaymentMethodID } from "checkout-common";
import { CommonSectionProps } from "../Addresses/types";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { Text } from "@saleor/ui-kit";
import { Divider } from "@/checkout-storefront/components/Divider";

export const PaymentMethods: React.FC<
  UsePaymentMethods & CommonSectionProps
> = ({
  // availablePaymentMethods,
  collapsed,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const formatMessage = useFormattedMessages();

  // TMP mock before this is fixed https://github.com/saleor/saleor-checkout/issues/171
  // and payment providers work again
  const availablePaymentMethods: PaymentMethodID[] = [
    "creditCard",
    "applePay",
    "paypal",
  ];

  if (collapsed) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className="section">
        <Title>{formatMessage("paymentProviders")}</Title>
        <SelectBoxGroup
          label={formatMessage("paymentProvidersLabel")}
          className="flex flex-row gap-2"
        >
          {availablePaymentMethods.map((paymentMethodId: PaymentMethodID) => {
            return (
              <SelectBox
                className="shrink"
                value={paymentMethodId}
                selectedValue={selectedPaymentMethod}
                onSelect={(value: string) =>
                  setSelectedPaymentMethod(value as PaymentMethodID)
                }
              >
                <Text>
                  {formatMessage(camelCase(paymentMethodId) as MessageKey)}
                </Text>
              </SelectBox>
            );
          })}
        </SelectBoxGroup>
      </div>
    </>
  );
};