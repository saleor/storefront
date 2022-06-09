import React from "react";
import {
  AddressFragment,
  useUserAddressDeleteMutation,
} from "@/checkout/graphql";
import { AddressRadioBox } from "../AddressRadioBox";
import { RadioBoxGroup } from "@/checkout/components/RadioBoxGroup";

interface UserAddressListProps {
  onAddressSelect: (id: string) => void;
  addresses: AddressFragment[];
  selectedAddressId?: string;
  onEditChange: (id: string) => void;
}

export const UserAddressList: React.FC<UserAddressListProps> = ({
  onAddressSelect,
  selectedAddressId,
  addresses = [],
  onEditChange,
}) => {
  const [, deleteAddress] = useUserAddressDeleteMutation();

  return (
    <RadioBoxGroup label="user addresses">
      {addresses.map(({ id, ...rest }: AddressFragment) => (
        <AddressRadioBox
          key={id}
          value={id}
          selectedValue={selectedAddressId}
          onSelect={() => onAddressSelect(id)}
          address={rest}
          onDelete={() => deleteAddress({ id })}
          onEdit={() => onEditChange(id)}
        />
      ))}
    </RadioBoxGroup>
  );
};
