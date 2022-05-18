import { CountryCode, useUserQuery } from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { CountrySelectProvider } from "@/providers/CountrySelectProvider";
import { useAuthState } from "@saleor/sdk";
import React, { useState } from "react";
import { BillingAddressSection } from "./BillingAddressSection";
import { ShippingAddressSection } from "./ShippingAddressSection";
import { BillingSameAsShippingAddressProps } from "./types";

export const Addresses: React.FC = () => {
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();

  const [isBillingSameAsShippingAddress, setIsBillingSameAsShippingAddress] =
    useState(!checkout?.billingAddress);

  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const user = data?.me;
  const userAddresses = user?.addresses;

  const billingSameAsShippingProps: BillingSameAsShippingAddressProps = {
    isBillingSameAsShippingAddress,
    setIsBillingSameAsShippingAddress,
  };

  return (
    <div>
      {checkout.isShippingRequired && (
        <CountrySelectProvider
          selectedCountryCode={
            checkout?.shippingAddress?.country?.code as CountryCode
          }
        >
          <ShippingAddressSection
            {...billingSameAsShippingProps}
            addresses={userAddresses}
            defaultShippingAddress={user?.defaultShippingAddress}
          />
        </CountrySelectProvider>
      )}
      <CountrySelectProvider
        selectedCountryCode={
          checkout?.billingAddress?.country?.code as CountryCode
        }
      >
        <BillingAddressSection
          {...billingSameAsShippingProps}
          addresses={userAddresses}
          defaultBillingAddress={user?.defaultBillingAddress}
        />
      </CountrySelectProvider>
    </div>
  );
};
