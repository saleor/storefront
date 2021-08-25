import React from "react";

import { formatAsMoney } from "../lib/utils";

export const CheckoutSummary = ({ checkout }: { checkout: any }) => {
  const { subtotalPrice, shippingPrice, totalPrice } = checkout || {};

  return (
    <section>
      <div className="bg-gray-50 rounded p-8 border">
        <div className="flow-root">
          <dl className="-my-4 text-sm">
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="font-medium text-gray-900">
                {formatAsMoney(subtotalPrice?.net.amount)}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="font-medium text-gray-900">
                {formatAsMoney(shippingPrice?.gross.amount)}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Tax</dt>
              <dd className="font-medium text-gray-900">
                {formatAsMoney(subtotalPrice?.tax.amount)}
              </dd>
            </div>
            <div className="py-4 flex items-center justify-between border-t border-gray-300">
              <dt className="text-lg font-bold text-gray-900">Total</dt>
              <dd className="text-lg text-gray-900">
                {formatAsMoney(totalPrice?.gross.amount)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-12">
        <button
          type="submit"
          className="w-full bg-blue-500 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
        >
          Checkout
        </button>
      </div>
    </section>
  );
};
