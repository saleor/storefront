import { TransactionRefund } from "@/saleor-app-checkout/types/refunds";

export async function handleAdyenRefund(refund: TransactionRefund) {
  await new Promise((resolve) => resolve(refund));
  throw new Error("Not implemented");
}
