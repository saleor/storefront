import { AddressFragment } from "@/checkout-storefront/graphql";
import { Text } from "@saleor/ui-kit";

export const Address = ({ address }: { address: AddressFragment }) => {
  return (
    <div>
      <Text color="secondary">
        {address.firstName} {address.lastName}
      </Text>
      <Text color="secondary">{address.streetAddress1}</Text>
      {address.streetAddress2 && <Text color="secondary">{address.streetAddress2}</Text>}
      <Text color="secondary">
        {address.postalCode} {address.city}, {address.country.country}
      </Text>
    </div>
  );
};
