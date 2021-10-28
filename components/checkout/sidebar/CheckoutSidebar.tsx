import React from "react";

import { CartSummary, CheckoutProductList } from "@/components";
import { notNullable } from "@/lib/util";
import { CheckoutDetailsFragment } from "@/saleor/api";

interface CheckoutSidebarProps {
  checkout: CheckoutDetailsFragment;
}

export const CheckoutSidebar = ({ checkout }: CheckoutSidebarProps) => {
  let lines = checkout.lines?.filter(notNullable) || [];
  return (
    <section className="max-w-md w-full flex flex-col ">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:pr-4 md:py-4 md:pl-0 p-4">
        Order summary
      </h1>

      <CheckoutProductList lines={lines} token={checkout.token} />
      <CartSummary checkout={checkout} />
    </section>
  );
};

export default CheckoutSidebar;
