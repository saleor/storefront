import { PaymentMethodID, PaymentProviderID } from "checkout-common";
import create from "zustand";

export interface SelectedPaymentData {
  paymentMethod: PaymentMethodID;
  paymentProvider: PaymentProviderID;
}

interface UsePaymentMethodsStore {
  paymentMethod: PaymentMethodID | null;
  paymentProvider: PaymentProviderID | null;
  actions: {
    setPaymentData: (paymentData: SelectedPaymentData) => void;
  };
}

const usePaymentMethodsStore = create<UsePaymentMethodsStore>((set) => ({
  paymentMethod: null,
  paymentProvider: null,
  actions: {
    setPaymentData: ({ paymentMethod, paymentProvider }) =>
      set(() => ({ paymentMethod, paymentProvider })),
  },
}));

export const useSelectedPaymentData = () =>
  usePaymentMethodsStore(({ paymentMethod, paymentProvider }) => ({
    paymentMethod,
    paymentProvider,
  }));

export const useSetSelectedPaymentData = () =>
  usePaymentMethodsStore((state) => state.actions.setPaymentData);
