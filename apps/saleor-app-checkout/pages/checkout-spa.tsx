import Dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { envVars } from "../constants";

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

  const apiUrl = envVars.apiUrl;
  const checkoutAppUrl = window.location.origin + "/saleor-app-checkout/";

  if (!apiUrl) {
    console.warn(`Missing NEXT_PUBLIC_SALEOR_API_URL env variable`);
    return null;
  }

  return (
    <CheckoutStoreFront env={{ apiUrl, checkoutApiUrl: checkoutAppUrl + "api/", checkoutAppUrl }} />
  );
}
