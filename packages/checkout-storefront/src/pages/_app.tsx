// We're using Next.js here just as a development tool because it's fast and reliable
// For the production, this package is built with `rollup`.
// https://github.com/saleor/saleor-checkout/pull/161
import Dynamic from "next/dynamic";
import "../index.css";

const CheckoutStoreFront = Dynamic(
  async () => {
    const { Root } = await import("../Root");
    return Root;
  },
  {
    ssr: false,
    loading: () => null,
  }
);

const apiUrl = process.env["NEXT_PUBLIC_SALEOR_API_URL"];
const checkoutApiUrl = process.env["NEXT_PUBLIC_CHECKOUT_APP_URL"] + `/api`;
const checkoutAppUrl = process.env["NEXT_PUBLIC_CHECKOUT_APP_URL"];

export default function CheckoutSpa() {
  if (!apiUrl) {
    console.warn(`Missing NEXT_PUBLIC_SALEOR_API_URL env variable`);
    return null;
  }
  if (!checkoutApiUrl) {
    console.warn(`Missing NEXT_PUBLIC_CHECKOUT_APP_URL env variable`);
    return null;
  }
  if (!checkoutAppUrl) {
    console.warn(`Missing NEXT_PUBLIC_CHECKOUT_APP_URL env variable`);
    return null;
  }

  return <CheckoutStoreFront env={{ apiUrl, checkoutApiUrl, checkoutAppUrl }} />;
}
