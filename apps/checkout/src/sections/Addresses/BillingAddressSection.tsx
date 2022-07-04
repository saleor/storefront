import { AddressFragment } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { UseErrors } from "@/checkout/hooks/useErrors";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { useBillingSameAsShipping } from "@/checkout/providers/BillingSameAsShippingProvider";
import { useCountrySelect } from "@/checkout/providers/CountrySelectProvider";
import { useAuthState } from "@saleor/sdk";
import React, { useEffect, useRef } from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import {
  AddressFormData,
  UserAddressFormData,
  UserDefaultAddressFragment,
} from "./types";
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

  const { updateBillingAddress, billingErrorProps } =
    useCheckoutAddressUpdate();

  const defaultAddress = checkout?.shippingAddress || defaultBillingAddress;

  useEffect(() => {
    if (
      !checkout?.shippingAddress ||
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
      {...(billingErrorProps as UseErrors<UserAddressFormData>)}
      title={formatMessage("billingAddress")}
      type="BILLING"
      onAddressSelect={(address) => {
        void updateBillingAddress(address);
      }}
      addresses={addresses as AddressFragment[]}
      defaultAddressId={defaultAddress?.id}
    />
  ) : (
    <GuestAddressSection
      {...billingErrorProps}
      address={checkout?.billingAddress as AddressFragment}
      title={formatMessage("billingAddress")}
      onSubmit={(address) => {
        void updateBillingAddress(address);
      }}
    />
  );
};
