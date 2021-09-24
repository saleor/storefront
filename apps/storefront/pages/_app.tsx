import { useEffect } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { useLocalStorage } from "react-use";
import "styles/globals.css";

import { useCreateCheckoutMutation } from "@/saleor/api";

import apolloClient from "@/lib/graphql";
import { CHECKOUT_TOKEN } from "@/lib/const";

const Provider = ({ Component, pageProps }: AppProps) => {
  const [checkoutToken, setCheckoutToken] = useLocalStorage(CHECKOUT_TOKEN);
  const [createCheckout, { data, loading }] = useCreateCheckoutMutation();

  useEffect(() => {
    async function doCheckout() {
      const { data } = await createCheckout();
      const token = data?.checkoutCreate?.checkout?.token;
      setCheckoutToken(token);
    }

    if (!checkoutToken) {
      doCheckout();
    }
  }, []);

  return <Component {...pageProps} checkoutToken={checkoutToken} />;
};

function MyApp(props: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider {...props} />
    </ApolloProvider>
  );
}

export default MyApp;
