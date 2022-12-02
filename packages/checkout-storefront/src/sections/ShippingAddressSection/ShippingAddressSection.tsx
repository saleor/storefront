import { Divider } from "@/checkout-storefront/components/Divider";
import {
  AddressFragment,
  useCheckoutShippingAddressUpdateMutation,
  useUserQuery,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useErrors, UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { CommonSectionProps } from "@/checkout-storefront/lib/globalTypes";
import { useAuthState } from "@saleor/sdk";
import React from "react";
import { GuestAddressSection } from "../GuestAddressSection/GuestAddressSection";
import { AddressFormData, UserAddressFormData } from "../../components/AddressForm/types";
import { UserAddressSection } from "../UserAddressSection/UserAddressSection";
import {
  getAddressInputData,
  getAddressVlidationRulesVariables,
} from "@/checkout-storefront/lib/utils";
import { shippingMessages } from "./messages";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { omit } from "lodash-es";

export const ShippingAddressSection: React.FC<CommonSectionProps> = ({ collapsed }) => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();
  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const user = data?.me;
  const addresses = user?.addresses;
  const errorProps = useErrors<AddressFormData>();
  const { setApiErrors } = errorProps;

  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const handleSubmit = useSubmit<AddressFormData, typeof checkoutShippingAddressUpdate>({
    scope: "checkoutShippingUpdate",
    onSubmit: checkoutShippingAddressUpdate,
    formDataParse: ({ autoSave, languageCode, checkoutId, ...rest }) => ({
      languageCode,
      checkoutId,
      shippingAddress: getAddressInputData(omit(rest, "channel")),
      validationRules: getAddressVlidationRulesVariables(autoSave),
    }),
    onError: (errors) => setApiErrors(errors),
  });

  if (collapsed) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className="section" data-testid="shippingAddressSection">
        {authUser ? (
          <UserAddressSection
            {...(errorProps as UseErrors<UserAddressFormData>)}
            title={formatMessage(shippingMessages.shippingAddress)}
            type="SHIPPING"
            onAddressSelect={handleSubmit}
            addresses={addresses as AddressFragment[]}
            defaultAddress={user?.defaultShippingAddress}
          />
        ) : (
          <GuestAddressSection
            type="SHIPPING"
            checkAddressAvailability={true}
            defaultAddress={checkout.shippingAddress}
            title={formatMessage(shippingMessages.shippingAddress)}
            onSubmit={handleSubmit}
            {...errorProps}
          />
        )}
      </div>
    </>
  );
};
