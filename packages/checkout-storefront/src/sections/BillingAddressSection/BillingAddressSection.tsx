import { Checkbox } from "@/checkout-storefront/components/Checkbox";
import {
  AddressFragment,
  useCheckoutBillingAddressUpdateMutation,
  useUserQuery,
} from "@/checkout-storefront/graphql";
import { useCheckoutUpdateStateTrigger } from "@/checkout-storefront/hooks";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import { useAuthState } from "@saleor/sdk";
import React, { useEffect, useRef, useState } from "react";
import { GuestAddressSection } from "../GuestAddressSection/GuestAddressSection";
import { Address, AddressFormData, UserAddressFormData } from "../../components/AddressForm/types";
import { UserAddressSection } from "../UserAddressSection/UserAddressSection";
import {
  isMatchingAddress,
  getAddressVlidationRulesVariables,
  getAddressInputData,
  getAddressFormDataFromAddress,
} from "@/checkout-storefront/lib/utils";

export const BillingAddressSection = () => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const { checkout } = useCheckout();
  const { billingAddress, shippingAddress, id: checkoutId } = checkout;

  const hasBillingSameAsShipping = isMatchingAddress(shippingAddress, billingAddress);

  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState<boolean>(
    !billingAddress || hasBillingSameAsShipping
  );

  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const user = data?.me;
  const addresses = user?.addresses;
  const errorProps = useErrors<UserAddressFormData>();
  const { setApiErrors } = errorProps;
  const [passDefaultFormDataAddress, setPassDefaultFormDataAddress] = useState<boolean>(
    !!billingAddress
  );

  const { showErrors } = useAlerts();

  const [{ fetching }, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();
  const isBillingSameAsShippingRef = useRef<boolean>(isBillingSameAsShipping);
  const shippingAddressRef = useRef<Address>(shippingAddress);

  useCheckoutUpdateStateTrigger("checkoutBillingUpdate", fetching);

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
    if (!hasBillingSameAsShipping && shippingAddress) {
      await updateBillingAddress({
        ...getAddressFormDataFromAddress(shippingAddress),
        autoSave: true,
      });
    }
  };

  useEffect(() => {
    const billingSetDifferentThanShipping =
      !isBillingSameAsShipping && isBillingSameAsShippingRef.current;

    if (billingSetDifferentThanShipping) {
      setPassDefaultFormDataAddress(false);
      isBillingSameAsShippingRef.current = isBillingSameAsShipping;
    }
  }, [isBillingSameAsShipping]);

  useEffect(() => {
    if (!isBillingSameAsShipping) {
      return;
    }

    const billingSetSameAsShipping = isBillingSameAsShipping && !isBillingSameAsShippingRef.current;

    const hasShippingAddressChanged =
      shippingAddress && shippingAddress !== shippingAddressRef.current;

    if (hasShippingAddressChanged || billingSetSameAsShipping) {
      void setBillingSameAsShipping();
      shippingAddressRef.current = shippingAddress;
      isBillingSameAsShippingRef.current = isBillingSameAsShipping;
      return;
    }
  }, [shippingAddress, isBillingSameAsShipping]);

  return (
    <div className="mt-2">
      <Checkbox
        classNames={{ container: "!mb-0" }}
        value="useShippingAsBilling"
        checked={isBillingSameAsShipping}
        onChange={setIsBillingSameAsShipping}
        label={formatMessage("useShippingAsBilling")}
      />
      {!isBillingSameAsShipping && (
        <div className="mt-4">
          {authUser ? (
            <UserAddressSection
              {...errorProps}
              title={formatMessage("billingAddress")}
              type="BILLING"
              onAddressSelect={(address) => {
                void updateBillingAddress(address);
              }}
              addresses={addresses as AddressFragment[]}
              defaultAddress={user?.defaultBillingAddress}
            />
          ) : (
            <GuestAddressSection
              {...errorProps}
              checkAddressAvailability={false}
              defaultAddress={passDefaultFormDataAddress ? checkout?.billingAddress : undefined}
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
