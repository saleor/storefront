import { Text, TextProps } from "@saleor/ui-kit";
import React from "react";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SelectBox, SelectBoxProps } from "@/checkout-storefront/components/SelectBox";
import { Button } from "@/checkout-storefront/components/Button";
import { compact } from "lodash-es";

interface AddressSelectBoxProps extends Omit<SelectBoxProps, "children"> {
  address: Partial<Record<AddressField, any>>;
  onEdit: () => void;
  unavailable: boolean;
}

export const AddressSelectBox: React.FC<AddressSelectBoxProps> = ({
  address,
  onEdit,
  unavailable,
  ...rest
}) => {
  const formatMessage = useFormattedMessages();
  const name = `${address.firstName} ${address.lastName}`;

  const { phone, city, countryArea, postalCode, streetAddress1, country } = address;

  const textProps: Pick<TextProps, "color"> = unavailable
    ? {
        color: "secondary",
      }
    : {};

  return (
    <SelectBox {...rest} disabled={unavailable}>
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-col pointer-events-none">
          <Text {...textProps} weight="semibold">
            {name}
          </Text>
          <Text {...textProps}>{phone}</Text>
          <Text {...textProps}>{compact([streetAddress1, city, postalCode]).join(", ")}</Text>
          <Text {...textProps}>{compact([countryArea, country.country]).join(", ")}</Text>
          {unavailable && (
            <Text size="xs" className="my-1">
              {formatMessage("cantShipToAddress")}
            </Text>
          )}
        </div>
        <div>
          <Button
            variant="tertiary"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            ariaLabel={formatMessage("editAddressLabel")}
            className="mr-2"
            label={formatMessage("edit")}
          />
        </div>
      </div>
    </SelectBox>
  );
};
