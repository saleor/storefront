import React from "react";

import { CartSummary, CheckoutProductList } from "@/components";
import { CheckoutDetailsFragment } from "@/saleor/api";

interface CheckoutSidebarProps {
  checkout: CheckoutDetailsFragment;
}

export const CheckoutSidebar = ({ checkout }: CheckoutSidebarProps) => {
  const lines = checkout.lines?.filter((l) => !!l) || [];
  return (
    <section className="max-w-md w-full flex flex-col ">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 p-4">
        Order summary
      </h1>

      <CheckoutProductList lines={lines} token={checkout.token} />
      <CartSummary checkout={checkout} />
    </section>
  );
};

export default CheckoutSidebar;
