import { CreatePaymentResult } from "../../types";

export const createDummyPayment = async (): Promise<CreatePaymentResult> => {
  return {
    url: "/",
    id: "",
  };
};
