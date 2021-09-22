import { CheckoutDetailsFragment } from "@/saleor/api";
import React, { useState } from "react";
import { AddressSection } from "./checkout/AddressSection";
import { EmailSection } from "./checkout/EmailSection";
import { StripeCreditCardSection } from "./checkout/stripe/StripeCreditCardSection";
import { AddressType } from "./checkout/AddressForm";
import { DeliveryMethod } from "./checkout/DeliveryMethod";
import { BillingAddressSwitch } from "./checkout/BillingAddressSwitch";

export const CheckoutForm = ({
  checkout,
}: {
  checkout?: CheckoutDetailsFragment;
}) => {
  if (!checkout) {
    return <></>;
  }

  return (
    <section className="bg-gray-50 border-r flex-auto overflow-y-auto px-4 pt-12">
      <div className="max-w-lg mx-auto">
        <div>
          <div className="divide-y">
            <EmailSection checkout={checkout} />
            <div>
              <div className="mt-8 mb-4">
                <h2 className="text-lg font-medium text-gray-900 my-4">
                  Shipping Address
                </h2>
              </div>
              <AddressSection
                type={AddressType.SHIPPING}
                address={checkout.shippingAddress}
                required={checkout.isShippingRequired}
              />
            </div>

            <div className="mt-8 mb-4">
              <h2 className="text-lg font-medium text-gray-900 my-4">
                Delivery Method
              </h2>
            </div>
            {checkout.availableShippingMethods?.length > 0 && (
              <DeliveryMethod
                collection={checkout.availableShippingMethods}
                checkoutDeliveryMethod={checkout.shippingMethod || undefined}
              />
            )}

            <BillingAddressSwitch />
          </div>

          <StripeCreditCardSection checkout={checkout} />
        </div>
      </div>
    </section>
  );
};
