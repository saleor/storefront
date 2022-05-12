import { AddressFragment } from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import React from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import { UserDefaultAddressFragment } from "./types";
import { useCheckoutAddressUpdate } from "./useCheckoutAddressUpdate";
import { UserAddressSection } from "./UserAddressSection";

interface BillingAddressSectionProps {
  addresses?: AddressFragment[] | null;
  useShippingAsBillingAddress: boolean;
  defaultBillingAddress: UserDefaultAddressFragment;
}

export const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({
  useShippingAsBillingAddress,
  defaultBillingAddress,
  addresses = [],
}) => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();

  const { updateBillingAddress } = useCheckoutAddressUpdate({
    useShippingAsBillingAddress,
  });

  const defaultAddress = checkout?.shippingAddress || defaultBillingAddress;

  if (checkout?.isShippingRequired && useShippingAsBillingAddress) {
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
