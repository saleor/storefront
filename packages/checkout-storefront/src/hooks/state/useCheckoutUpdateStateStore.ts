import create from "zustand";
import { CheckoutScope } from "@/checkout-storefront/hooks/useAlerts";
import shallow from "zustand/shallow";

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
      | "userRegister"
    >
  | "checkoutFetch";

interface CheckoutUpdateStateStore {
  shouldRegisterUser: boolean;
  loadingCheckout: boolean;
  updateState: Record<CheckoutUpdateStateScope, CheckoutUpdateStateStatus>;
  actions: {
    setLoadingCheckout: (loading: boolean) => void;
    setUpdateState: (
      scope: CheckoutUpdateStateScope
    ) => (status: CheckoutUpdateStateStatus) => void;
  };
}

const useCheckoutUpdateStateStore = create<CheckoutUpdateStateStore>((set) => ({
  shouldRegisterUser: false,
  loadingCheckout: false,
  updateState: {
    checkoutShippingUpdate: "success",
    checkoutCustomerAttach: "success",
    checkoutBillingUpdate: "success",
    checkoutAddPromoCode: "success",
    checkoutDeliveryMethodUpdate: "success",
    checkoutLinesUpdate: "success",
    checkoutEmailUpdate: "success",
    checkoutFetch: "success",
    userRegister: "success",
  },
  actions: {
    setShouldRegisterUser: (shouldRegisterUser: boolean) => ({ shouldRegisterUser }),
    setLoadingCheckout: (loading: boolean) => set(() => ({ loadingCheckout: loading })),
    setUpdateState: (scope) => (status) =>
      set((state) => ({ updateState: { ...state.updateState, [scope]: status } })),
  },
}));

export const useCheckoutUpdateState = () =>
  useCheckoutUpdateStateStore(
    ({ updateState, loadingCheckout }) => ({
      updateState,
      loadingCheckout,
    }),
    shallow
  );

export const useUserRegisterState = () =>
  useCheckoutUpdateStateStore((state) => state.shouldRegisterUser);

export const useCheckoutUpdateStateActions = (
  scope: CheckoutUpdateStateScope | "checkoutLoading"
) =>
  useCheckoutUpdateStateStore(({ actions: { setUpdateState, ...rest } }) => ({
    ...rest,
    setCheckoutUpdateState: setUpdateState(scope as CheckoutUpdateStateScope),
  }));
