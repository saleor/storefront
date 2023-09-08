import React, { ReactElement, useEffect, useState } from "react";
import { invariant } from "@apollo/client/utilities/globals";
import Link from "next/link";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useRegions } from "@/components/RegionsProvider";
import {
  ErrorDetailsFragment,
  useCheckoutLineUpdateMutation,
  useRemoveProductFromCheckoutMutation,
} from "@/saleor/api";
import { Layout } from "@/components";
import usePaths from "@/lib/paths";
import EmptyCart from "@/components/CustomCart/EmptyCart";
import CartSummary from "@/components/CustomCart/CartSummary";
import CartItem from "@/components/CustomCart/CartItem";

function CartPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, ErrorDetailsFragment[] | null>>({});
  const paths = usePaths();
  const { currentLocale, currentChannel, query } = useRegions();
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();
  const [checkoutLineUpdateMutation, { loading: loadingLineUpdate }] =
    useCheckoutLineUpdateMutation();
  const { checkout } = useCheckout();

  useEffect(() => {
    if (checkout?.lines) {
      const newQuantities: { [key: string]: number } = {};
      checkout.lines.forEach((line) => {
        newQuantities[line.id] = line.quantity;
      });
      setQuantities(newQuantities);
    }
  }, [checkout?.lines]);

  const changeLineState = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const updateLineQuantity = async (variantId: string, newQuantity: number) => {
    const result = await checkoutLineUpdateMutation({
      variables: {
        token: checkout?.token,
        lines: [
          {
            quantity: newQuantity,
            variantId: variantId,
          },
        ],
        locale: query.locale,
      },
    });
    const mutationErrors = result.data?.checkoutLinesUpdate?.errors;
    if (mutationErrors && mutationErrors.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [variantId]: mutationErrors,
      }));
    }
  };

  const totalPrice = checkout?.totalPrice.gross.amount || "";
  const totalCurrency = checkout?.totalPrice?.gross?.currency || "";
  const totalPriceStr = `${totalPrice} ${totalCurrency}`;

  const subtotalPrice = checkout?.subtotalPrice.net.amount || "";
  const subtotalCurrency = checkout?.subtotalPrice?.net?.currency || "";
  const subtotalPriceStr = `${subtotalPrice} ${subtotalCurrency}`;

  const saleorApiUrl = process.env.NEXT_PUBLIC_API_URI;
  invariant(saleorApiUrl, "Missing NEXT_PUBLIC_API_URI");

  const domain = new URL(saleorApiUrl).hostname;
  const checkoutParams = checkout
    ? new URLSearchParams({
        checkout: checkout.id,
        locale: currentLocale,
        channel: currentChannel.slug,
        saleorApiUrl,
        domain,
      })
    : new URLSearchParams();

  const externalCheckoutUrl = checkout ? `/checkout/?${checkoutParams.toString()}` : "#";

  console.log(checkout);

  return (
    <main className="container w-full px-8 mt-18 mb-18">
      {checkout && checkout.lines.length > 0 ? (
        <React.Fragment>
          <h1 className="mb-4 font-bold text-5xl md:text-6xl xl:text-7xl tracking-tight max-w-[647px] md:max-w-full">
            Mój koszyk
          </h1>
          <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <p className="text-base text-gray-400 font-light">Produkty</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="text-base text-gray-400 font-light">Cena</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="text-base text-gray-400 font-light">Ilość</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="text-base text-gray-400 font-light">Kwota całkowita</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="text-base text-gray-400 font-light">Usuń</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {checkout?.lines.map((item) => {
                  const thumbnail = item.variant?.product?.thumbnail?.url as string;
                  return (
                    <CartItem
                      variantId={item.variant.id}
                      thumbnail={thumbnail}
                      productName={item.variant.product?.name}
                      variantName={item.variant?.name}
                      priceAmount={item?.variant?.pricing?.price?.gross?.amount}
                      priceCurrency={item?.variant?.pricing?.price?.gross?.currency}
                      totalPriceAmount={item?.totalPrice?.gross.amount}
                      totalPriceCurrency={item?.totalPrice?.gross.currency}
                      quantity={quantities[item.id]}
                      changeLineState={(value) => changeLineState(item.id, value)}
                      onQuantityUpdate={async () => {
                        await updateLineQuantity(item.variant.id, quantities[item.id]);
                      }}
                      errors={errors}
                      loadingLineUpdate={loadingLineUpdate}
                      setErrors={() => setErrors}
                      onRemove={async () => {
                        await removeProductFromCheckout({
                          variables: {
                            checkoutToken: checkout?.token,
                            lineId: item?.id,
                            locale: query.locale,
                          },
                        });
                      }}
                    />
                  );
                })}
                <CartSummary subtotal={subtotalPriceStr} total={totalPriceStr} />
              </TableBody>
            </Table>
          </TableContainer>
          <div className="mt-12 flex justify-end">
            <Link
              href={externalCheckoutUrl}
              className="text-2xl md:text-3xl border-brand border-2 bg-brand hover:border-brand hover:bg-white hover:text-brand transition
               text-white font-bold py-4 px-8 rounded-full"
            >
              Przejdź do kasy
            </Link>
          </div>
        </React.Fragment>
      ) : (
        checkout && checkout.lines.length < 1 && <EmptyCart paths={paths} />
      )}
    </main>
  );
}

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CartPage;
