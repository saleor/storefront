import { envVars } from "@/checkout-app/constants";
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
import { app } from "./app";

interface AuthState {
  token: string;
}

const getAuth = async ({ authState }: { authState?: AuthState | null }) => {
  if (!authState) {
    const token = app?.getState().token;

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

const willAuthError = ({ authState }: { authState?: AuthState | null }) =>
  !authState?.token;

const authConfig: ClientOptions = {
  url: envVars.apiUrl,
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      getAuth,
      willAuthError,
      addAuthToOperation,
    }),
    fetchExchange,
  ],
};

export const client = createClient(authConfig);
