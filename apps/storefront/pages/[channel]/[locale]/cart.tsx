import Link from "next/link";
import React, { ReactElement } from "react";
import { useLocalStorage } from "react-use";

import { CartSummary, CheckoutLineItem, Layout, Spinner } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { CHECKOUT_TOKEN } from "@/lib/const";
import { usePaths } from "@/lib/paths";
import { useCheckoutByTokenQuery } from "@/saleor/api";

const Cart = () => {
  const paths = usePaths();

  const [token] = useLocalStorage<string>(CHECKOUT_TOKEN);
  const { data, loading, error } = useCheckoutByTokenQuery({
    fetchPolicy: "network-only",
    variables: { checkoutToken: token },
    skip: !token,
  });

  if (loading) {
    return <Spinner />;
  }
  if (error) return <p>Error</p>;

  const products = data?.checkout?.lines || [];

  return (
    <>
      <BaseSeo title="Cart - Saleor Tutorial" />

      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Your Cart
              </h1>
              <div>
                <Link href={paths.$url()}>
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
                {products.map((line) => (
                  <li key={line?.id} className="flex py-6">
                    {line && token && (
                      <CheckoutLineItem line={line} token={token} />
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {!!data?.checkout && (
              <div>
                <CartSummary checkout={data.checkout} />
                <div className="mt-12">
                  <Link href={paths.checkout.$url()}>
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
    </>
  );
};

export default Cart;

Cart.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
