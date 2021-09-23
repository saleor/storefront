import React from "react";
import { useLocalStorage } from "react-use";

import { CheckoutProductList, CheckoutSummary } from "@/components";
import { useCheckoutByTokenQuery } from "@/saleor/api";
import { CHECKOUT_TOKEN } from "@/lib/const";

export const CheckoutSidebar: React.VFC = ({}) => {
  const [token] = useLocalStorage(CHECKOUT_TOKEN);
  const { data, loading, error } = useCheckoutByTokenQuery({
    fetchPolicy: "network-only",
    variables: { checkoutToken: token },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const products = (data.checkout?.lines || []).map((_) => ({
      ..._?.variant?.product,
      lineId: _!.id,
      price: _?.variant?.pricing?.price?.gross.amount,
    }));

    return (
      <section className="max-w-md w-full flex flex-col bg-gray-50">
        <h2>Order summary</h2>

        <CheckoutProductList products={products} />
        <CheckoutSummary checkout={data.checkout} />
      </section>
    );
  }

  return null;
};
