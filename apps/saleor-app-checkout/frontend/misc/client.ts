import { envVars } from "@/saleor-app-checkout/constants";
import { authExchange } from "@urql/exchange-auth";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import {
  createClient,
  makeOperation,
  cacheExchange,
  ClientOptions,
  dedupExchange,
  Operation,
} from "urql";
import { app } from "./app";

interface AuthState {
  token: string;
}

// eslint-disable-next-line require-await
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

const willAuthError = ({ authState }: { authState?: AuthState | null }) => !authState?.token;

const authConfig: ClientOptions = {
  url: envVars.apiUrl,
  exchanges: [
    dedupExchange,
    cacheExchange,
    // TODO: fix urql version mismatch
    // @ts-expect-error
    authExchange({
      getAuth,
      willAuthError,
      // @ts-expect-error
      addAuthToOperation,
    }),
    // @ts-expect-error
    multipartFetchExchange,
  ],
};

export const client = createClient(authConfig);
