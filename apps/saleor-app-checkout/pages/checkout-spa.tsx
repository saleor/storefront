import Dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import invariant from "ts-invariant";
import urlJoin from "url-join";

const CheckoutStoreFront = Dynamic(
  async () => {
    const { Root } = await import("@saleor/checkout-storefront");
    return Root;
  },
  {
    ssr: false,
    loading: () => null,
  }
);

export default function CheckoutSpa() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const checkoutAppUrl = urlJoin(window.location.origin, "saleor-app-checkout", "/");
  const allowedSaleorApiRegex = process.env.NEXT_PUBLIC_ALLOWED_SALEOR_API_REGEX;
  invariant(allowedSaleorApiRegex, `Missing NEXT_PUBLIC_ALLOWED_SALEOR_API_REGEX`);

  return (
    <CheckoutStoreFront
      env={{
        checkoutApiUrl: urlJoin(checkoutAppUrl, "api", "/"),
        checkoutAppUrl,
      }}
      saleorApiUrlRegex={new RegExp(allowedSaleorApiRegex)}
    />
  );
}
