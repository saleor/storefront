import { Title } from "@/components/Title";
import { useFetch } from "@/hooks/useFetch";
import { MessageKey, useFormattedMessages } from "@/hooks/useFormattedMessages";
import React from "react";
import { getPaymentProviders } from "@/fetch";
import { camelCase, map } from "lodash-es";
import { RadioBoxGroup } from "@/components/RadioBoxGroup";
import { RadioBox, RadioBoxProps } from "@/components/RadioBox";

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
