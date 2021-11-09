import React, { ReactElement } from "react";
import { useLocalStorage } from "react-use";

import { CheckoutForm, CheckoutSidebar, Layout, Spinner } from "@/components";
import BaseSeo from "@/components/seo/BaseSeo";
import { CHECKOUT_TOKEN } from "@/lib/const";
import { useCheckoutByTokenQuery } from "@/saleor/api";

const CheckoutPage = () => {
  const [token] = useLocalStorage(CHECKOUT_TOKEN);
  const { data: checkoutData, loading } = useCheckoutByTokenQuery({
    fetchPolicy: "network-only",
    variables: { checkoutToken: token },
    skip: !token,
  });
  if (loading) {
    return (
      <>
        <Spinner />
        <BaseSeo title="Checkout - Saleor Tutorial" />
      </>
    );
  }
  const checkout = checkoutData?.checkout;
  if (!checkout || checkout.lines?.length === 0) {
    return <BaseSeo title="Checkout - Saleor Tutorial" />;
  }

  return (
    <>
      <BaseSeo title="Checkout - Saleor Tutorial" />

      <main className="min-h-screen w-screen max-w-7xl md:px-8 md:mx-auto overflow-hidden flex md:flex-row flex-col justify-between">
        <div className="md:w-2/3 w-full">
          <CheckoutForm checkout={checkout} />
        </div>
        <div className="md:w-1/3 w-full">
          <CheckoutSidebar checkout={checkout} />
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
