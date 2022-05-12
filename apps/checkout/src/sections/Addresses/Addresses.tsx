import { useUserQuery } from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { useAuthState } from "@saleor/sdk";
import React, { useState } from "react";
import { BillingAddressSection } from "./BillingAddressSection";
import { ShippingAddressSection } from "./ShippingAddressSection";

export const Addresses: React.FC = () => {
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();

  const [useShippingAsBillingAddress, setUseShippingAsBillingAddress] =
    useState(!checkout?.billingAddress);

  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const user = data?.me;
  const userAddresses = user?.addresses;

  return (
    <div>
      {checkout.isShippingRequired && (
        <ShippingAddressSection
          addresses={userAddresses}
          defaultShippingAddress={user?.defaultShippingAddress}
          useShippingAsBillingAddress={useShippingAsBillingAddress}
          setUseShippingAsBillingAddress={setUseShippingAsBillingAddress}
        />
      )}
      <BillingAddressSection
        addresses={userAddresses}
        defaultBillingAddress={user?.defaultBillingAddress}
        useShippingAsBillingAddress={useShippingAsBillingAddress}
      />
    </div>
  );
};
