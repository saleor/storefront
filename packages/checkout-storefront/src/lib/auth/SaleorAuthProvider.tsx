import { createSafeContext } from "@/checkout-storefront/providers/createSafeContext";
import { PropsWithChildren } from "react";
import invariant from "ts-invariant";
import { SaleorAuthClient } from "./SaleorAuthClient";

interface SaleorAuthContextConsumerProps {
  logout: () => void;
  isAuthenticating: boolean;
}

const [useAuthProvider, Provider] = createSafeContext<SaleorAuthContextConsumerProps>();
export { useAuthProvider };

interface SaleorAuthProviderProps {
  client: SaleorAuthClient;
  isAuthenticating: boolean;
}

export const SaleorAuthProvider = ({
  children,
  client,
  isAuthenticating,
}: PropsWithChildren<SaleorAuthProviderProps>) => {
  invariant(
    client,
    "Missing Saleor Auth Client - are you sure you created it using useSaleorAuthClient?"
  );

  const { logout } = client;

  return <Provider value={{ isAuthenticating, logout }}>{children}</Provider>;
};
