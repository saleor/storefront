import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getById } from "@/checkout-storefront/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout-storefront/components/AddressSectionSkeleton";
import { UserAddressSectionContainer } from "@/checkout-storefront/sections/UserAddressSectionContainer";
import { useUserBillingAddressForm } from "@/checkout-storefront/sections/UserBillingAddressSection/useUserBillingAddressForm";
import { AddressCreateForm } from "@/checkout-storefront/sections/AddressCreateForm/AddressCreateForm";
import { AddressEditForm } from "@/checkout-storefront/sections/AddressEditForm/AddressEditForm";
import { AddressList } from "@/checkout-storefront/sections/AddressList/AddressList";
import React, { Suspense } from "react";
import { Checkbox } from "@/checkout-storefront/components";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { useBillingSameAsShippingForm } from "@/checkout-storefront/sections/GuestBillingAddressSection/useBillingSameAsShippingForm";
import { billingMessages } from "@/checkout-storefront/sections/UserBillingAddressSection/messages";
import { OptionalAddress } from "@/checkout-storefront/components/AddressForm/types";
import { getByMatchingAddress } from "@/checkout-storefront/components/AddressForm/utils";
import { AddressFragment } from "@/checkout-storefront/graphql";

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

  const {
    resetForm,
    values: { addressList },
  } = form;

  const handleSetBillingSameAsShipping = (address: OptionalAddress) => {
    const matchingAddress = addressList.find(getByMatchingAddress(address));

    if (!address || !matchingAddress) {
      return;
    }

    resetForm({ values: { selectedAddressId: matchingAddress.id, addressList } });
  };

  const billingSameAsShippingForm = useBillingSameAsShippingForm({
    autoSave: false,
    onSetBillingSameAsShipping: handleSetBillingSameAsShipping,
  });

  useCheckoutFormValidationTrigger({
    scope: "billingAddress",
    form: billingSameAsShippingForm,
  });

  const {
    values: { billingSameAsShipping },
  } = billingSameAsShippingForm;

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
      {!billingSameAsShipping && (
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
                  title={formatMessage(billingMessages.billingAddress)}
                  onClose={() => setDisplayAddressEdit()}
                  address={
                    form.values.addressList.find(getById(editedAddressId)) as AddressFragment
                  }
                  onUpdate={onAddressUpdateSuccess}
                  onDelete={onAddressDeleteSuccess}
                />
              )}

              {displayAddressList && (
                <AddressList
                  onEditChange={setDisplayAddressEdit}
                  onAddAddressClick={() => setDisplayAddressCreate(true)}
                  title={formatMessage(billingMessages.billingAddress)}
                  form={form}
                />
              )}
            </>
          )}
        </UserAddressSectionContainer>
      )}
    </Suspense>
  );
};
