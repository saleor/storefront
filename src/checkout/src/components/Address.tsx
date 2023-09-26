import { type AddressFragment } from "@/checkout/src/graphql";
import { type TextProps, Text } from "@/checkout/ui-kit";
import compact from "lodash-es/compact";
import React, { type PropsWithChildren } from "react";

interface AddressProps extends Omit<TextProps, "children"> {
  address: AddressFragment;
}

export const Address: React.FC<PropsWithChildren<AddressProps>> = ({
  address,
  children,
  ...textProps
}) => {
  const name = `${address.firstName} ${address.lastName}`;

  const { phone, city, countryArea, postalCode, streetAddress1, country } = address;

  return (
    <div className="flex flex-col pointer-events-none">
      <Text {...textProps} weight="semibold">
        {name}
      </Text>
      <Text {...textProps}>{phone}</Text>
      <Text {...textProps}>{compact([streetAddress1, city, postalCode]).join(", ")}</Text>
      <Text {...textProps}>{compact([countryArea, country.country]).join(", ")}</Text>
      {children}
    </div>
  );
};
