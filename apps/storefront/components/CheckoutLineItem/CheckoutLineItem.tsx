import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
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
import { IconButton } from "./IconButton";

interface CheckoutLineItemProps {
  line: CheckoutLineDetailsFragment;
}

export const CheckoutLineItem = ({ line }: CheckoutLineItemProps) => {
  const paths = usePaths();
  const t = useIntl();
  const { query, formatPrice } = useRegions();
  const { checkoutToken: token } = useCheckout();
  const [checkoutLineUpdateMutation] = useCheckoutLineUpdateMutation();
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();
  const [quantity, setQuantity] = useState(line.quantity);
  const [errors, setErrors] = React.useState<ErrorDetailsFragment[] | null>(null);

  React.useEffect(() => {
    if (!line) return;
    setQuantity(line.quantity);
  }, [line]);

  // const changeLineState = (event: any) => {
  //   if (!event?.target?.validity?.valid) return;
  //   setQuantity(event.target.value);
  // };

  const changeLineState = (data: number) => {
    setQuantity(data);
  };

  const setQuantityWithButtonPlus = async (type: string) => {
    let result = await checkoutLineUpdateMutation({
      variables: {
        token,
        lines: [],
        locale: query.locale,
      },
    });
    if (type === "plus") {
      changeLineState(quantity + 1);
      result = await checkoutLineUpdateMutation({
        variables: {
          token,
          lines: [
            {
              quantity: quantity + 1,
              variantId: line?.variant.id || "",
            },
          ],
          locale: query.locale,
        },
      });
    } else if (type === "minus") {
      changeLineState(quantity - 1);
      result = await checkoutLineUpdateMutation({
        variables: {
          token,
          lines: [
            {
              quantity: quantity - 1,
              variantId: line?.variant.id || "",
            },
          ],
          locale: query.locale,
        },
      });
    }
    const mutationErrors = result.data?.checkoutLinesUpdate?.errors;
    if (mutationErrors && mutationErrors.length > 0) {
      setErrors(mutationErrors);
    }
  };

  // const onQuantityUpdate = async (event: any) => {
  //   changeLineState(event);
  //   if (!event?.target?.validity?.valid || event?.target?.value === "") return;
  //   const result = await checkoutLineUpdateMutation({
  //     variables: {
  //       token,
  //       lines: [
  //         {
  //           quantity: parseFloat(event.target.value),
  //           variantId: line?.variant.id || "",
  //         },
  //       ],
  //       locale: query.locale,
  //     },
  //   });
  //   const mutationErrors = result.data?.checkoutLinesUpdate?.errors;
  //   if (mutationErrors && mutationErrors.length > 0) {
  //     setErrors(mutationErrors);
  //   }
  // };

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
          <div className="flex justify-between items-center">
            <div className="pr-6">
              <h3 className="text-md md:text-xl font-bold">
                <Link href={paths.products._slug(line?.variant?.product?.slug).$url()} passHref>
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
              <div className="flex flex-row items-center mb-3">
                <IconButton
                  variant="bare"
                  onClick={() => {
                    setQuantityWithButtonPlus("minus");
                  }}
                  icon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17 12L7 12" stroke="#394052" strokeLinecap="round" />
                    </svg>
                  }
                />
                <p className="text-md md:text-xl text-gray-900">{quantity}</p>
                <IconButton
                  variant="bare"
                  onClick={() => {
                    setQuantityWithButtonPlus("plus");
                  }}
                  icon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5 7C12.5 6.72386 12.2761 6.5 12 6.5C11.7239 6.5 11.5 6.72386 11.5 7V11.5H7C6.72386 11.5 6.5 11.7239 6.5 12C6.5 12.2761 6.72386 12.5 7 12.5H11.5V17C11.5 17.2761 11.7239 17.5 12 17.5C12.2761 17.5 12.5 17.2761 12.5 17V12.5H17C17.2761 12.5 17.5 12.2761 17.5 12C17.5 11.7239 17.2761 11.5 17 11.5H12.5V7Z"
                        fill="#394052"
                      />
                    </svg>
                  }
                />
              </div>
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
