import clsx from "clsx";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { SyntheticEvent } from "react";
import { useIntl } from "react-intl";

import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { translate } from "@/lib/translations";
import {
  CheckoutLineDetailsFragment,
  ErrorDetailsFragment,
  useCheckoutLineUpdateMutation,
  useRemoveProductFromCheckoutMutation,
} from "@/saleor/api";

import { usePaths } from "../../lib/paths";
import { useRegions } from "../RegionsProvider";
import { messages } from "../translations";

interface CheckoutLineItemProps {
  line: CheckoutLineDetailsFragment;
}

export function CheckoutLineItem({ line }: CheckoutLineItemProps) {
  const paths = usePaths();
  const t = useIntl();
  const { query, formatPrice } = useRegions();
  const { checkoutToken: token } = useCheckout();
  const [checkoutLineUpdateMutation, { loading: loadingLineUpdate }] =
    useCheckoutLineUpdateMutation();
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();

  const [quantity, setQuantity] = React.useState<number>();
  const [errors, setErrors] = React.useState<ErrorDetailsFragment[] | null>(null);

  React.useEffect(() => {
    if (!line) return;
    setQuantity(line.quantity);
  }, [line]);

  const changeLineState = (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event?.currentTarget?.validity?.valid) return;
    setQuantity(parseFloat(event.currentTarget.value));
  };

  const onQuantityUpdate = async (event: SyntheticEvent<HTMLInputElement>) => {
    changeLineState(event);
    if (!event?.currentTarget?.validity?.valid || event?.currentTarget?.value === "") return;
    const result = await checkoutLineUpdateMutation({
      variables: {
        token,
        lines: [
          {
            quantity: parseFloat(event.currentTarget.value),
            variantId: line?.variant.id || "",
          },
        ],
        locale: query.locale,
      },
    });
    const mutationErrors = result.data?.checkoutLinesUpdate?.errors;
    if (mutationErrors && mutationErrors.length > 0) {
      setErrors(mutationErrors);
    }
  };

  if (!line) return null;

  return (
    <>
      <div className="flex-shrink-0 bg-white w-32 h-32 sm:w-48 sm:h-48 border object-center object-cover relative">
        {line.variant.product?.thumbnail && (
          <Image
            src={line.variant.product?.thumbnail?.url}
            alt={line.variant.product?.thumbnail?.alt || ""}
            layout="fill"
          />
        )}
      </div>

      <div className="ml-8 flex-1 flex flex-col justify-center">
        <div>
          <div className="flex justify-between">
            <div className="pr-6">
              <h3 className="text-md md:text-xl font-bold">
                <Link
                  href={paths.products._slug(line?.variant?.product?.slug).$url()}
                  passHref
                  legacyBehavior
                >
                  <a
                    href="pass"
                    className="font-medium text-gray-700 hover:text-gray-800"
                    data-testid={`cartProductItem${line?.variant.product.name}`}
                  >
                    {translate(line?.variant.product, "name")}
                  </a>
                </Link>
              </h3>
              <h4 className="text-md font-regular">
                <p
                  className="text-gray-700 hover:text-gray-800"
                  data-testid={`cartVariantItem${line?.variant.name}`}
                >
                  {translate(line?.variant, "name")}
                </p>
              </h4>

              <button
                type="button"
                onClick={() =>
                  removeProductFromCheckout({
                    variables: {
                      checkoutToken: token,
                      lineId: line?.id,
                      locale: query.locale,
                    },
                  })
                }
                className="text-md font-medium text-indigo-600 hover:text-indigo-500 sm:ml-0 sm:mt-3"
              >
                <span>{t.formatMessage(messages.removeButton)}</span>
              </button>
              {errors && (
                <div>
                  {errors.map((err) => (
                    <span className="text-red-500 text-sm font-medium" key={err.field}>
                      {err.message}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-items-end space-x-4 ">
              <input
                type="number"
                className={clsx(
                  "h-8 md:mt-2 w-10 md:w-16 block border-gray-300 rounded-md shadow-sm text-base",
                  errors && "border-red-500"
                )}
                defaultValue={quantity}
                onFocus={() => {
                  setErrors(null);
                }}
                onChange={changeLineState}
                onBlur={onQuantityUpdate}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    return onQuantityUpdate(ev);
                  }
                }}
                min={1}
                required
                disabled={loadingLineUpdate}
                pattern="[0-9]*"
              />
              <p className="text-md md:text-xl text-gray-900 text-right">
                {formatPrice(line?.totalPrice?.gross)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutLineItem;
