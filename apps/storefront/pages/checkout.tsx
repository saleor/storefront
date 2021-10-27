import React from "react";
import { useLocalStorage } from "react-use";

import { BaseTemplate, CheckoutForm, CheckoutSidebar } from "@/components";
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
      <BaseTemplate isLoading={true}>
        <BaseSeo title="Checkout - Saleor Tutorial" />
      </BaseTemplate>
    );
  }
  const checkout = checkoutData?.checkout;
  if (!checkout || checkout.lines?.length === 0) {
    return (
      <BaseTemplate>
        <BaseSeo title="Checkout - Saleor Tutorial" />
      </BaseTemplate>
    );
  }

  return (
    <BaseTemplate>
      <BaseSeo title="Checkout - Saleor Tutorial" />

      <main className="min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-2">
          <CheckoutForm checkout={checkout} />
        </div>
        <div className="w-full">
          <CheckoutSidebar checkout={checkout} />
        </div>
      </main>
    </BaseTemplate>
  );
};

export default CheckoutPage;
