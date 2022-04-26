import { Radio, RadioOption } from "@/components/Radio";
import { RadioGroup } from "@/components/RadioGroup";
import { Title } from "@/components/Title";
import { useFetch } from "@/hooks/useFetch";
import { MessageKey, useFormattedMessages } from "@/hooks/useFormattedMessages";
import React from "react";
import { getPaymentProviders } from "@/fetch";
import { camelCase, map } from "lodash-es";

export const PaymentProviders: React.FC<
  Pick<RadioOption, "onSelect" | "selectedValue">
> = ({ ...rest }) => {
  const formatMessage = useFormattedMessages();
  const [{ data: availalablePaymentProviders }] = useFetch(getPaymentProviders);

  return (
    <div className="mb-10">
      <Title>{formatMessage("paymentProviders")}</Title>
      <RadioGroup label={formatMessage("paymentProvidersLabel")}>
        {map(
          availalablePaymentProviders || {},
          (providerId: string, providerKey: string) => {
            return (
              <Radio
                value={providerId}
                title={formatMessage(camelCase(providerKey) as MessageKey)}
                {...rest}
              />
            );
          }
        )}
      </RadioGroup>
    </div>
  );
};
