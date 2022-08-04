import { Checkbox } from "@/checkout-storefront/components/Checkbox";
import {
  AddressFragment,
  CountryCode,
  useCheckoutBillingAddressUpdateMutation,
  useUserQuery,
} from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useErrors, UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import React, { useEffect, useRef, useState } from "react";
import { GuestAddressSection } from "./GuestAddressSection";
import { AddressFormData, UserAddressFormData } from "./types";
import { UserAddressSection } from "./UserAddressSection";
import { getAddressFormDataFromAddress, getAddressInputData, isMatchingAddress } from "./utils";
import { getAddressVlidationRulesVariables } from "./utils";

export const BillingAddressSection = () => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();
  const { billingAddress, shippingAddress, id: checkoutId } = checkout;

  const hasBillingSameAsShipping =
    !billingAddress || isMatchingAddress(shippingAddress, billingAddress);

  const [useBillingSameAsShipping, setUseBillingSameAsShipping] =
    useState<boolean>(hasBillingSameAsShipping);

  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const user = data?.me;
  const addresses = user?.addresses;
  const defaultBillingAddress = user?.defaultBillingAddress;
  const errorProps = useErrors<AddressFormData>();
  const { setApiErrors } = errorProps;
  const [passDefaultFormDataAddress, setPassDefaultFormDataAddress] = useState<boolean>(
    !!billingAddress
  );

  const defaultAddress = defaultBillingAddress;

  const { showErrors } = useAlerts();

  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();
  const useBillingSameAsShippingRef = useRef<boolean>(useBillingSameAsShipping);
  const shippingAddressRef = useRef<AddressFragment | null | undefined>(shippingAddress);

  const updateBillingAddress = async ({ autoSave, ...addressInput }: AddressFormData) => {
    const result = await checkoutBillingAddressUpdate({
      checkoutId,
      billingAddress: getAddressInputData(addressInput),
      validationRules: getAddressVlidationRulesVariables(autoSave),
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors, "checkoutBillingUpdate");
      setApiErrors(errors);
    }
  };

  const setBillingSameAsShipping = async () => {
    if (!hasBillingSameAsShipping) {
      await updateBillingAddress({
        ...getAddressFormDataFromAddress(shippingAddress),
        autoSave: true,
      } as AddressFormData);
    }
  };

  useEffect(() => {
    const billingSetDifferentThanShipping =
      !useBillingSameAsShipping && useBillingSameAsShippingRef.current;

    if (billingSetDifferentThanShipping) {
      setPassDefaultFormDataAddress(false);
      useBillingSameAsShippingRef.current = useBillingSameAsShipping;
    }
  }, [useBillingSameAsShipping]);

  useEffect(() => {
    const billingSetSameAsShipping =
      useBillingSameAsShipping && !useBillingSameAsShippingRef.current;

    const hasShippingAddressChanged =
      shippingAddress && shippingAddress !== shippingAddressRef.current;

    if (hasShippingAddressChanged && billingSetSameAsShipping) {
      void setBillingSameAsShipping();
      shippingAddressRef.current = shippingAddress;
      useBillingSameAsShippingRef.current = useBillingSameAsShipping;
      return;
    }
  }, [shippingAddress, useBillingSameAsShipping]);

  return (
    <div className="mt-2">
      <Checkbox
        classNames={{ container: "!mb-0" }}
        value="useShippingAsBilling"
        checked={useBillingSameAsShipping}
        onChange={setUseBillingSameAsShipping}
        label={formatMessage("useShippingAsBilling")}
      />
      {!useBillingSameAsShipping && (
        <div className="mt-4">
          {authUser ? (
            <UserAddressSection
              {...(errorProps as UseErrors<UserAddressFormData>)}
              title={formatMessage("billingAddress")}
              type="BILLING"
              onAddressSelect={(address) => {
                void updateBillingAddress(address);
              }}
              addresses={addresses as AddressFragment[]}
              defaultAddress={(checkout?.billingAddress || defaultAddress) as AddressFragment}
            />
          ) : (
            <GuestAddressSection
              {...errorProps}
              selectedCountryCode={checkout?.shippingAddress?.country.code as CountryCode}
              address={
                passDefaultFormDataAddress
                  ? (checkout?.billingAddress as AddressFragment)
                  : undefined
              }
              title={formatMessage("billingAddress")}
              onSubmit={(address) => {
                void updateBillingAddress(address);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
