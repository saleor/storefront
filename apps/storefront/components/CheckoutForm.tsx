import { formatAsMoney } from "@/lib/util";
import { CheckoutDetailsFragment } from "@/saleor/api";
import React from "react";
import { AddressSection } from "./checkout/AddressSection";
import { EmailSection } from "./checkout/EmailSection";
import { CreditCardSection } from "./checkout/CreditCardSection";
import { AddressType } from "./checkout/AddressForm";
import { DeliveryMethod } from "./checkout/DeliveryMethod";
import { BillingAddressSwitch } from "./checkout/BillingAddressSwitch";

export const CheckoutForm = ({
  checkout,
}: {
  checkout?: CheckoutDetailsFragment;
}) => {
  const totalPrice = checkout?.totalPrice?.gross;

  if (!checkout) {
    return <></>;
  }

  return (
    <section className="bg-gray-50 border-r flex-auto overflow-y-auto px-4 pt-12">
      <div className="max-w-lg mx-auto">
        <div>
          <div className="divide-y">
            <EmailSection checkout={checkout} />
            <CreditCardSection />
            <div>
              <div className="mt-8 mb-4">
                <h2 className="text-lg font-medium text-gray-900 my-4">Shipping Address</h2>
              </div>
              <AddressSection type={AddressType.SHIPPING} address={checkout.shippingAddress} required={checkout.isShippingRequired} />
            </div>

            <DeliveryMethod />

            <BillingAddressSwitch />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            Pay{" "}
            {!!totalPrice
              ? formatAsMoney(totalPrice.amount, totalPrice.currency)
              : ""}
          </button>
        </div>
      </div>
    </section>
  );
};
