// import { createFetch } from "@/checkout-storefront/lib/auth/createFetch";
import { SaleorAuthClient } from "@/checkout-storefront/lib/auth/SaleorAuthClient";
import { useAuthChange } from "@/checkout-storefront/lib/auth/useAuthChange";
import { useMemo, useState } from "react";
import { Client, ClientOptions, createClient } from "urql";

interface UseUrqlClientProps {
  saleorAuthClient: SaleorAuthClient;
  opts: ClientOptions;
}

// since urql doesn't support invalidating cache manually
// https://github.com/urql-graphql/urql/issues/297#issuecomment-501646761
export const useUrqlClient = ({ saleorAuthClient, opts }: UseUrqlClientProps) => {
  const authFetch = useMemo(() => saleorAuthClient.fetchWithAuth, [saleorAuthClient]);

  const createNewClient = () =>
    createClient({
      ...opts,
      suspense: true,
      requestPolicy: "cache-first",
      // fetch: authFetch,
    });

  const [client, setClient] = useState<Client>(createNewClient());

  const resetClient = () => setClient(createNewClient());

  // reset once user has been signed in / out
  useAuthChange({
    onSignedOut: () => resetClient(),
    onSignedIn: () => {
      console.log("YOYOYOYOYOYOYOY");
      resetClient();
    },
  });

  return client;
};
