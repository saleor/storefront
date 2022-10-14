import Dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

  const checkoutAppUrl = window.location.origin + "/saleor-app-checkout/";

  const {
    query: { saleorApiHost },
  } = useRouter();

  if (!saleorApiHost || typeof saleorApiHost !== "string") {
    console.warn(`Missing saleorApiHost query param`);
    return null;
  }

  return (
    <CheckoutStoreFront
      env={{
        apiUrl: `https://${saleorApiHost}/graphql/`,
        checkoutApiUrl: checkoutAppUrl + "api/",
        checkoutAppUrl,
      }}
    />
  );
}
