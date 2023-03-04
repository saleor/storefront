import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getById } from "@/checkout-storefront/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout-storefront/components/AddressSectionSkeleton";
import { shippingMessages } from "@/checkout-storefront/sections/UserShippingAddressSection/messages";
import { UserAddressSectionContainer } from "@/checkout-storefront/sections/UserAddressSectionContainer";
import { useUserShippingAddressForm } from "@/checkout-storefront/sections/UserShippingAddressSection/useUserShippingAddressForm";
import { AddressCreateForm } from "@/checkout-storefront/sections/AddressCreateForm";
import { AddressEditForm } from "@/checkout-storefront/sections/AddressEditForm";
import { AddressList } from "@/checkout-storefront/sections/AddressList/AddressList";
import React, { Suspense } from "react";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";

interface UserShippingAddressSectionProps {}

export const UserShippingAddressSection: React.FC<UserShippingAddressSectionProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const {
    form,
    userAddressActions: { onAddressCreateSuccess, onAddressDeleteSuccess, onAddressUpdateSuccess },
  } = useUserShippingAddressForm();

  useCheckoutFormValidationTrigger({
    scope: "shippingAddress",
    form: form,
  });

  return (
    <Suspense fallback={<AddressSectionSkeleton />}>
      <UserAddressSectionContainer>
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
                title={formatMessage(shippingMessages.shippingAddress)}
                onClose={() => setDisplayAddressEdit()}
                address={form.values.addressList.find(getById(editedAddressId)) as AddressFragment}
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
      </UserAddressSectionContainer>
    </Suspense>
  );
};
