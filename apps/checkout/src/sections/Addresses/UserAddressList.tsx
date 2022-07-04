import React from "react";
import {
  AddressFragment,
  useUserAddressDeleteMutation,
} from "@/checkout/graphql";
import { AddressRadioBox } from "../AddressRadioBox";
import { RadioBoxGroup } from "@/checkout/components/RadioBoxGroup";
import { extractMutationErrors } from "@/checkout/lib/utils";
import { useAlerts } from "@/checkout/hooks/useAlerts";

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
  const { showErrors, showSuccess } = useAlerts("userAddressDelete");

  const handleAddressDelete = async (id: string) => {
    const result = await deleteAddress({ id });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors);
      return;
    }

    showSuccess();
  };

  return (
    <RadioBoxGroup label="user addresses">
      {addresses.map(({ id, ...rest }: AddressFragment) => (
        <AddressRadioBox
          key={id}
          value={id}
          selectedValue={selectedAddressId}
          onSelect={() => onAddressSelect(id)}
          address={rest}
          onDelete={() => void handleAddressDelete(id)}
          onEdit={() => onEditChange(id)}
        />
      ))}
    </RadioBoxGroup>
  );
};
