import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getById } from "@/checkout-storefront/lib/utils";
import { AddressSectionSkeleton } from "@/checkout-storefront/components/AddressSectionSkeleton";
import { UserAddressSection } from "@/checkout-storefront/sections/UserAddressSection";
import { useUserBillingAddressForm } from "@/checkout-storefront/sections/UserBillingAddressSection/useUserBillingAddressForm";
import { AddressCreateForm } from "@/checkout-storefront/sections/AddressCreateForm/AddressCreateForm";
import { AddressEditForm } from "@/checkout-storefront/sections/AddressEditForm/AddressEditForm";
import { AddressList } from "@/checkout-storefront/sections/AddressList/AddressList";
import React, { Suspense } from "react";
import { billingMessages } from "@/checkout-storefront/sections/BillingAddressSection/messages";
import { Checkbox } from "@/checkout-storefront/components";
import { useCheckout } from "@/checkout-storefront/hooks";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { useBillingSameAsShippingForm } from "@/checkout-storefront/hooks/useBillingSameAsShippingForm";

interface UserBillingAddressSectionProps {}

export const UserBillingAddressSection: React.FC<UserBillingAddressSectionProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const {
    checkout: { isShippingRequired },
  } = useCheckout();

  const {
    form,
    userAddressActions: { onAddressCreateSuccess, onAddressDeleteSuccess, onAddressUpdateSuccess },
  } = useUserBillingAddressForm();

  const billingSameAsShippingForm = useBillingSameAsShippingForm();

  return (
    <Suspense fallback={<AddressSectionSkeleton />}>
      {isShippingRequired && (
        <FormProvider form={billingSameAsShippingForm}>
          <Checkbox
            classNames={{ container: "!mb-0" }}
            name="billingSameAsShipping"
            label={formatMessage(billingMessages.useShippingAsBilling)}
            data-testid={"useShippingAsBillingCheckbox"}
          />
        </FormProvider>
      )}
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
                title={formatMessage(billingMessages.billingAddress)}
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
