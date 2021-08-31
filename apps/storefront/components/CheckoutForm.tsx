import { formatAsMoney } from "@/lib/util";
import { CheckoutDetailsFragment } from "@/saleor/api";
import React from "react";
import { AddressSection } from "./checkout/AddressSection";
import { EmailSection } from "./checkout/EmailSection";
import { CreditCardSection } from "./checkout/CreditCardSection";

export const CheckoutForm = ({
  checkout,
}: {
  checkout?: CheckoutDetailsFragment;
}) => {
  const totalPrice = checkout?.totalPrice?.gross;
  return (
    <section className="bg-gray-50 border-r flex-auto overflow-y-auto px-4 pt-12">
      <div className="max-w-lg mx-auto">
        <div className="mt-6">
          <div className="">
            <EmailSection checkout={checkout} />
            <AddressSection checkout={checkout} />
            <CreditCardSection/>
          </div>

          <div className="mt-6 flex space-x-2">
            <div className="flex items-center h-5">
              <input
                id="same-as-shipping"
                name="same-as-shipping"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 border-gray-300 rounded text-indigo-600"
              />
            </div>
            <label
              htmlFor="same-as-shipping"
              className="text-sm font-medium text-gray-900"
            >
              Billing address is the same as shipping address
            </label>
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
