import { useRouter } from "next/router";

import { usePaths } from "@/lib/paths";

import { useCheckout } from "../providers/CheckoutProvider";
import { useSaleorAuthContext } from "@/lib/auth";

export const useLogout = () => {
  const { signOut } = useSaleorAuthContext();
  const { resetCheckoutToken } = useCheckout();
  const router = useRouter();
  const paths = usePaths();

  const onLogout = async () => {
    signOut();
    resetCheckoutToken();
    void router.push(paths.$url());
  };

  return onLogout;
};

export default useLogout;
