import { Checkbox } from "@/checkout-storefront/components/Checkbox";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useBillingSameAsShipping } from "@/checkout-storefront/providers/BillingSameAsShippingProvider";
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

  const { updateShippingAddress, shippingErrorProps } = useCheckoutAddressUpdate();

  return (
    <>
      {authUser ? (
        <UserAddressSection
          {...(shippingErrorProps as UseErrors<UserAddressFormData>)}
          title={formatMessage("shippingAddress")}
          type="SHIPPING"
          onAddressSelect={(address) => {
            void updateShippingAddress(address);
          }}
          // @ts-ignore TMP
          addresses={addresses as UserAddressFormData[]}
          defaultAddressId={defaultAddress?.id}
        />
      ) : (
        <GuestAddressSection
          address={checkout?.shippingAddress as AddressFragment}
          title={formatMessage("shippingAddress")}
          onSubmit={(address) => {
            void updateShippingAddress(address);
          }}
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
