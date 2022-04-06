import { Button } from "@components/Button";
import {
  AddressFragment,
  CountryCode,
  useUserAddressCreateMutation,
  useUserAddressUpdateMutation,
} from "@graphql";
import { extractMutationErrors, getById } from "@lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React, { Suspense, useEffect, useState } from "react";
import { AddressFormData, UserAddressFormData } from "./types";
import { UserAddressForm } from "./UserAddressForm";
import { UserAddressList } from "./UserAddressList";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";
import { getAddressInputData } from "./utils";

export interface UserAddressSectionProps {
  // TMP
  defaultAddress?: Pick<AddressFragment, "id"> | null;
  onAddressSelect: (address: UserAddressFormData) => void;
  addresses: AddressFragment[];
  title: string;
  type: AddressTypeEnum;
}

export const UserAddressSection: React.FC<UserAddressSectionProps> = ({
  defaultAddress,
  addresses = [],
  onAddressSelect,
  title,
  type,
}) => {
  const [addAddressOpened, setAddAddressOpened] = useState(false);

  const [editedAddressId, setEditedAddressId] = useState<string | null>();

  const [selectedCountryCode, setSelectedCountryCode] =
    useState<CountryCode>("PL");

  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id
  );

  const selectedAddress = addresses.find(getById(selectedAddressId));

  const onSelectAddress = (id: string) => setSelectedAddressId(id);

  useEffect(() => {
    if (!!selectedAddress) {
      onAddressSelect(selectedAddress as unknown as UserAddressFormData);
    }
  }, [selectedAddressId]);

  const editAddressOpened = !!editedAddressId;

  const [, userAddressUpdate] = useUserAddressUpdateMutation();
  const [, userAddressAdd] = useUserAddressCreateMutation();

  const handleAddressUpdate = async (address: UserAddressFormData) => {
    const result = await userAddressUpdate({
      address: getAddressInputData({
        ...address,
        countryCode: selectedCountryCode,
      }),
      id: address.id,
    });

    const [hasErrors] = extractMutationErrors(result);

    if (!hasErrors) {
      setEditedAddressId(null);
    }
  };

  const handleAddressAdd = async (address: AddressFormData) => {
    const result = await userAddressAdd({
      address: getAddressInputData({
        ...address,
        countryCode: selectedCountryCode,
      }),
      type,
    });

    const [hasErrors] = extractMutationErrors(result);

    if (!hasErrors) {
      setAddAddressOpened(false);
    }
  };

  return (
    <Suspense fallback="loaden...">
      <UserAddressSectionContainer
        title={title}
        displayCountrySelect={editAddressOpened || addAddressOpened}
        selectedCountryCode={selectedCountryCode}
        onCountrySelect={setSelectedCountryCode}
      >
        {addAddressOpened ? (
          <UserAddressForm
            onSave={handleAddressAdd}
            countryCode={selectedCountryCode}
            onCancel={() => setAddAddressOpened(false)}
          />
        ) : (
          <Button
            ariaLabel="add new address"
            onClick={() => setAddAddressOpened(true)}
            title="Add new address"
            className="mb-4"
          />
        )}

        {editAddressOpened ? (
          <UserAddressForm
            onSave={handleAddressUpdate}
            countryCode={selectedCountryCode}
            defaultValues={
              addresses.find(
                getById(editedAddressId as string)
                // TMP
              ) as unknown as UserAddressFormData
            }
            onCancel={() => setEditedAddressId(null)}
          />
        ) : (
          <UserAddressList
            addresses={addresses as AddressFragment[]}
            onAddressSelect={onSelectAddress}
            selectedAddressId={selectedAddressId}
            onEditChange={(id: string) => setEditedAddressId(id)}
          />
        )}
      </UserAddressSectionContainer>
    </Suspense>
  );
};
