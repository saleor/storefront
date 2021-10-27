import React, { useState } from "react";

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
  const [editing, setEditing] = useState(!checkout.billingAddress);
  const [checkoutBillingAddressUpdate] =
    useCheckoutBillingAddressUpdateMutation({});

  const updateMutation = async (formData: AddressFormData) => {
    const { data } = await checkoutBillingAddressUpdate({
      variables: {
        address: {
          ...formData,
        },
        token: checkout.token,
      },
    });
    return data?.checkoutBillingAddressUpdate?.errors.filter((e) => !!e) || [];
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
            <AddressForm
              existingAddressData={checkout.billingAddress || undefined}
              toggleEdit={() => setEditing(false)}
              updateAddressMutation={updateMutation}
            />
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
