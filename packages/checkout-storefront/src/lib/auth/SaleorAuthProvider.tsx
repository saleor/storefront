import { Fetch } from "./types";
import { createSafeContext } from "@/checkout-storefront/providers/createSafeContext";
import { PropsWithChildren, useState } from "react";
import invariant from "ts-invariant";
import { SaleorAuthClient } from "./SaleorAuthClient";

interface SaleorAuthContextConsumerProps {
  fetchWithAuth: Fetch;
  logout: () => void;
  isAuthenticating: boolean;
}

const [useAuthProvider, Provider] = createSafeContext<SaleorAuthContextConsumerProps>();
export { useAuthProvider };

interface SaleorAuthProviderProps {
  saleorApiUrl: string;
}

export const SaleorAuthProvider = ({
  children,
  saleorApiUrl,
}: PropsWithChildren<SaleorAuthProviderProps>) => {
  invariant(saleorApiUrl, "Missing Saleor Api Url");

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const { fetchWithAuth, logout } = new SaleorAuthClient({
    onAuthRefresh: setIsAuthenticating,
    saleorApiUrl,
  });

  return <Provider value={{ isAuthenticating, fetchWithAuth, logout }}>{children}</Provider>;
};
