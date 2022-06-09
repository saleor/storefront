import { Title } from "@/checkout/components/Title";
import { useFetch } from "@/checkout/hooks/useFetch";
import { MessageKey, useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import React from "react";
import { getPaymentProviders } from "@/checkout/fetch";
import { camelCase, map } from "lodash-es";
import { RadioBoxGroup } from "@/checkout/components/RadioBoxGroup";
import { RadioBox, RadioBoxProps } from "@/checkout/components/RadioBox";

export const PaymentProviders: React.FC<
  Pick<RadioBoxProps, "onSelect" | "value" | "selectedValue">
> = ({ ...rest }) => {
  const formatMessage = useFormattedMessages();
  const [{ data: availalablePaymentProviders }] = useFetch(getPaymentProviders);

  return (
    <div className="mb-10">
      <Title>{formatMessage("paymentProviders")}</Title>
      <RadioBoxGroup label={formatMessage("paymentProvidersLabel")}>
        {map(
          availalablePaymentProviders || {},
          (providerId: string, providerKey: string) => {
            return (
              <RadioBox
                value={providerId}
                title={formatMessage(camelCase(providerKey) as MessageKey)}
                {...rest}
              />
            );
          }
        )}
      </RadioBoxGroup>
    </div>
  );
};
