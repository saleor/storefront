import { AddressFragment } from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useBillingSameAsShipping } from "@/providers/BillingSameAsShippingProvider";
import { useCountrySelect } from "@/providers/CountrySelectProvider";
import { useAuthState } from "@saleor/sdk";
import React, { useEffect, useRef } from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import { UserDefaultAddressFragment } from "./types";
import { useCheckoutAddressUpdate } from "./useCheckoutAddressUpdate";
import { UserAddressSection } from "./UserAddressSection";

interface BillingAddressSectionProps {
  addresses?: AddressFragment[] | null;
  defaultBillingAddress: UserDefaultAddressFragment;
}

export const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({
  defaultBillingAddress,
  addresses = [],
}) => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();
  const {
    isBillingSameAsShippingAddress,
    hasBillingSameAsShippingAddressChanged,
    setHasBillingSameAsShippingAddressChanged,
  } = useBillingSameAsShipping();

  const { setCountryCodeFromAddress } = useCountrySelect();

  const { updateBillingAddress } = useCheckoutAddressUpdate();

  const defaultAddress = checkout?.shippingAddress || defaultBillingAddress;

  useEffect(() => {
    if (
      isBillingSameAsShippingAddress ||
      hasBillingSameAsShippingAddressChanged
    ) {
      return;
    }

    setCountryCodeFromAddress(checkout?.shippingAddress);

    setHasBillingSameAsShippingAddressChanged(true);
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
      defaultAddressId={defaultAddress?.id}
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
