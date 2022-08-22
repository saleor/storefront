import React from "react";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { AddressSelectBox } from "./AddressSelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { useAddressList } from "@/checkout-storefront/sections/Addresses/AddressListProvider";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import { useAddressAvailability } from "@/checkout-storefront/sections/Addresses/useAddressAvailability";

interface UserAddressListProps {
  onEditChange: (id: string) => void;
  type: AddressTypeEnum;
}

export const UserAddressList: React.FC<UserAddressListProps> = ({ onEditChange, type }) => {
  const isShippingAddressList = type === "SHIPPING";
  const { addressList, selectedAddressId, setSelectedAddressId } = useAddressList();
  const { isAvailable } = useAddressAvailability({ pause: !isShippingAddressList });

  return (
    <SelectBoxGroup label="user addresses">
      {addressList.map(({ id, ...rest }: AddressFragment) => (
        <AddressSelectBox
          key={id}
          value={id}
          selectedValue={selectedAddressId}
          onSelect={() => setSelectedAddressId(id)}
          address={{ ...rest }}
          onEdit={() => onEditChange(id)}
          unavailable={!isAvailable(rest)}
        />
      ))}
    </SelectBoxGroup>
  );
};
