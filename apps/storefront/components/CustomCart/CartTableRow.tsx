import { TableCell, TableRow } from "@mui/material";
import Image from "next/image";

import { CheckoutLineDetailsFragment, useRemoveProductFromCheckoutMutation } from "@/saleor/api";

import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useRegions } from "../RegionsProvider";

import { CartForm } from "./CartForm";
import { TrashButton } from "./TrashButton";

export interface CartTableRow {
  line?: CheckoutLineDetailsFragment;
}

export function CartTableRow({ line }: CartTableRow) {
  const { checkout } = useCheckout();
  const {
    query: { locale },
    formatPrice,
  } = useRegions();
  const [removeProductFromCheckout, { loading: isRemoveProductLoading }] =
    useRemoveProductFromCheckoutMutation();

  const handleProductRemove = async () => {
    if (!checkout?.token || !line?.id) {
      return;
    }

    await removeProductFromCheckout({
      variables: {
        checkoutToken: checkout?.token,
        lineId: line.id,
        locale: locale,
      },
    });
  };

  return (
    <TableRow>
      <TableCell align="center">
        <div className="flex flex-row gap-6 items-center">
          {line?.variant.product.thumbnail?.url && (
            <Image
              src={line?.variant.product.thumbnail?.url}
              alt=""
              width="75"
              height="75"
              unoptimized={true}
            />
          )}
          <div className="flex flex-col items-start">
            <h4 className="mb-4 font-bold text-2xl text-left">{line?.variant.product.name}</h4>
            <p className="text-base text-gray-500">SKU: {line?.variant.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell align="center">
        <p className="text-base font-bold">{formatPrice(line?.variant.pricing?.price?.gross)}</p>
      </TableCell>
      <TableCell align="center">
        <CartForm quantity={line?.quantity.toString()} variantId={line?.variant.id} />
      </TableCell>
      <TableCell align="center">
        <p className="text-base font-bold">{formatPrice(line?.totalPrice.gross)}</p>
      </TableCell>
      <TableCell align="center">
        <TrashButton
          handleProductRemove={handleProductRemove}
          isRemoveProductLoading={isRemoveProductLoading}
        />
      </TableCell>
    </TableRow>
  );
}
