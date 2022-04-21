import { Button } from "@/components/Button";
import {
  AddressFragment,
  CountryCode,
  useUserAddressCreateMutation,
  useUserAddressUpdateMutation,
} from "@/graphql";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { extractMutationErrors, getById } from "@/lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React, { Suspense, useEffect, useState } from "react";
import { AddressFormData, UserAddressFormData } from "./types";
import { AddressForm } from "./AddressForm";
import { UserAddressList } from "./UserAddressList";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";
import { getAddressInputData } from "./utils";
import { useErrorsContext } from "@/providers/ErrorsProvider";

export interface UserAddressSectionProps {
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
  const formatMessage = useFormattedMessages();
  const { setErrorsFromApi } = useErrorsContext();
  const [displayAddressAdd, setDisplayAddressAdd] = useState(false);

  const [editedAddressId, setEditedAddressId] = useState<string | null>();

  const displayAddressEdit = !!editedAddressId;

  const displayAddressList = !displayAddressEdit && !displayAddressAdd;

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

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      setEditedAddressId(null);
      return;
    }

    setErrorsFromApi(errors);
  };

  const handleAddressAdd = async (address: AddressFormData) => {
    const result = await userAddressAdd({
      address: getAddressInputData({
        ...address,
        countryCode: selectedCountryCode,
      }),
      type,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      setDisplayAddressAdd(false);
      return;
    }

    setErrorsFromApi(errors);
  };

  return (
    <Suspense fallback="loading...">
      <UserAddressSectionContainer
        title={title}
        displayCountrySelect={displayAddressEdit || displayAddressAdd}
        selectedCountryCode={selectedCountryCode}
        onCountrySelect={setSelectedCountryCode}
      >
        {displayAddressAdd && (
          <AddressForm
            onSave={handleAddressAdd}
            countryCode={selectedCountryCode}
            onCancel={() => setDisplayAddressAdd(false)}
          />
        )}

        {displayAddressEdit && (
          <AddressForm
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
        )}

        {displayAddressList && (
          <>
            <Button
              variant="secondary"
              ariaLabel={formatMessage("addAddressLabel")}
              onClick={() => setDisplayAddressAdd(true)}
              title={formatMessage("addAddress")}
              className="mb-4 w-full"
            />
            <UserAddressList
              addresses={addresses as AddressFragment[]}
              onAddressSelect={onSelectAddress}
              selectedAddressId={selectedAddressId}
              onEditChange={(id: string) => setEditedAddressId(id)}
            />
          </>
        )}
      </UserAddressSectionContainer>
    </Suspense>
  );
};
