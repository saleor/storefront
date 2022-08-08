import { Divider } from "@/checkout-storefront/components/Divider";
import {
  AddressFragment,
  useCheckoutShippingAddressUpdateMutation,
  useUserQuery,
} from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useErrors, UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { CommonSectionProps } from "@/checkout-storefront/lib/globalTypes";
import { extractMutationErrors, getQueryVariables } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import React, { useEffect } from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import { AddressFormData, UserAddressFormData } from "./types";
import { UserAddressSection } from "./UserAddressSection";
import { getAddressInputData, getAddressVlidationRulesVariables } from "./utils";

export const ShippingAddressSection: React.FC<CommonSectionProps> = ({ collapsed }) => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();
  const shippingAddress = checkout?.shippingAddress;
  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const user = data?.me;
  const addresses = user?.addresses;
  const defaultShippingAddress = user?.defaultShippingAddress;
  const { showErrors } = useAlerts();
  const errorProps = useErrors<AddressFormData>();
  const { setApiErrors } = errorProps;

  const defaultAddress = checkout?.shippingAddress || defaultShippingAddress;

  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const updateShippingAddress = async ({ autoSave, ...address }: Partial<AddressFormData>) => {
    const result = await checkoutShippingAddressUpdate({
      checkoutId: checkout.id,
      shippingAddress: getAddressInputData(address),
      validationRules: getAddressVlidationRulesVariables(autoSave),
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors, "checkoutShippingUpdate");
      setApiErrors(errors);
    }
  };

  useEffect(() => {
    if (!shippingAddress) {
      void updateShippingAddress({ autoSave: true, countryCode: getQueryVariables().countryCode });
    }
  }, [shippingAddress]);

  if (collapsed) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className="section">
        {authUser ? (
          <UserAddressSection
            {...(errorProps as UseErrors<UserAddressFormData>)}
            title={formatMessage("shippingAddress")}
            type="SHIPPING"
            onAddressSelect={(formData: AddressFormData) => {
              void updateShippingAddress(formData);
            }}
            addresses={addresses as AddressFragment[]}
            defaultAddress={(checkout?.shippingAddress || defaultAddress) as AddressFragment}
          />
        ) : (
          <GuestAddressSection
            checkAddressAvailability={true}
            address={checkout?.shippingAddress as AddressFragment}
            title={formatMessage("shippingAddress")}
            onSubmit={(address) => {
              void updateShippingAddress(address);
            }}
            {...errorProps}
          />
        )}
      </div>
    </>
  );
};
