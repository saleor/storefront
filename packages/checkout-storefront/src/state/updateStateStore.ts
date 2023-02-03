import create from "zustand";
import { CheckoutScope } from "@/checkout-storefront/hooks/useAlerts";
import shallow from "zustand/shallow";
import { useMemo } from "react";
import { memoize, omit } from "lodash-es";

export type CheckoutUpdateStateStatus = "success" | "loading" | "error";

export type CheckoutUpdateStateScope = Exclude<CheckoutScope, "checkoutPay" | "checkoutFinalize">;

interface CheckoutUpdateStateStore {
  shouldRegisterUser: boolean;
  submitInProgress: boolean;
  loadingCheckout: boolean;
  updateState: Record<CheckoutUpdateStateScope, CheckoutUpdateStateStatus>;
  actions: {
    setSubmitInProgress: (submitInProgress: boolean) => void;
    setShouldRegisterUser: (shouldRegisterUser: boolean) => void;
    setLoadingCheckout: (loading: boolean) => void;
    setUpdateState: (
      scope: CheckoutUpdateStateScope
    ) => (status: CheckoutUpdateStateStatus) => void;
  };
}

const useCheckoutUpdateStateStore = create<CheckoutUpdateStateStore>((set) => ({
  shouldRegisterUser: false,
  submitInProgress: false,
  loadingCheckout: false,
  updateState: {
    checkoutShippingUpdate: "success",
    checkoutCustomerAttach: "success",
    checkoutBillingUpdate: "success",
    checkoutAddPromoCode: "success",
    checkoutDeliveryMethodUpdate: "success",
    checkoutLinesUpdate: "success",
    checkoutEmailUpdate: "success",
    userRegister: "success",
    resetPassword: "success",
    signIn: "success",
    requestPasswordReset: "success",
    checkoutLinesDelete: "success",
    userAddressCreate: "success",
    userAddressDelete: "success",
    userAddressUpdate: "success",
  },
  actions: {
    setSubmitInProgress: (submitInProgress: boolean) => set({ submitInProgress }),
    setShouldRegisterUser: (shouldRegisterUser: boolean) =>
      set({
        shouldRegisterUser,
      }),
    setLoadingCheckout: (loading: boolean) => set({ loadingCheckout: loading }),
    setUpdateState: memoize(
      (scope) => (status) =>
        set((state) => ({
          updateState: {
            ...state.updateState,
            [scope]: status,
          },
          // checkout will reload right after, this ensures there
          // are no rerenders in between where there's no state updating
          // also we might not need this once we get better caching
          loadingCheckout: status === "success" || state.loadingCheckout,
        }))
    ),
  },
}));

export const useCheckoutUpdateState = () => {
  const { updateState, loadingCheckout, submitInProgress } = useCheckoutUpdateStateStore(
    ({ updateState, loadingCheckout, submitInProgress }) => ({
      updateState,
      loadingCheckout,
      submitInProgress,
    }),
    shallow
  );

  return { updateState, loadingCheckout, submitInProgress };
};

export const useUserRegisterState = () => {
  const shouldUserRegister = useCheckoutUpdateStateStore((state) => state.shouldRegisterUser);
  return useMemo(() => shouldUserRegister, [shouldUserRegister]);
};

export const useCheckoutUpdateStateActions = () =>
  useCheckoutUpdateStateStore(({ actions }) => omit(actions, "setUpdateState"));

export const useCheckoutUpdateStateChange = (scope: CheckoutUpdateStateScope) =>
  useCheckoutUpdateStateStore(({ actions: { setUpdateState } }) => ({
    setCheckoutUpdateState: setUpdateState(scope),
  }));
