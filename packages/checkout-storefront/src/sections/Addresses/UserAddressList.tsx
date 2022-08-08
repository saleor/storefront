import React from "react";
import { AddressFragment, useChannelQuery } from "@/checkout-storefront/graphql";
import { AddressSelectBox } from "./AddressSelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { useAddressList } from "@/checkout-storefront/sections/Addresses/AddressListProvider";

interface UserAddressListProps {
  onEditChange: (id: string) => void;
}

export const UserAddressList: React.FC<UserAddressListProps> = ({ onEditChange }) => {
  const { addressList, selectedAddressId, setSelectedAddressId } = useAddressList();
  // const [{ data, fetching: loading }] = useChannelQuery({
  //   variables: { slug: "default-channel" },
  // });

  // console.log({ data });

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
        />
      ))}
    </SelectBoxGroup>
  );
};
