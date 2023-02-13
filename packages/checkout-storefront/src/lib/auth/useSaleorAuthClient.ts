import {
  SaleorAuthClient,
  SaleorAuthClientProps,
} from "@/checkout-storefront/lib/auth/SaleorAuthClient";
import { useMemo, useState } from "react";

export const useSaleorAuthClient = ({ saleorApiUrl, storage }: SaleorAuthClientProps) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const saleorAuthClient = useMemo(
    () => new SaleorAuthClient({ storage, saleorApiUrl, onAuthRefresh: setIsAuthenticating }),
    [storage, saleorApiUrl]
  );

  return { saleorAuthClient, isAuthenticating };
};
