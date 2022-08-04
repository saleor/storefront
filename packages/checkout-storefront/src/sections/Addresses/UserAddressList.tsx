import React from "react";
import { AddressFragment, useUserAddressDeleteMutation } from "@/checkout-storefront/graphql";
import { AddressSelectBox } from "./AddressSelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { Skeleton } from "@/checkout-storefront/components";
import { AddressSkeleton } from "@/checkout-storefront/sections/Addresses/AddressSkeleton";

interface UserAddressListProps {
  onAddressSelect: (id: string) => void;
  addresses: AddressFragment[];
  selectedAddressId?: string;
  onEditChange: (id: string) => void;
  loading: boolean;
}

export const UserAddressList: React.FC<UserAddressListProps> = ({
  onAddressSelect,
  selectedAddressId,
  addresses = [],
  onEditChange,
  loading,
}) => {
  const [, deleteAddress] = useUserAddressDeleteMutation();
  const { showErrors } = useAlerts("userAddressDelete");

  const handleAddressDelete = async (id: string) => {
    const result = await deleteAddress({ id });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors);
      return;
    }
  };

  return (
    <SelectBoxGroup label="user addresses">
      {addresses.map(({ id, ...rest }: AddressFragment) =>
        loading ? (
          <AddressSkeleton />
        ) : (
          <AddressSelectBox
            key={id}
            value={id}
            selectedValue={selectedAddressId}
            onSelect={() => onAddressSelect(id)}
            address={rest}
            onDelete={() => void handleAddressDelete(id)}
            onEdit={() => onEditChange(id)}
          />
        )
      )}
    </SelectBoxGroup>
  );
};
