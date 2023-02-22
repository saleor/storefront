import { useState } from "react";
import { Client, ClientOptions, createClient } from "urql";

// since urql doesn't support invalidating cache manually
// https://github.com/urql-graphql/urql/issues/297#issuecomment-501646761
export const useUrqlClient = (opts: ClientOptions) => {
  const createNewClient = () => createClient(opts);

  const [urqlClient, setUrqlClient] = useState<Client>(createNewClient());

  const resetClient = () => setUrqlClient(createNewClient());

  return { urqlClient, resetClient };
};
