import { Button } from "@/checkout-storefront/components/Button";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getById, getUserAddressFormDataFromAddress } from "@/checkout-storefront/lib/utils";
import { AddressTypeEnum } from "@saleor/sdk/dist/apollo/types";
import React, { Suspense, useState } from "react";
import { Address, UserAddressFormData } from "../../components/AddressForm/types";
import { UserAddressList } from "./UserAddressList";
import { AddressCreateForm } from "./AddressCreateForm";
import { AddressEditForm } from "./AddressEditForm";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { Title } from "@/checkout-storefront/components/Title";
import { AddressSectionSkeleton } from "@/checkout-storefront/sections/ShippingAddressSection/AddressSectionSkeleton";
import { AddressListProvider } from "@/checkout-storefront/sections/UserAddressSection/AddressListProvider";
import { useCheckout } from "@/checkout-storefront/hooks";

export interface UserAddressSectionProps extends UseErrors<UserAddressFormData> {
  defaultAddress: Address;
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
  const { checkout } = useCheckout();
  const formatMessage = useFormattedMessages();

  const [displayAddressCreate, setDisplayAddressCreate] = useState(false);

  const [editedAddressId, setEditedAddressId] = useState<string | null>();

  const displayAddressEdit = !!editedAddressId;

  const displayAddressList = !displayAddressEdit && !displayAddressCreate;

  const editedAddress = addresses.find(getById(editedAddressId as string)) as AddressFragment;

  return (
    <Suspense fallback={<AddressSectionSkeleton />}>
      <AddressListProvider
        checkoutAddress={type === "SHIPPING" ? checkout?.shippingAddress : checkout?.billingAddress}
        onCheckoutAddressUpdate={onAddressSelect}
        defaultAddress={defaultAddress}
        checkAddressAvailability={type === "SHIPPING"}
      >
        {displayAddressCreate && (
          <AddressCreateForm title={title} onClose={() => setDisplayAddressCreate(false)} />
        )}

        {displayAddressEdit && (
          <AddressEditForm
            title={title}
            onClose={() => setEditedAddressId(null)}
            defaultValues={getUserAddressFormDataFromAddress(editedAddress)}
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
            <UserAddressList type={type} onEditChange={(id: string) => setEditedAddressId(id)} />
          </div>
        )}
      </AddressListProvider>
    </Suspense>
  );
};
