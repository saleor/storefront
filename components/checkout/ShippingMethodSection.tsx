import { RadioGroup } from "@headlessui/react";
import React, { useState } from "react";

import {
  CheckoutDetailsFragment,
  useCheckoutShippingMethodUpdateMutation,
} from "@/saleor/api";

import { Button } from "../Button";
import ShippingMethodDisplay from "./ShippingMethodDisplay";
import { ShippingMethodOption } from "./ShippingMethodOption";
import { notNullable } from "@/lib/util";

export interface ShippingMethodSectionProps {
  checkout: CheckoutDetailsFragment;
  active: boolean;
}

export const ShippingMethodSection = ({
  checkout,
  active,
}: ShippingMethodSectionProps) => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    checkout.shippingMethod
  );
  const [editing, setEditing] = useState(!checkout.shippingMethod);

  const [checkoutShippingMethodUpdate] =
    useCheckoutShippingMethodUpdateMutation({});

  const handleChange = async (method: any) => {
    const { data } = await checkoutShippingMethodUpdate({
      variables: {
        token: checkout.token,
        shippingMethodId: method.id,
      },
    });
    if (!!data?.checkoutShippingMethodUpdate?.errors.length) {
      // todo: handle errors
      console.error(data?.checkoutShippingMethodUpdate?.errors);
      return;
    }
    setSelectedDeliveryMethod(method);
    setEditing(false);
  };

  const availableShippingMethods =
    checkout.availableShippingMethods.filter(notNullable) || [];

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
          Shipping Method
        </h2>
      </div>
      {active && (
        <>
          {editing ? (
            <>
              <RadioGroup
                value={selectedDeliveryMethod}
                onChange={handleChange}
                className="py-8"
              >
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {availableShippingMethods.map((method) => {
                    if (!!method)
                      // todo: Investigate why filter did not excluded non existing methods
                      return (
                        <ShippingMethodOption method={method} key={method.id} />
                      );
                  })}
                </div>
              </RadioGroup>
            </>
          ) : (
            <section className="flex justify-between items-center mb-4">
              {!!checkout.shippingMethod && (
                <ShippingMethodDisplay method={checkout.shippingMethod} />
              )}
              <div className="flex justify-between items-center">
                <Button onClick={() => setEditing(true)}>Change</Button>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};
