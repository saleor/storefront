import { encryptSetting } from "@/saleor-app-checkout/backend/configuration/encryption";
import { TransactionFragment } from "@/saleor-app-checkout/graphql";
import { testingVars } from "../consts";

export const paymentProviders = {
  mollie: {
    apiKey: encryptSetting(testingVars.mollieKey),
    profileId: {
      encrypted: false,
      value: testingVars.mollieProfileId,
    },
    completedOrderId: "ord_kr6ltl",
  },
  adyen: {
    merchantAccount: {
      encrypted: false,
      value: testingVars.adyenMerchantAccount,
    },
    clientKey: {
      encrypted: false,
      value: testingVars.adyenClientKey,
    },
    apiKey: encryptSetting(testingVars.adyenApiKey),
    hmac: encryptSetting(testingVars.adyenHmac),
    password: encryptSetting(testingVars.adyenWebhookPassword),
    username: encryptSetting(testingVars.adyenWebhookUsername),
  },
};

export const appPrivateMetafields = {
  paymentProviders,
};

export const prepareSaleorTransaction = (
  type: "voided" | "charged" | "authorized" | "refunded",
  amount: number,
  currency: string,
  additionalData?: Partial<TransactionFragment>
): TransactionFragment => {
  const common: Pick<
    TransactionFragment,
    "voidedAmount" | "chargedAmount" | "authorizedAmount" | "refundedAmount"
  > = {
    refundedAmount: {
      amount: 0,
      currency,
    },
    authorizedAmount: { amount: 0, currency },
    chargedAmount: { amount: 0, currency },
    voidedAmount: { amount: 0, currency },
  };

  const amounts = { ...common };

  switch (type) {
    case "authorized":
      amounts.authorizedAmount.amount = amount;
      break;
    case "charged":
      amounts.chargedAmount.amount = amount;
      break;
    case "refunded":
      amounts.refundedAmount.amount = amount;
      break;
    case "voided":
      amounts.voidedAmount.amount = amount;
      break;
  }

  return {
    ...amounts,
    reference: "123",
    events: [],
    id: "123",
    ...additionalData,
  };
};
