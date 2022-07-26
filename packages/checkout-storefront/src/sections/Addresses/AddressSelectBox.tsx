import { Radio, Text } from "@saleor/ui-kit";
import React from "react";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getSortedAddressFieldsFromAddress } from "@/checkout-storefront/lib/utils";
import { pull } from "lodash-es";
import {
  SelectBox,
  SelectBoxProps,
} from "@/checkout-storefront/components/SelectBox";
import { Button } from "@/checkout-storefront/components/Button";
import { compact } from "lodash-es";
// import { getSvgSrc } from "../lib/svgSrc";

interface AddressSelectBoxProps extends SelectBoxProps {
  address: Partial<Record<AddressField, any>>;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressSelectBox: React.FC<AddressSelectBoxProps> = ({
  address,
  onDelete,
  onEdit,
  ...rest
}) => {
  const formatMessage = useFormattedMessages();
  const name = `${address.firstName} ${address.lastName}`;

  const { phone, city, countryArea, postalCode, streetAddress1, country } =
    address;

  return (
    <SelectBox {...rest}>
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-col pointer-events-none">
          <Text weight="semibold">{name}</Text>
          <Text>{phone}</Text>
          <Text>{compact([streetAddress1, city, postalCode]).join(", ")}</Text>
          <Text>{compact([countryArea, country.country]).join(", ")}</Text>
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
