import Dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

  return (
    <CheckoutStoreFront
      env={{
        checkoutApiUrl: urlJoin(checkoutAppUrl, "api", "/"),
        checkoutAppUrl,
      }}
    />
  );
}
