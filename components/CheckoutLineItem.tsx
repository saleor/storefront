import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  CheckoutLineDetailsFragment,
  ErrorDetailsFragment,
  useCheckoutLineUpdateMutation,
  useRemoveProductFromCheckoutMutation,
} from "@/saleor/api";

interface CheckoutLineItemProps {
  line: CheckoutLineDetailsFragment;
  token: string;
}

export const CheckoutLineItem = ({ line, token }: CheckoutLineItemProps) => {
  const [checkoutLineUpdateMutation, { loading: loadingLineUpdate }] =
    useCheckoutLineUpdateMutation();
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();

  const [quantity, setQuantity] = React.useState<number>();
  const [errors, setErrors] = React.useState<ErrorDetailsFragment[] | null>(
    null
  );

  React.useEffect(() => {
    if (!line) return;
    setQuantity(line.quantity);
  }, [line]);

  const changeLineState = (event: any) => {
    if (!event?.target?.validity?.valid) return;
    setQuantity(event.target.value);
  };

  const onQuantityUpdate = async (event: any) => {
    changeLineState(event);
    if (!event?.target?.validity?.valid || event?.target?.value === "") return;
    const result = await checkoutLineUpdateMutation({
      variables: {
        token: token,
        lines: [
          {
            quantity: parseFloat(event.target.value),
            variantId: line?.variant.id || "",
          },
        ],
      },
    });
    const errors = result.data?.checkoutLinesUpdate?.errors;
    if (errors && errors.length > 0) {
      setErrors(errors);
    }
  };

  if (!line) return null;

  return (
    <>
      <div className="flex-shrink-0 bg-white w-48 h-48 border object-center object-cover relative">
        <Image
          src={line.variant.product?.thumbnail?.url || ""}
          alt={line.variant.product?.thumbnail?.alt || ""}
          layout="fill"
        />
      </div>

      <div className="ml-8 flex-1 flex flex-col justify-center">
        <div>
          <div className="flex justify-between">
            <div className="pr-6">
              <h3 className="text-xl font-bold">
                <Link href={`/product/${line?.variant.product?.slug}`}>
                  <a className="font-medium text-gray-700 hover:text-gray-800">
                    {line?.variant.product?.name}
                  </a>
                </Link>
              </h3>
              <h4 className="text-m font-regular">
                <a className="text-gray-700 hover:text-gray-800">
                  {line?.variant?.name}
                </a>
              </h4>

              <button
                type="button"
                onClick={() =>
                  removeProductFromCheckout({
                    variables: {
                      checkoutToken: token,
                      lineId: line?.id,
                    },
                  })
                }
                className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:ml-0 sm:mt-3"
              >
                <span>Remove</span>
              </button>
              {errors && (
                <div>
                  {errors.map((err) => (
                    <span
                      className="text-red-500 text-sm font-medium"
                      key={err.field}
                    >
                      {err.message}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-items-end space-x-4">
              <input
                type="number"
                className={clsx(
                  "h-8 w-16 block border-gray-300 rounded-md shadow-sm sm:text-sm",
                  errors && "border-red-500"
                )}
                value={quantity}
                onFocus={() => {
                  setErrors(null);
                }}
                onChange={(ev) => changeLineState(ev)}
                onBlur={(ev) => onQuantityUpdate(ev)}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    onQuantityUpdate(ev);
                  }
                }}
                min={1}
                required
                disabled={loadingLineUpdate}
                pattern="[0-9]*"
              />
              <p className="text-xl text-gray-900 text-right">
                {line?.totalPrice?.gross.localizedAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CheckoutLineItem;
