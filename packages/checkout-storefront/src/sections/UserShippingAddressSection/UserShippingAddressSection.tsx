import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getById } from "@/checkout-storefront/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout-storefront/components/AddressSectionSkeleton";
import { shippingMessages } from "@/checkout-storefront/sections/UserShippingAddressSection/messages";
import { UserAddressSection } from "@/checkout-storefront/sections/UserAddressSection";
import { useUserShippingAddressForm } from "@/checkout-storefront/sections/UserShippingAddressSection/useUserShippingAddressForm";
import { AddressCreateForm } from "@/checkout-storefront/sections/AddressCreateForm";
import { AddressEditForm } from "@/checkout-storefront/sections/AddressEditForm";
import { AddressList } from "@/checkout-storefront/sections/AddressList/AddressList";
import React, { Suspense } from "react";

interface UserShippingAddressSectionProps {}

export const UserShippingAddressSection: React.FC<UserShippingAddressSectionProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const {
    form,
    userAddressActions: { onAddressCreateSuccess, onAddressDeleteSuccess, onAddressUpdateSuccess },
  } = useUserShippingAddressForm();

  return (
    <Suspense fallback={<AddressSectionSkeleton />}>
      <UserAddressSection>
        {({
          displayAddressCreate,
          displayAddressEdit,
          displayAddressList,
          setDisplayAddressCreate,
          setDisplayAddressEdit,
          editedAddressId,
        }) => (
          <>
            {displayAddressCreate && (
              <AddressCreateForm
                onClose={() => setDisplayAddressCreate(false)}
                onSuccess={onAddressCreateSuccess}
              />
            )}

            {displayAddressEdit && (
              <AddressEditForm
                onClose={() => setDisplayAddressEdit()}
                address={form.values.addressList.find(getById(editedAddressId))}
                onUpdate={onAddressUpdateSuccess}
                onDelete={onAddressDeleteSuccess}
              />
            )}

            {displayAddressList && (
              <AddressList
                onEditChange={setDisplayAddressEdit}
                onAddAddressClick={() => setDisplayAddressCreate(true)}
                title={formatMessage(shippingMessages.shippingAddress)}
                checkAddressAvailability={true}
                form={form}
              />
            )}
          </>
        )}
      </UserAddressSection>
    </Suspense>
  );
};
