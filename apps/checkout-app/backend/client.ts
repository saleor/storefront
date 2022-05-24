import {
  createClient,
  Client,
  Operation,
  makeOperation,
  fetchExchange,
} from "urql";
import { authExchange } from "@urql/exchange-auth";

let client: Client;
let token: string;

interface AuthState {
  token: string;
}

const addAuthToOperation = ({
  authState,
  operation,
}: {
  authState?: AuthState | null;
  operation: Operation<any, any>;
}) => {
  if (!authState?.token) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === "function"
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.token}`,
      },
    },
  });
};

export const getClient = (apiUrl: string, appToken: string) => {
  token = appToken;

  if (client) {
    return client;
  }

  client = createClient({
    url: apiUrl!,
    requestPolicy: "network-only", // On SSR, Vercel uses client cache in consecutive requests, so we need network-only to always return fresh data from Saleor
    exchanges: [
      authExchange({
        getAuth: async () => ({ token }),
        addAuthToOperation,
      }),
      fetchExchange,
    ],
  });

  return client;
};
