import { SaleorAuthClient } from "@/checkout-storefront/lib/auth/SaleorAuthClient";
import { UseSaleorAuthClient } from "@/checkout-storefront/lib/auth/useSaleorAuthClient";
import { createSafeContext } from "@/checkout-storefront/providers/createSafeContext";
import { PropsWithChildren } from "react";
import invariant from "ts-invariant";

type SaleorAuthContextConsumerProps = Pick<UseSaleorAuthClient, "isAuthenticating"> &
  Pick<SaleorAuthClient, "signIn" | "signOut" | "checkoutSignOut">;

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

  const { signIn, signOut, checkoutSignOut } = saleorAuthClient;

  return (
    <Provider value={{ isAuthenticating, signIn, signOut, checkoutSignOut }}>{children}</Provider>
  );
};
