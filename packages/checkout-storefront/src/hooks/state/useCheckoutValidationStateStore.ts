import { CustomError } from "@/checkout-storefront/hooks/useAlerts";
import create from "zustand";

interface UseCheckoutValidationStateStore {
  validating: boolean;
  errors: CustomError[];
  actions: {
    validateAllForms: (validate: boolean) => void;
    setErrors: (errors: CustomError[]) => void;
  };
}

const useCheckoutValidationStateStore = create<UseCheckoutValidationStateStore>((set) => ({
  validating: false,
  errors: [],
  actions: {
    validateAllForms: (validating: boolean) => set(() => ({ validating })),
    setErrors: (errors: CustomError[]) =>
      set((state) => ({
        validateAllForms: false,
        errors: [...state.errors, ...errors],
      })),
  },
}));

export const useCheckoutValidationActions = () =>
  useCheckoutValidationStateStore((state) => state.actions);

export const useCheckoutValidationState = () =>
  useCheckoutValidationStateStore((state) => state.validating);
