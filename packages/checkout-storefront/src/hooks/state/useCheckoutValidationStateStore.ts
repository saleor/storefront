import create from "zustand";
import shallow from "zustand/shallow";

export type CheckoutFormScope = "shippingAddress" | "billingAddress" | "guestUser";
type CheckoutFormValidationStatus = "valid" | "invalid";

interface UseCheckoutValidationStateStore {
  validating: boolean;
  validationState: Record<CheckoutFormScope, CheckoutFormValidationStatus>;
  actions: {
    validateAllForms: () => void;
    setValidationState: (scope: CheckoutFormScope, status: CheckoutFormValidationStatus) => void;
  };
}

const useCheckoutValidationStateStore = create<UseCheckoutValidationStateStore>((set) => ({
  validating: false,
  validationState: { shippingAddress: "valid", guestUser: "valid", billingAddress: "valid" },
  actions: {
    validateAllForms: () => set(() => ({ validating: true })),
    setValidationState: (scope: CheckoutFormScope, status: CheckoutFormValidationStatus) =>
      set((state) => ({ validationState: { ...state.validationState, [scope]: status } })),
  },
}));

export const useCheckoutValidationActions = () =>
  useCheckoutValidationStateStore((state) => state.actions);

export const useCheckoutValidationState = () =>
  useCheckoutValidationStateStore(
    ({ validating, validationState }) => ({ validating, validationState }),
    shallow
  );
