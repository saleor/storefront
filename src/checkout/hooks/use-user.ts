import { useCheckoutUser } from "@/checkout/providers/checkout-user";

/** Customer session — server-hydrated, refreshed via router.refresh() after sign-in. */
export const useUser = () => useCheckoutUser();
