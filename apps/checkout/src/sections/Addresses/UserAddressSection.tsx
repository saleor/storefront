import { Button } from "@/checkout/components/Button";
import { AddressFragment, CountryCode } from "@/checkout/graphql";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { getById } from "@/checkout/lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React, { Suspense, useEffect, useState } from "react";
import { UserAddressFormData } from "./types";
import { UserAddressList } from "./UserAddressList";
import { UserAddressSectionContainer } from "./UserAddressSectionContainer";
import { AddressCreateForm } from "./AddressCreateForm";
import { AddressEditForm } from "./AddressEditForm";
import { getAddressFormDataFromAddress } from "./utils";
import { useCountrySelect } from "@/checkout/providers/CountrySelectProvider";
import {
  useUserAddressSelect,
  UseUserAddressSelectProps,
} from "./useUserAddressSelect";
import { AddressesSkeleton } from ".";

export interface UserAddressSectionProps extends UseUserAddressSelectProps {
  onAddressSelect: (address: UserAddressFormData) => void;
  addresses: AddressFragment[];
  title: string;
  type: AddressTypeEnum;
}

export const UserAddressSection: React.FC<UserAddressSectionProps> = ({
  defaultAddressId,
  addresses = [],
  onAddressSelect,
  title,
  type,
}) => {
  const formatMessage = useFormattedMessages();

  const { selectedAddress, selectedAddressId, setSelectedAddressId } =
    useUserAddressSelect({
      type,
      defaultAddressId,
      addresses,
    });

  const { setCountryCode } = useCountrySelect();

  const [displayAddressCreate, setDisplayAddressCreate] = useState(false);

  const [editedAddressId, setEditedAddressId] = useState<string | null>();

  const displayAddressEdit = !!editedAddressId;

  const displayAddressList = !displayAddressEdit && !displayAddressCreate;

  const editedAddress = addresses.find(getById(editedAddressId as string));

  const handleSelectCountry = (address?: AddressFragment) => () =>
    setCountryCode(address?.country.code as CountryCode);

  useEffect(handleSelectCountry(selectedAddress), [selectedAddress]);

  useEffect(handleSelectCountry(editedAddress), [editedAddress]);

  useEffect(() => {
    if (!!selectedAddress) {
      onAddressSelect(selectedAddress as unknown as UserAddressFormData);
    }
  }, [selectedAddressId]);

  return (
    <Suspense fallback={<AddressesSkeleton />}>
      <UserAddressSectionContainer
        title={title}
        displayCountrySelect={displayAddressEdit || displayAddressCreate}
      >
        <AddressCreateForm
          show={displayAddressCreate}
          type={type}
          onClose={() => setDisplayAddressCreate(false)}
        />

        <AddressEditForm
          show={displayAddressEdit}
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
              onAddressSelect={setSelectedAddressId}
              selectedAddressId={selectedAddressId}
              onEditChange={(id: string) => setEditedAddressId(id)}
            />
          </>
        )}
      </UserAddressSectionContainer>
    </Suspense>
  );
};
