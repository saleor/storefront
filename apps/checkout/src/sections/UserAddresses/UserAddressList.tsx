import React from "react";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { AddressFragment, useUserAddressDeleteMutation } from "@graphql";

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
    <div>
      {addresses.map(
        ({
          id,
          firstName,
          lastName,
          country,
          phone,
          streetAddress1,
          streetAddress2,
          postalCode,
          countryArea,
          city,
        }: AddressFragment) => (
          <div className="mb-4 flex flex-row justify-between">
            <div className="flex flex-row">
              <input
                type="radio"
                className="mr-2 mt-1"
                checked={selectedAddressId === id}
                onChange={() => onAddressSelect(id)}
              />
              <div>
                <Text weight="bold">{firstName + " " + lastName}</Text>
                <p>{streetAddress1}</p>
                <p>{streetAddress2}</p>
                <p>{postalCode + " " + city}</p>
                <p>{country.country}</p>
                <p>{countryArea}</p>
                <p>{phone}</p>
              </div>
            </div>
            <div>
              <Button
                ariaLabel="edit address"
                title="edit"
                onClick={() => onEditChange(id)}
              />
              <Button
                ariaLabel="delete address"
                variant="secondary"
                title="delete"
                onClick={() => deleteAddress({ id })}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};
