import React from "react";
import { useIntl } from "react-intl";

import { CartSummary, CheckoutProductList } from "@/components";
import { messages } from "@/components/translations";
import { notNullable } from "@/lib/util";
import { CheckoutDetailsFragment } from "@/saleor/api";

interface CheckoutSidebarProps {
  checkout: CheckoutDetailsFragment;
}

export function CheckoutSidebar({ checkout }: CheckoutSidebarProps) {
  const t = useIntl();
  const lines = checkout.lines?.filter(notNullable) || [];
  return (
    <section className="max-w-md w-full flex flex-col ">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:pr-4 md:py-4 md:pl-0 p-4">
        {t.formatMessage(messages.orderSummary)}
      </h1>

      <CheckoutProductList lines={lines} token={checkout.token} />
      <CartSummary checkout={checkout} />
    </section>
  );
}

export default CheckoutSidebar;
