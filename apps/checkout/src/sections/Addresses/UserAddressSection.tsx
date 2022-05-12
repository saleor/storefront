import { Button } from "@/components/Button";
import { AddressFragment, CountryCode } from "@/graphql";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { getById } from "@/lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React, { Suspense, useEffect, useState } from "react";
import { UserAddressFormData } from "./types";
import { UserAddressList } from "./UserAddressList";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";
import { AddressCreateForm } from "./AddressCreateForm";
import { AddressEditForm } from "./AddressEditForm";
import { getAddressFormDataFromAddress } from "./utils";

export interface UserAddressSectionProps {
  defaultAddress?: Pick<AddressFragment, "id"> | null;
  onAddressSelect: (address: UserAddressFormData) => void;
  addresses: AddressFragment[];
  title: string;
  type: AddressTypeEnum;
}

const defaultCountryCode: CountryCode = "PL";

export const UserAddressSection: React.FC<UserAddressSectionProps> = ({
  defaultAddress,
  addresses = [],
  onAddressSelect,
  title,
  type,
}) => {
  const formatMessage = useFormattedMessages();

  const [displayAddressCreate, setDisplayAddressCreate] = useState(false);

  const [editedAddressId, setEditedAddressId] = useState<string | null>();

  const displayAddressEdit = !!editedAddressId;

  const displayAddressList = !displayAddressEdit && !displayAddressCreate;

  const [selectedCountryCode, setSelectedCountryCode] =
    useState<CountryCode>(defaultCountryCode);

  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id
  );

  const editedAddress = addresses.find(getById(editedAddressId as string));

  const selectedAddress = addresses.find(getById(selectedAddressId));

  const onSelectAddress = (id: string) => setSelectedAddressId(id);

  const handleSelectCountry = (address?: AddressFragment) => () =>
    setSelectedCountryCode(
      (address?.country.code as CountryCode) || defaultCountryCode
    );

  useEffect(handleSelectCountry(selectedAddress), [selectedAddress]);

  useEffect(handleSelectCountry(editedAddress), [editedAddress]);

  useEffect(() => {
    if (!!selectedAddress) {
      onAddressSelect(selectedAddress as unknown as UserAddressFormData);
    }
  }, [selectedAddressId]);

  return (
    <Suspense fallback="loading...">
      <UserAddressSectionContainer
        title={title}
        displayCountrySelect={displayAddressEdit || displayAddressCreate}
        selectedCountryCode={selectedCountryCode}
        onCountrySelect={setSelectedCountryCode}
      >
        <AddressCreateForm
          show={displayAddressCreate}
          countryCode={selectedCountryCode}
          type={type}
          onClose={() => setDisplayAddressCreate(false)}
        />

        <AddressEditForm
          show={displayAddressEdit}
          countryCode={selectedCountryCode}
          onClose={() => setEditedAddressId(null)}
          defaultValues={getAddressFormDataFromAddress(editedAddress)}
        />

        {displayAddressList && (
          <>
            <Button
              variant="secondary"
              ariaLabel={formatMessage("addAddressLabel")}
              onClick={() => setDisplayAddressCreate(true)}
              label={formatMessage("addAddress")}
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
