import React from "react";

import { CheckoutPriceEntry } from "@/components";
import { formatAsMoney } from "@/lib/util";
import Link from "next/link";

export const CheckoutSummary = ({ checkout }: { checkout: any }) => {
  const { subtotalPrice, shippingPrice, totalPrice } = checkout || {};

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-6">
      <form>
        <label
          htmlFor="discount-code"
          className="block text-sm font-medium text-gray-700"
        >
          Discount code
        </label>
        <div className="flex space-x-4 mt-1">
          <input
            type="text"
            id="discount-code"
            className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
          <button
            type="submit"
            className="bg-gray-200 text-sm font-medium text-gray-600 rounded-md px-4 hover:bg-gray-300"
          >
            Apply
          </button>
        </div>
      </form>

      <dl className="text-gray-500 mt-8 space-y-4">
        <CheckoutPriceEntry
          label="Subtotal"
          value={formatAsMoney(subtotalPrice?.net.amount)}
        />

        {/* <div className="flex justify-between">
          <dt className="flex">
            Discount
            <span className="ml-2 rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 tracking-wide">
              {discount.code}
            </span>
          </dt>
          <dd className="text-gray-900">-{discount.amount}</dd>
        </div> */}

        <CheckoutPriceEntry
          label="Taxes"
          value={formatAsMoney(subtotalPrice?.tax.amount)}
        />
        <CheckoutPriceEntry
          label="Shipping"
          value={formatAsMoney(shippingPrice?.gross.amount)}
        />
        <CheckoutPriceEntry
          label="Total"
          value={formatAsMoney(totalPrice?.gross.amount)}
        />
      </dl>
    </div>
  );
};
