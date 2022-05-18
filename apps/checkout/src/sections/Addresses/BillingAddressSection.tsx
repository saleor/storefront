import { AddressFragment } from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useCountrySelect } from "@/providers/CountrySelectProvider";
import { useAuthState } from "@saleor/sdk";
import React, { useEffect, useRef } from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import {
  BillingSameAsShippingAddressProps,
  UserDefaultAddressFragment,
} from "./types";
import { useCheckoutAddressUpdate } from "./useCheckoutAddressUpdate";
import { UserAddressSection } from "./UserAddressSection";

interface BillingAddressSectionProps extends BillingSameAsShippingAddressProps {
  addresses?: AddressFragment[] | null;
  defaultBillingAddress: UserDefaultAddressFragment;
}

export const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({
  isBillingSameAsShippingAddress,
  defaultBillingAddress,
  addresses = [],
}) => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();
  const hasIsBillingSameAsShippingAddressChanged = useRef(false);

  const { setCountryCodeFromAddress } = useCountrySelect();

  const { updateBillingAddress } = useCheckoutAddressUpdate({
    isBillingSameAsShippingAddress,
  });

  const defaultAddress = checkout?.shippingAddress || defaultBillingAddress;

  useEffect(() => {
    if (
      isBillingSameAsShippingAddress ||
      hasIsBillingSameAsShippingAddressChanged.current
    ) {
      return;
    }

    setCountryCodeFromAddress(checkout?.shippingAddress);

    hasIsBillingSameAsShippingAddressChanged.current = true;
  }, [isBillingSameAsShippingAddress]);

  if (checkout?.isShippingRequired && isBillingSameAsShippingAddress) {
    return null;
  }

  return authUser ? (
    <UserAddressSection
      title={formatMessage("billingAddress")}
      type="BILLING"
      onAddressSelect={updateBillingAddress}
      addresses={addresses as AddressFragment[]}
      defaultAddress={defaultAddress}
    />
  ) : (
    <GuestAddressSection
      address={checkout?.billingAddress as AddressFragment}
      title={formatMessage("billingAddress")}
      onSubmit={updateBillingAddress}
      errorScope="checkoutBillingUpdate"
    />
  );
};
