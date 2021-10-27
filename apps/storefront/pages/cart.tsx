import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLocalStorage } from "react-use";

import { BaseTemplate,CartSummary } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { CHECKOUT_TOKEN } from "@/lib/const";
import {
  useCheckoutByTokenQuery,
  useRemoveProductFromCheckoutMutation,
} from "@/saleor/api";

const Cart = () => {
  const [token] = useLocalStorage(CHECKOUT_TOKEN);
  const { data, loading, error } = useCheckoutByTokenQuery({
    fetchPolicy: "network-only",
    variables: { checkoutToken: token },
    skip: !token,
  });
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();

  if (loading) {
    return <BaseTemplate isLoading={true} />;
  }
  if (error) return <p>Error</p>;

  const products = data?.checkout?.lines || [];

  return (
    <BaseTemplate>
      <BaseSeo title="Cart - Saleor Tutorial" />

      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Your Cart
              </h1>
              <div>
                <Link href="/">
                  <a className="text-sm ">Continue Shopping</a>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-8">
            <section className="col-span-2">
              <ul role="list" className="divide-y divide-gray-200">
                {products.map((line) => {
                  const lineID = line?.id || "";
                  const variant = line?.variant;
                  const product = line?.variant.product;
                  const price = line?.totalPrice?.gross;
                  return (
                    <li key={line?.id} className="flex py-6">
                      <div className="flex-shrink-0 bg-white w-48 h-48 border object-center object-cover relative">
                        <Image
                          src={product?.thumbnail?.url || ""}
                          alt={product?.thumbnail?.alt || ""}
                          layout="fill"
                        />
                      </div>

                      <div className="ml-8 flex-1 flex flex-col justify-center">
                        <div>
                          <div className="flex justify-between">
                            <div className="pr-6">
                              <h3 className="text-xl font-bold">
                                <Link href={`/products/${product?.slug}`}>
                                  <a className="font-medium text-gray-700 hover:text-gray-800">
                                    {product?.name}
                                  </a>
                                </Link>
                              </h3>
                              <h4 className="text-m font-regular">
                                <a className="text-gray-700 hover:text-gray-800">
                                  {variant?.name}
                                </a>
                              </h4>

                              <button
                                type="button"
                                onClick={() =>
                                  removeProductFromCheckout({
                                    variables: {
                                      checkoutToken: token,
                                      lineId: lineID,
                                    },
                                  })
                                }
                                className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:ml-0 sm:mt-3"
                              >
                                <span>Remove</span>
                              </button>
                            </div>

                            <p className="text-xl text-gray-900 text-right">
                              {price?.localizedAmount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {!!data?.checkout && (
              <div>
                <CartSummary checkout={data.checkout} />
                <div className="mt-12">
                  <Link href="/checkout">
                    <a className="block w-full bg-blue-500 border border-transparent rounded-md shadow-sm py-3 px-4 text-center font-medium text-white hover:bg-blue-700">
                      Checkout
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default Cart;
