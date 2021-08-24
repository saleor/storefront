import React from "react";
import Link from "next/link";

import { CheckoutSummary } from "../components/CheckoutSummary";
import { Navbar } from "../components/Navbar";
import {
  useCheckoutByIdQuery,
  useRemoveProductFromCheckoutMutation,
} from "../saleor/api";
import { useLocalStorage } from "../lib/hooks";
import { CheckoutByID } from "../components/config";

const Cart: React.VFC = ({}) => {
  const [token] = useLocalStorage("token", "");
  const { data, loading, error } = useCheckoutByIdQuery({
    fetchPolicy: "network-only",
    // skip:
    variables: { checkoutId: token },
  });
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation({
    refetchQueries: [CheckoutByID],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const products = (data.checkout?.lines || []).map((_) => ({
      ..._.variant.product,
      lineId: _.id,
    }));

    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="py-10">
          <header className="mb-4">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Your Cart
                </h1>
                <div>
                  <Link href="/">
                    <a className="text-sm text-blue-600 hover:text-blue-500">
                      Continue Shopping
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-3 gap-8">
                <section className="col-span-2">
                  <ul role="list" className="divide-y divide-gray-200">
                    {products.map((product, idx) => (
                      <li key={idx} className="flex py-6">
                        <div className="flex-shrink-0 bg-white">
                          <img
                            src={product.thumbnail.url}
                            className="w-48 h-48 border object-center object-cover"
                          />
                        </div>

                        <div className="ml-8 flex-1 flex flex-col justify-center">
                          <div>
                            <div className="flex justify-between">
                              <div className="pr-6">
                                <h3 className="text-xl font-bold">
                                  <a
                                    href={product.href}
                                    className="font-medium text-gray-700 hover:text-gray-800"
                                  >
                                    {product.name}
                                  </a>
                                </h3>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeProductFromCheckout({
                                      variables: {
                                        checkoutId: token,
                                        lineId: product.lineId,
                                      },
                                    })
                                  }
                                  className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:ml-0 sm:mt-3"
                                >
                                  <span>Remove</span>
                                </button>
                              </div>

                              <p className="text-sm font-medium text-gray-900 text-right">
                                {product.price}
                              </p>
                            </div>

                            <div className="mt-4 flex items-center sm:block sm:absolute sm:top-0 sm:left-1/2 sm:mt-0"></div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <CheckoutSummary checkout={data.checkout} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return null;
};

export default Cart;
