import type { PaymentMethodID, PaymentProviderID } from "./payments";

type BaseBody = {
  checkoutApiUrl: string;
  provider: PaymentProviderID;
  redirectUrl: string;
  // captureAmount?: number; // support for partial payments
};

export type OrderBody = {
  orderId: string;
} & BaseBody;

export type CheckoutBody = {
  checkoutId: string;
  totalAmount: number;
} & BaseBody;

export type PayRequestBody = OrderBody | CheckoutBody;

export type PaymentStatusResponse = {
  status: "PAID" | "PENDING" | "UNPAID";
  sessionLink?: string;
};

export type ChannelActivePaymentProvidersByChannel = {
  [P in PaymentMethodID]: PaymentProviderID | "";
};
