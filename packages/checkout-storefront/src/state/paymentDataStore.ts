import { PaymentMethodID, PaymentProviderID } from "checkout-common";
import create from "zustand";

export interface SelectedPaymentData {
  paymentMethod: PaymentMethodID;
  paymentProvider: PaymentProviderID;
}

interface UsePaymentDataStore {
  paymentMethod: PaymentMethodID | null;
  paymentProvider: PaymentProviderID | null;
  actions: {
    setPaymentData: (paymentData: SelectedPaymentData) => void;
  };
}

const usePaymentDataStore = create<UsePaymentDataStore>((set) => ({
  paymentMethod: null,
  paymentProvider: null,
  actions: {
    setPaymentData: ({ paymentMethod, paymentProvider }) => set({ paymentMethod, paymentProvider }),
  },
}));

export const useSelectedPaymentData = () =>
  usePaymentDataStore(({ paymentMethod, paymentProvider }) => ({
    paymentMethod,
    paymentProvider,
  }));

export const usePaymentDataActions = () => usePaymentDataStore((state) => state.actions);
