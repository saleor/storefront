import { useAuthState } from "@saleor/sdk";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { SavedAddressSelectionList } from "@/components";
import { DEFAULT_LOCALE, localeToEnum } from "@/lib/regions";
import { notNullable } from "@/lib/util";
import {
  CheckoutDetailsFragment,
  useCheckoutBillingAddressUpdateMutation,
} from "@/saleor/api";

import { Button } from "../Button";
import AddressDisplay from "./AddressDisplay";
import { AddressForm, AddressFormData } from "./AddressForm";

export interface BillingAddressSection {
  active: boolean;
  checkout: CheckoutDetailsFragment;
}

export const BillingAddressSection = ({
  active,
  checkout,
}: BillingAddressSection) => {
  const router = useRouter();
  const { authenticated } = useAuthState();
  const [editing, setEditing] = useState(!checkout.billingAddress);
  const [checkoutBillingAddressUpdate] =
    useCheckoutBillingAddressUpdateMutation({});

  const locale = router.query.locale?.toString() || DEFAULT_LOCALE;

  const updateMutation = async (formData: AddressFormData) => {
    const { data } = await checkoutBillingAddressUpdate({
      variables: {
        address: {
          ...formData,
        },
        token: checkout.token,
        locale: localeToEnum(locale),
      },
    });
    setEditing(false);
    return data?.checkoutBillingAddressUpdate?.errors.filter(notNullable) || [];
  };

  return (
    <>
      <div className="mt-4 mb-4">
        <h2
          className={
            active
              ? "checkout-section-header-active"
              : "checkout-section-header-disabled"
          }
        >
          Billing Address
        </h2>
      </div>
      {active && (
        <>
          {editing ? (
            <>
              {authenticated && (
                <SavedAddressSelectionList
                  updateAddressMutation={(address: AddressFormData) =>
                    updateMutation(address)
                  }
                />
              )}
              <AddressForm
                existingAddressData={checkout.billingAddress || undefined}
                toggleEdit={() => setEditing(false)}
                updateAddressMutation={updateMutation}
              />
            </>
          ) : (
            <section className="flex justify-between items-center mb-4">
              {!!checkout.billingAddress && (
                <AddressDisplay address={checkout.billingAddress} />
              )}
              <Button onClick={() => setEditing(true)}>Change</Button>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default BillingAddressSection;
