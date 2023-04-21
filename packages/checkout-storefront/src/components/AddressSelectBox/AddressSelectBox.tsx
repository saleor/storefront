import { Text, TextProps } from "@saleor/ui-kit";
import React from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SelectBox, SelectBoxProps } from "@/checkout-storefront/components/SelectBox";
import { Button } from "@/checkout-storefront/components/Button";
import { Address } from "@/checkout-storefront/components/Address";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { addressSelectBoxLabels, addressSelectBoxMessages } from "./messages";
import { AddressField } from "@/checkout-storefront/components/AddressForm/types";

interface AddressSelectBoxProps<TFieldName extends string>
  extends Omit<SelectBoxProps<TFieldName>, "children"> {
  address: Partial<Record<AddressField, any>>;
  onEdit: () => void;
  unavailable: boolean;
}

export const AddressSelectBox = <TFieldName extends string>({
  address,
  onEdit,
  unavailable,
  ...rest
}: AddressSelectBoxProps<TFieldName>) => {
  const formatMessage = useFormattedMessages();

  const textProps: Pick<TextProps, "color"> = unavailable
    ? {
        color: "secondary",
      }
    : {};

  return (
    <SelectBox {...rest} disabled={unavailable}>
      <div className="w-full flex flex-row justify-between">
        <Address address={address as AddressFragment} {...textProps}>
          {unavailable && (
            <Text size="xs" className="my-1">
              {formatMessage(addressSelectBoxMessages.cantShipToAddress)}
            </Text>
          )}
        </Address>
        <div>
          <Button
            variant="tertiary"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            ariaLabel={formatMessage(addressSelectBoxMessages.editAddress)}
            className="absolute right-4 pointer-events-auto"
            label={formatMessage(addressSelectBoxLabels.editAddress)}
          />
        </div>
      </div>
    </SelectBox>
  );
};
