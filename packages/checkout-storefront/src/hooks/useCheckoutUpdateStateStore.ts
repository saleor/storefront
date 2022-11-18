import create from "zustand";
import { CheckoutScope } from "@/checkout-storefront/hooks/useAlerts";

export type CheckoutUpdateStateStatus = "success" | "loading" | "error";

export type CheckoutUpdateStateScope =
  | Extract<
      CheckoutScope,
      | "checkoutShippingUpdate"
      | "checkoutCustomerAttach"
      | "checkoutAddPromoCode"
      | "checkoutDeliveryMethodUpdate"
      | "checkoutEmailUpdate"
      | "checkoutBillingUpdate"
      | "checkoutLinesUpdate"
    >
  | "checkoutFetch";

interface CheckoutUpdateStateStore {
  loadingCheckout: boolean;
  setLoadingCheckout: (loading: boolean) => void;
  updateState: Record<CheckoutUpdateStateScope, CheckoutUpdateStateStatus>;
  setUpdateState: (scope: CheckoutUpdateStateScope) => (status: CheckoutUpdateStateStatus) => void;
}

export const useCheckoutUpdateStateStore = create<CheckoutUpdateStateStore>((set) => ({
  loadingCheckout: false,
  setLoadingCheckout: (loading: boolean) => set(() => ({ loadingCheckout: loading })),

  updateState: {
    checkoutShippingUpdate: "success",
    checkoutCustomerAttach: "success",
    checkoutBillingUpdate: "success",
    checkoutAddPromoCode: "success",
    checkoutDeliveryMethodUpdate: "success",
    checkoutLinesUpdate: "success",
    checkoutEmailUpdate: "success",
    checkoutFetch: "success",
  },
  setUpdateState: (scope) => (status) =>
    set((state) => ({ updateState: { ...state.updateState, [scope]: status } })),
}));
