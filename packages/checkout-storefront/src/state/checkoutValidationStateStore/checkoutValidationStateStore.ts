import { create } from "zustand";
import shallow from "zustand/shallow";

export type CheckoutFormScope = "shippingAddress" | "billingAddress" | "guestUser";
type CheckoutFormValidationStatus = "valid" | "invalid" | "validating";

export type ValidationState = Record<CheckoutFormScope, CheckoutFormValidationStatus>;

export type CheckoutValidationState = {
  validationState: ValidationState;
};

interface UseCheckoutValidationStateStore extends CheckoutValidationState {
  actions: {
    validateAllForms: (signedIn: boolean) => void;
    setValidationState: (scope: CheckoutFormScope, status: CheckoutFormValidationStatus) => void;
  };
}

const useCheckoutValidationStateStore = create<UseCheckoutValidationStateStore>((set) => ({
  validationState: { shippingAddress: "valid", guestUser: "valid", billingAddress: "valid" },
  actions: {
    validateAllForms: (signedIn: boolean) =>
      set((state) => {
        const keysToValidate = Object.keys(state.validationState).filter(
          (val) => !signedIn || val !== "guestUser"
        ) as CheckoutFormScope[];

        return {
          validationState: keysToValidate.reduce(
            (result, key) => ({ ...result, [key]: "validating" }),
            {} as ValidationState
          ),
        };
      }),
    setValidationState: (scope: CheckoutFormScope, status: CheckoutFormValidationStatus) =>
      set((state) => ({
        validationState: { ...state.validationState, [scope]: status },
      })),
  },
}));

export const useCheckoutValidationActions = () =>
  useCheckoutValidationStateStore((state) => state.actions);

export const useCheckoutValidationState = (): CheckoutValidationState =>
  useCheckoutValidationStateStore(
    ({ validationState }) => ({
      validationState,
    }),
    shallow
  );
