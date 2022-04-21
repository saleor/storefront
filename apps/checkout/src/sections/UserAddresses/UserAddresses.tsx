import { Checkbox } from "@/components/Checkbox";
import { AddressFragment, useUserQuery } from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { ErrorsProvider } from "@/providers/ErrorsProvider";
import { useAuthState } from "@saleor/sdk";
import React, { useState } from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import { UserAddressFormData } from "./types";
import { useCheckoutAddressUpdate } from "./useCheckoutAddressUpdate";
import { UserAddressSection } from "./UserAddressSection";

interface UserAddressesProps {}

export const UserAddresses: React.FC<UserAddressesProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();

  const [useShippingAsBillingAddress, setUseShippingAsBillingAddressSelected] =
    useState(!checkout?.billingAddress);

  const {
    shippingAddressUpdateErrors,
    billingAddressUpdateErrors,
    updateShippingAddress,
    updateBillingAddress,
  } = useCheckoutAddressUpdate({ useShippingAsBillingAddress });

  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
    variables: { id: authUser?.id as string },
  });
  const user = data?.user;
  const addresses = user?.addresses;

  const defaultShippingAddress =
    checkout?.shippingAddress || user?.defaultShippingAddress;
  const defaultBillingAddress =
    checkout?.billingAddress || user?.defaultBillingAddress;

  return (
    <div>
      <ErrorsProvider apiErrors={shippingAddressUpdateErrors}>
        {authUser ? (
          <UserAddressSection
            title={formatMessage("shippingAddress")}
            type="SHIPPING"
            onAddressSelect={updateShippingAddress}
            // @ts-ignore TMP
            addresses={addresses as UserAddressFormData[]}
            defaultAddress={defaultShippingAddress}
          />
        ) : (
          <GuestAddressSection
            address={checkout?.shippingAddress as AddressFragment}
            title={formatMessage("shippingAddress")}
            onSubmit={updateShippingAddress}
          />
        )}
      </ErrorsProvider>
      <Checkbox
        value="useShippingAsBilling"
        checked={useShippingAsBillingAddress}
        onChange={setUseShippingAsBillingAddressSelected}
        label={formatMessage("useShippingAsBilling")}
      />
      {!useShippingAsBillingAddress && (
        <ErrorsProvider apiErrors={billingAddressUpdateErrors}>
          {authUser ? (
            <UserAddressSection
              title={formatMessage("billingAddress")}
              type="BILLING"
              onAddressSelect={updateBillingAddress}
              addresses={addresses as AddressFragment[]}
              defaultAddress={defaultBillingAddress}
            />
          ) : (
            <GuestAddressSection
              address={checkout?.billingAddress as AddressFragment}
              title={formatMessage("billingAddress")}
              onSubmit={updateBillingAddress}
            />
          )}
        </ErrorsProvider>
      )}
    </div>
  );
};
