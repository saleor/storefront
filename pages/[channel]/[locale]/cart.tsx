import Link from "next/link";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";

import { CartSummary, CheckoutLineItem, Layout, Spinner } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { messages } from "@/components/translations";
import { usePaths } from "@/lib/paths";
import { useCheckout } from "@/lib/providers/CheckoutProvider";

function Cart() {
  const t = useIntl();
  const paths = usePaths();
  const { loading, checkoutError, checkout, checkoutToken } = useCheckout();

  if (checkoutError) return <p>Error</p>;

  const isCheckoutLoading = loading || typeof window === "undefined";
  const products = checkout?.lines || [];

  return (
    <>
      <BaseSeo title="Cart" />

      <div className="py-10">
        <header className="mb-4">
          <div className="container px-8">
            <div className="flex justify-between">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {t.formatMessage(messages.cartPageHeader)}
              </h1>
              <div>
                <Link href={paths.$url()} passHref>
                  <a href="pass" className="text-sm">
                    {t.formatMessage(messages.browseProducts)}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container px-8">
            <section className="col-span-2">
              <ul className="divide-y divide-gray-200">
                {isCheckoutLoading ? (
                  <Spinner />
                ) : (
                  products.map((line) => (
                    <li key={line?.id} className="flex py-6">
                      {line && checkoutToken && <CheckoutLineItem line={line} />}
                    </li>
                  ))
                )}
              </ul>
            </section>

            {!!checkout && (
              <div>
                <CartSummary checkout={checkout} />
                <div className="mt-12">
                  <Link href={paths.checkout.$url()} passHref>
                    <a
                      className="block w-full bg-blue-500 border border-transparent rounded-md shadow-sm py-3 px-4 text-center font-medium text-md text-white hover:bg-blue-700"
                      href="pass"
                    >
                      {t.formatMessage(messages.checkoutButton)}
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
}

export default Cart;

Cart.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
