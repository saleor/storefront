import React from "react";
import Link from "next/link";

export const CartSummary = ({ checkout }: { checkout: any }) => {
  const { subtotalPrice, shippingPrice, totalPrice } = checkout || {};

  return (
    <section>
      <div className="bg-gray-50 rounded p-8 border">
        <div className="flow-root">
          <dl className="-my-4 text-sm">
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="font-medium text-gray-900">
                {subtotalPrice?.net.localizedAmount}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="font-medium text-gray-900">
                {shippingPrice?.gross.localizedAmount}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Tax</dt>
              <dd className="font-medium text-gray-900">
                {subtotalPrice?.tax.localizedAmount}
              </dd>
            </div>
            <div className="py-4 flex items-center justify-between border-t border-gray-300">
              <dt className="text-lg font-bold text-gray-900">Total</dt>
              <dd className="text-lg text-gray-900">
                {totalPrice?.gross.localizedAmount}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-12">
        <Link href="/checkout">
          <a className="block w-full bg-blue-500 border border-transparent rounded-md shadow-sm py-3 px-4 text-center font-medium text-white hover:bg-blue-700">
            Checkout
          </a>
        </Link>
      </div>
    </section>
  );
};
