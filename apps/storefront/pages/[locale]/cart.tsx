import { ReactElement } from "react";
import { invariant } from "@apollo/client/utilities/globals";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Hidden,
} from "@mui/material";

import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useRegions } from "@/components/RegionsProvider";
import { Layout } from "@/components";
import usePaths from "@/lib/paths";
import EmptyCart from "@/components/CustomCart/EmptyCart";
import CartSummary from "@/components/CustomCart/CartSummary";

import { CartTableRow } from "@/components/CustomCart/CartTableRow";
import { CartItem } from "@/components/CustomCart/CartItem";

function CartPage() {
  const paths = usePaths();
  const { checkout } = useCheckout();
  const { currentLocale, currentChannel } = useRegions();
  const { formatPrice } = useRegions();

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

  return (
    <main className="container w-full px-8 mt-18 mb-18">
      {checkout?.lines.length ? (
        <>
          <h1 className="mb-4 font-bold uppercase text-4xl md:text-5xl xl:text-6xl tracking-tight max-w-[647px] md:max-w-full">
            Mój koszyk
          </h1>
          <Hidden mdDown>
            <TableContainer>
              <Table sx={{ minWidth: 700, overflow: "hidden" }} aria-label="spanning table">
                <Hidden mdDown>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <p className="text-xs text-gray-500 uppercase">Produkty</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-xs text-gray-500 uppercase">Cena</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-xs text-gray-500 uppercase">Ilość</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-xs text-gray-500 uppercase whitespace-nowrap">
                          Kwota całkowita
                        </p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-xs text-gray-500 uppercase">Usuń</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Hidden>
                <TableBody>
                  {checkout?.lines.map((line) => (
                    <CartTableRow key={line.id} line={line} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Hidden>
          <Hidden mdUp>
            {checkout?.lines.map((line) => (
              <CartItem line={line} key={line.id} />
            ))}
          </Hidden>
          <CartSummary
            subtotal={formatPrice(checkout.subtotalPrice.net)}
            total={formatPrice(checkout.totalPrice.gross)}
          />
          <div className="mt-12 flex justify-end">
            <Link
              href={externalCheckoutUrl}
              className="text-2xl md:text-3xl border-brand border-2 bg-brand hover:border-brand hover:bg-white hover:text-brand transition
               text-white font-bold py-4 px-8 rounded-full"
            >
              Kontynuuj do kasy
            </Link>
          </div>
        </>
      ) : (
        <EmptyCart paths={paths} />
      )}
    </main>
  );
}

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CartPage;
