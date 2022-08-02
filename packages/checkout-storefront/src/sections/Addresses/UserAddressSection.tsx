import { Button } from "@/checkout-storefront/components/Button";
import { AddressFragment, CountryCode } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getById } from "@/checkout-storefront/lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React, { Suspense, useState } from "react";
import { UserAddressFormData } from "./types";
import { UserAddressList } from "./UserAddressList";
import { AddressCreateForm } from "./AddressCreateForm";
import { AddressEditForm } from "./AddressEditForm";
import { getAddressFormDataFromAddress } from "./utils";
import { useUserAddressSelect, UseUserAddressSelectProps } from "./useUserAddressSelect";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { AddressesSkeleton } from "../Skeletons/AddressesSkeleton";
import { useCountrySelect } from "@/checkout-storefront/hooks/useErrors/useCountrySelect";
import { Title } from "@/checkout-storefront/components/Title";

export interface UserAddressSectionProps
  extends UseUserAddressSelectProps,
    UseErrors<UserAddressFormData> {
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

  const { selectedAddress, selectedAddressId, setSelectedAddressId } = useUserAddressSelect({
    type,
    defaultAddressId,
    addresses,
    onAddressSelect,
  });

  const [displayAddressCreate, setDisplayAddressCreate] = useState(false);

  const [editedAddressId, setEditedAddressId] = useState<string | null>();

  const displayAddressEdit = !!editedAddressId;

  const displayAddressList = !displayAddressEdit && !displayAddressCreate;

  const editedAddress = addresses.find(getById(editedAddressId as string));

  const countrySelectProps = useCountrySelect({
    autoSelect:
      displayAddressCreate ||
      (displayAddressEdit && !getAddressFormDataFromAddress(editedAddress)?.countryCode),
    selectedCountryCode: displayAddressEdit
      ? (selectedAddress?.country.code as CountryCode)
      : undefined,
  });

  return (
    <Suspense fallback={<AddressesSkeleton />}>
      <AddressCreateForm
        title={title}
        show={displayAddressCreate}
        type={type}
        onClose={() => setDisplayAddressCreate(false)}
        {...countrySelectProps}
      />

      <AddressEditForm
        title={title}
        show={displayAddressEdit}
        onClose={() => setEditedAddressId(null)}
        defaultValues={getAddressFormDataFromAddress(editedAddress)}
        onSuccess={setSelectedAddressId}
        {...countrySelectProps}
      />

      {displayAddressList && (
        <div className="flex flex-col">
          <Title>{title}</Title>
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
        </div>
      )}
    </Suspense>
  );
};
