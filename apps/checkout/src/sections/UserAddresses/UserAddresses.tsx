import { Checkbox } from "@/components/Checkbox";
import {
  AddressFragment,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutShippingAddressUpdateMutation,
  useUserQuery,
} from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { getDataWithToken } from "@/lib/utils";
import { useAuthState } from "@saleor/sdk";
import React, { useState } from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import { AddressFormData, UserAddressFormData } from "./types";
import { UserAddressSection } from "./UserAddressSection";
import { getAddressInputData } from "./utils";

interface UserAddressesProps {}

export const UserAddresses: React.FC<UserAddressesProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();
  const [useShippingAsBillingAddress, setUseShippingAsBillingAddressSelected] =
    useState(true);

  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
    variables: { id: authUser?.id as string },
  });
  const user = data?.user;
  const addresses = user?.addresses;

  const [, checkoutShippingAddressUpdate] =
    useCheckoutShippingAddressUpdateMutation();

  const handleShippingUpdate = (address: AddressFormData) => {
    checkoutShippingAddressUpdate(
      getDataWithToken({ shippingAddress: getAddressInputData(address) })
    );
  };

  const [, checkoutBillingAddressUpdate] =
    useCheckoutBillingAddressUpdateMutation();

  const handleBillingUpdate = (address: AddressFormData) =>
    checkoutBillingAddressUpdate(
      getDataWithToken({ billingAddress: getAddressInputData(address) })
    );

  return (
    <div>
      {authUser ? (
        <UserAddressSection
          title={formatMessage("shippingAddress")}
          type="SHIPPING"
          onAddressSelect={handleShippingUpdate}
          // @ts-ignore TMP
          addresses={addresses as UserAddressFormData[]}
          defaultAddress={user?.defaultShippingAddress}
        />
      ) : (
        <GuestAddressSection
          // @ts-ignore TMP
          address={checkout?.shippingAddress as AddressFormData}
          title={formatMessage("shippingAddress")}
          onSubmit={handleShippingUpdate}
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
            onAddressSelect={handleBillingUpdate}
            // @ts-ignore TMP
            addresses={addresses as AddressFragment[]}
            defaultAddress={user?.defaultBillingAddress}
          />
        ) : (
          <GuestAddressSection
            title={formatMessage("billingAddress")}
            onSubmit={handleBillingUpdate}
            // @ts-ignore TMP
            address={checkout?.billingAddress as AddressFormData}
          />
        ))}
    </div>
  );
};
