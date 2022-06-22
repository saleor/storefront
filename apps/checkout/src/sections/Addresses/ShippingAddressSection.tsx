import { Checkbox } from "@/checkout/components/Checkbox";
import { AddressFragment } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { UseErrors } from "@/checkout/hooks/useErrors";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { useBillingSameAsShipping } from "@/checkout/providers/BillingSameAsShippingProvider";
import { useAuthState } from "@saleor/sdk";
import React from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import { UserAddressFormData, UserDefaultAddressFragment } from "./types";
import { useCheckoutAddressUpdate } from "./useCheckoutAddressUpdate";
import { UserAddressSection } from "./UserAddressSection";

export interface ShippingAddressSectionProps {
  addresses?: AddressFragment[] | null;
  defaultShippingAddress: UserDefaultAddressFragment;
}

export const ShippingAddressSection: React.FC<ShippingAddressSectionProps> = ({
  defaultShippingAddress,
  addresses = [],
}) => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();
  const { isBillingSameAsShippingAddress, setIsBillingSameAsShippingAddress } =
    useBillingSameAsShipping();

  const defaultAddress = checkout?.shippingAddress || defaultShippingAddress;

  const { updateShippingAddress, shippingErrorProps } =
    useCheckoutAddressUpdate();

  return (
    <>
      {authUser ? (
        <UserAddressSection
          {...(shippingErrorProps as UseErrors<UserAddressFormData>)}
          title={formatMessage("shippingAddress")}
          type="SHIPPING"
          onAddressSelect={updateShippingAddress}
          // @ts-ignore TMP
          addresses={addresses as UserAddressFormData[]}
          defaultAddressId={defaultAddress?.id}
        />
      ) : (
        <GuestAddressSection
          address={checkout?.shippingAddress as AddressFragment}
          title={formatMessage("shippingAddress")}
          onSubmit={updateShippingAddress}
          {...shippingErrorProps}
        />
      )}
      <Checkbox
        value="useShippingAsBilling"
        checked={isBillingSameAsShippingAddress}
        onChange={setIsBillingSameAsShippingAddress}
        label={formatMessage("useShippingAsBilling")}
      />
    </>
  );
};
