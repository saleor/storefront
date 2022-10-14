import { CreatePaymentData, CreatePaymentResult } from "../../types";

export const createDummyPayment = async ({
  redirectUrl,
}: Pick<CreatePaymentData, "redirectUrl">): Promise<CreatePaymentResult> => {
  return {
    url: redirectUrl,
    id: "",
  };
};
