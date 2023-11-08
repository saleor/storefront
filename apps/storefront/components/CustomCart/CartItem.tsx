import { CheckoutLineDetailsFragment, useRemoveProductFromCheckoutMutation } from "@/saleor/api";
import { Card, Divider } from "@mantine/core";
import { CardContent } from "@mui/material";
import Image from "next/image";
import { TrashButton } from "./TrashButton";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useRegions } from "../RegionsProvider";
import { CartForm } from "./CartForm";

interface CartItemProps {
  line?: CheckoutLineDetailsFragment;
}

export function CartItem({ line }: CartItemProps) {
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
        lineId: line?.id,
        locale: locale,
      },
    });
  };

  return (
    <>
      <Card>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div className="flex flex-row gap-6 items-center ">
            {line?.variant.product.thumbnail?.url && (
              <Image
                src={line.variant.product.thumbnail?.url}
                alt=""
                width="75"
                height="75"
                unoptimized={true}
              />
            )}
            <div className="flex items-start w-full justify-between gap-4">
              <div className="flex flex-col">
                <h4 className="mb-4 font-bold text-2xl tracking-tight max-w-[647px] md:max-w-full">
                  {line?.variant.product.name}
                </h4>
                <p className="text-base text-gray-500">SKU: {line?.variant.name}</p>
              </div>
              <TrashButton
                handleProductRemove={handleProductRemove}
                isRemoveProductLoading={isRemoveProductLoading}
              />
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-gray-500 uppercase">Cena</p>
              <p className="text-base font-bold">
                {formatPrice(line?.variant?.pricing?.price?.gross)}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase">Ilość</p>
              <CartForm quantity={line?.quantity.toString()} variantId={line?.variant.id} />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-gray-500 uppercase">Kwota całkowita</p>
              <p className="text-base font-bold">
                {formatPrice(line?.variant?.pricing?.price?.gross)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Divider />
    </>
  );
}
