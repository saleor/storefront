import { Button } from "@/checkout-storefront/components/Button";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getById } from "@/checkout-storefront/lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React, { Suspense, useState } from "react";
import { UserAddressFormData } from "./types";
import { UserAddressList } from "./UserAddressList";
import { AddressCreateForm } from "./AddressCreateForm";
import { AddressEditForm } from "./AddressEditForm";
import { getAddressFormDataFromAddress } from "./utils";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { Title } from "@/checkout-storefront/components/Title";
import { AddressSectionSkeleton } from "@/checkout-storefront/sections/Addresses/AddressSectionSkeleton";
import { AddressListProvider } from "@/checkout-storefront/sections/Addresses/AddressListProvider";

export interface UserAddressSectionProps extends UseErrors<UserAddressFormData> {
  defaultAddress: AddressFragment | null;
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

  const [displayAddressCreate, setDisplayAddressCreate] = useState(false);

  const [editedAddressId, setEditedAddressId] = useState<string | null>();

  const displayAddressEdit = !!editedAddressId;

  const displayAddressList = !displayAddressEdit && !displayAddressCreate;

  const editedAddress = addresses.find(getById(editedAddressId as string));

  return (
    <Suspense fallback={<AddressSectionSkeleton />}>
      <AddressListProvider
        onCheckoutAddressUpdate={onAddressSelect}
        defaultAddress={defaultAddress}
      >
        {displayAddressCreate && (
          <AddressCreateForm
            title={title}
            type={type}
            onClose={() => setDisplayAddressCreate(false)}
          />
        )}

        {displayAddressEdit && (
          <AddressEditForm
            title={title}
            onClose={() => setEditedAddressId(null)}
            defaultValues={getAddressFormDataFromAddress(editedAddress)}
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
            <UserAddressList onEditChange={(id: string) => setEditedAddressId(id)} />
          </div>
        )}
      </AddressListProvider>
    </Suspense>
  );
};
