import Image from "next/legacy/image";
import React from "react";
import { useIntl } from "react-intl";

import { useRegions } from "@/components/RegionsProvider";
import { messages } from "@/components/translations";
import { translate } from "@/lib/translations";
import { CheckoutLineDetailsFragment, useRemoveProductFromCheckoutMutation } from "@/saleor/api";

export interface CheckoutProductListProps {
  lines: CheckoutLineDetailsFragment[];
  token: string;
}

export function CheckoutProductList({ lines, token }: CheckoutProductListProps) {
  const t = useIntl();
  const { query, formatPrice } = useRegions();

  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();

  return (
    <ul className="flex-auto overflow-y-auto divide-y divide-gray-200 px-4 md:pr-4 md:pl-0">
      {lines.map((line) => {
        if (!line) {
          return null;
        }
        return (
          <li key={line.id} className="flex py-4 space-x-4">
            <div className="border bg-white w-32 h-32 object-center object-cover rounded-md relative">
              {line.variant.product?.thumbnail && (
                <Image
                  src={line.variant.product?.thumbnail?.url}
                  alt={line.variant.product?.thumbnail?.alt || ""}
                  layout="fill"
                />
              )}
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div className="text-sm font-medium space-y-1">
                <h3 className="text-gray-900">{translate(line.variant.product, "name")}</h3>
                <p className="text-gray-500">{translate(line.variant, "name")}</p>
                <p className="text-gray-900">{formatPrice(line.totalPrice?.gross)}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  onClick={() =>
                    removeProductFromCheckout({
                      variables: {
                        checkoutToken: token,
                        lineId: line.id,
                        locale: query.locale,
                      },
                    })
                  }
                >
                  {t.formatMessage(messages.removeButton)}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
