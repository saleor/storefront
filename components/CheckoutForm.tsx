import { formatAsMoney } from "@/lib/util";
import { CheckoutDetailsFragment } from "@/saleor/api";
import React from "react";
import { AddressSection } from "./checkout/AddressSection";
import { EmailSection } from "./checkout/EmailSection";

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
          <div className="grid grid-cols-12 gap-4">
            <EmailSection checkout={checkout} />

            <hr />

            <AddressSection checkout={checkout} />

            <hr />

            <div className="col-span-full">
              <label
                htmlFor="name-on-card"
                className="block text-sm font-medium text-gray-700"
              >
                Name on card
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name-on-card"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="card-number"
                className="block text-sm font-medium text-gray-700"
              >
                Card number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="card-number"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-8 sm:col-span-9">
              <label
                htmlFor="expiration-date"
                className="block text-sm font-medium text-gray-700"
              >
                Expiration date (MM/YY)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="expiration-date"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-4 sm:col-span-3">
              <label
                htmlFor="cvc"
                className="block text-sm font-medium text-gray-700"
              >
                CVC
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="cvc"
                  className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
            </div>
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
