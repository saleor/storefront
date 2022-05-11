import { Checkbox } from "@/components/Checkbox";
import { AddressFragment, useUserQuery } from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import React, { useState } from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import { UserAddressFormData } from "./types";
import { useCheckoutAddressUpdate } from "./useCheckoutAddressUpdate";
import { UserAddressSection } from "./UserAddressSection";

export const UserAddresses: React.FC = () => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();

  const [useShippingAsBillingAddress, setUseShippingAsBillingAddressSelected] =
    useState(!checkout?.billingAddress);

  const { updateShippingAddress, updateBillingAddress } =
    useCheckoutAddressUpdate({ useShippingAsBillingAddress });

  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const user = data?.me;
  const addresses = user?.addresses;

  const defaultShippingAddress =
    checkout?.shippingAddress || user?.defaultShippingAddress;
  const defaultBillingAddress =
    checkout?.billingAddress || user?.defaultBillingAddress;

  return (
    <div>
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
          errorScope="checkoutShippingUpdate"
        />
      )}
      <Checkbox
        value="useShippingAsBilling"
        checked={useShippingAsBillingAddress}
        onChange={setUseShippingAsBillingAddressSelected}
        label={formatMessage("useShippingAsBilling")}
      />
      {!useShippingAsBillingAddress &&
        (authUser ? (
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
            errorScope="checkoutBillingUpdate"
          />
        ))}
    </div>
  );
};
