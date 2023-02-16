import { SaleorAuthClient, SaleorAuthClientProps } from "./SaleorAuthClient";
import { useEffect, useMemo, useState } from "react";

export interface UseSaleorAuthClient {
  saleorAuthClient: SaleorAuthClient;
  isAuthenticating: boolean;
}

/**
 * This hook should be used only once per application.
 * @see Use {@link useSaleorAuthContext} for accessing the auth state.
 */

export const useSaleorAuthClient = ({
  saleorApiUrl,
  storage,
  onAuthRefresh,
}: SaleorAuthClientProps): UseSaleorAuthClient => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const saleorAuthClient = useMemo(
    () =>
      new SaleorAuthClient({
        storage,
        saleorApiUrl,
        onAuthRefresh: (value) => {
          setIsAuthenticating(value);
          onAuthRefresh?.(value);
        },
      }),
    [storage, saleorApiUrl, onAuthRefresh]
  );

  useEffect(
    () => () => {
      saleorAuthClient.cleanup();
    },
    []
  );

  return { saleorAuthClient, isAuthenticating };
};
