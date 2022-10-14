import React from "react";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { AddressSelectBox } from "../../components/AddressSelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { useAddressList } from "@/checkout-storefront/sections/UserAddressSection/AddressListProvider";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import { useAddressAvailability } from "@/checkout-storefront/hooks/useAddressAvailability";
import { useFormattedMessages } from "@/checkout-storefront/hooks";
import { userAddressLabels } from "./messages";

interface UserAddressListProps {
  onEditChange: (id: string) => void;
  type: AddressTypeEnum;
}

export const UserAddressList: React.FC<UserAddressListProps> = ({ onEditChange, type }) => {
  const formatMessage = useFormattedMessages();
  const isShippingAddressList = type === "SHIPPING";
  const { addressList, selectedAddressId, setSelectedAddressId } = useAddressList();
  const { isAvailable } = useAddressAvailability({ pause: !isShippingAddressList });

  return (
    <SelectBoxGroup
      label={formatMessage(
        isShippingAddressList
          ? userAddressLabels.shippingUserAddresses
          : userAddressLabels.billingUserAddresses
      )}
    >
      {addressList.map(({ id, ...rest }: AddressFragment) => (
        <AddressSelectBox
          value={id}
          key={`${type}-${id}`}
          id={`${type}-${id}`}
          selectedValue={selectedAddressId}
          onChange={() => setSelectedAddressId(id)}
          address={{ ...rest }}
          onEdit={() => onEditChange(id)}
          unavailable={!isAvailable(rest)}
        />
      ))}
    </SelectBoxGroup>
  );
};
