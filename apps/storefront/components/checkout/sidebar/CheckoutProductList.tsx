import {
  CheckoutLineDetailsFragment,
  Maybe,
  useRemoveProductFromCheckoutMutation,
} from "@/saleor/api";
import React from "react";

export interface CheckoutProductListProps {
  lines: Maybe<CheckoutLineDetailsFragment>[];
  token: string;
}

export const CheckoutProductList: React.VFC<CheckoutProductListProps> = ({
  lines,
  token,
}) => {
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();

  return (
    <ul
      role="list"
      className="flex-auto overflow-y-auto divide-y divide-gray-200 px-4"
    >
      {lines.map((line) => {
        if (!line) {
          return <></>;
        }
        return (
          <li key={line.id} className="flex py-4 space-x-4">
            <img
              src={line.variant.product.thumbnail?.url}
              alt={line.variant.product.thumbnail?.alt || ""}
              className="border bg-white w-32 h-32 object-center object-cover rounded-md"
            />
            <div className="flex flex-col justify-between space-y-4">
              <div className="text-sm font-medium space-y-1">
                <h3 className="text-gray-900">{line.variant.product.name}</h3>
                <p className="text-gray-500">{line.variant.name}</p>
                <p className="text-gray-900">
                  {line.totalPrice?.gross.localizedAmount}
                </p>
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
                      },
                    })
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
