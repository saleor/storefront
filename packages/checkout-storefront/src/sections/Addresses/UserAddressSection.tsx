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
import { Title } from "@/checkout-storefront/components/Title";
import { AddressSectionSkeleton } from "@/checkout-storefront/sections/Addresses/AddressSectionSkeleton";

export interface UserAddressSectionProps
  extends UseUserAddressSelectProps,
    UseErrors<UserAddressFormData> {
  onAddressSelect: (address: UserAddressFormData) => void;
  addresses: AddressFragment[];
  title: string;
  type: AddressTypeEnum;
  updating: boolean;
}

export const UserAddressSection: React.FC<UserAddressSectionProps> = ({
  defaultAddress,
  addresses = [],
  onAddressSelect,
  updating,
  title,
  type,
}) => {
  const formatMessage = useFormattedMessages();

  const { selectedAddressId, setSelectedAddressId } = useUserAddressSelect({
    defaultAddress,
    addresses,
    onAddressSelect,
  });

  const [displayAddressCreate, setDisplayAddressCreate] = useState(false);

  const [editedAddressId, setEditedAddressId] = useState<string | null>();

  const displayAddressEdit = !!editedAddressId;

  const displayAddressList = !displayAddressEdit && !displayAddressCreate;

  const editedAddress = addresses.find(getById(editedAddressId as string));

  const handleCreateEditSucess = (address: AddressFragment) => {
    void onAddressSelect(getAddressFormDataFromAddress(address) as UserAddressFormData);
  };

  return (
    <Suspense fallback={<AddressSectionSkeleton />}>
      {displayAddressCreate && (
        <AddressCreateForm
          title={title}
          onSuccess={handleCreateEditSucess}
          type={type}
          onClose={() => setDisplayAddressCreate(false)}
        />
      )}

      {displayAddressEdit && (
        <AddressEditForm
          title={title}
          onClose={() => setEditedAddressId(null)}
          defaultValues={getAddressFormDataFromAddress(editedAddress)}
          onSuccess={handleCreateEditSucess}
        />
      )}

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
            loading={updating}
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
