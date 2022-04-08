import { isSsr } from "@/constants";
import { useMemo } from "react";
import { OperationContext } from "urql";
import { useApp } from "./useApp";

export const useAuthContext = (): Partial<OperationContext> | undefined => {
  const app = useApp();
  const appState = app?.getState();
  const token = appState?.token;
  // Use memo to fix urql bug https://github.com/FormidableLabs/urql/issues/805
  const fetchContext = useMemo(
    () =>
      !isSsr && token
        ? {
            fetchOptions: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        : {},
    [token]
  );

  return fetchContext;
};
