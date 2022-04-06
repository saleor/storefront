import { authExchange } from "@urql/exchange-auth";
import {
  createClient,
  makeOperation,
  cacheExchange,
  ClientOptions,
  dedupExchange,
  fetchExchange,
  Operation,
} from "urql";
import { API_URL } from "@constants";

interface AuthState {
  token: string;
}

const getAuth =
  (token?: string) =>
  async ({ authState }: { authState?: AuthState | null }) => {
    if (!authState) {
      if (typeof window === "undefined") {
        return null;
      }
      if (token) {
        return { token };
      }
    }

    return null;
  };

const addAuthToOperation = ({
  authState,
  operation,
}: {
  authState?: AuthState | null;
  operation: Operation<any, any>;
}) => {
  if (!authState || !authState.token) {
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

const getAuthConfig = (token?: string): ClientOptions => ({
  url: API_URL,
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      getAuth: getAuth(token),
      addAuthToOperation,
    }),
    fetchExchange,
  ],
});

export const getClient = (token?: string) => createClient(getAuthConfig(token));
