import { useEffect } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { useLocalStorage } from "react-use";
import "tailwindcss/tailwind.css";

import { useCreateCheckoutMutation } from "@/saleor/api";

import apolloClient from "@/lib/graphql";

const Provider = ({ Component, pageProps }: AppProps) => {
  const [token, setToken] = useLocalStorage("token");
  const [createCheckout, { data, loading }] = useCreateCheckoutMutation();

  useEffect(() => {
    async function doCheckout() {
      const { data } = await createCheckout();
      const token = data?.checkoutCreate?.checkout?.token;

      setToken(token);
    }

    doCheckout();
  }, []);

  return <Component {...pageProps} token={token} />;
};

function MyApp(props: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider {...props} />
    </ApolloProvider>
  );
}

export default MyApp;
