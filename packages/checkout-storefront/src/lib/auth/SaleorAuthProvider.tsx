import { SaleorAuthClient } from "./SaleorAuthClient";
import { UseSaleorAuthClient } from "./useSaleorAuthClient";
import { createSafeContext } from "@/checkout-storefront/providers/createSafeContext";
import { PropsWithChildren } from "react";
import invariant from "ts-invariant";

type SaleorAuthContextConsumerProps = Pick<UseSaleorAuthClient, "isAuthenticating"> &
  Omit<SaleorAuthClient, "fetchWithAuth" | "cleanup">;

const [useSaleorAuthContext, Provider] = createSafeContext<SaleorAuthContextConsumerProps>();
export { useSaleorAuthContext };

export const SaleorAuthProvider = ({
  children,
  saleorAuthClient,
  isAuthenticating,
}: PropsWithChildren<UseSaleorAuthClient>) => {
  invariant(
    saleorAuthClient,
    "Missing Saleor Auth Client - are you sure you created it using useSaleorAuthClient?"
  );

  const { signIn, signOut, checkoutSignOut, resetPassword } = saleorAuthClient;

  return (
    <Provider value={{ isAuthenticating, signIn, signOut, checkoutSignOut, resetPassword }}>
      {children}
    </Provider>
  );
};
