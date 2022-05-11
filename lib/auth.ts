import { useApolloClient } from "@apollo/client";
import { useAuth } from "@saleor/sdk";
import { useRouter } from "next/router";

import { usePaths } from "@/lib/paths";

import { useCheckout } from "./providers/CheckoutProvider";

export const useLogout = () => {
  const { logout } = useAuth();
  const { resetCheckoutToken } = useCheckout();
  const router = useRouter();
  const client = useApolloClient();
  const paths = usePaths();

  const onLogout = async () => {
    await logout();
    await resetCheckoutToken();
    await client.resetStore();
    router.push(paths.$url());
  };

  return onLogout;
};

export default useLogout;
