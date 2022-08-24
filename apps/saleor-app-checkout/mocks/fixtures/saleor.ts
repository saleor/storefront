import { encryptSetting } from "@/saleor-app-checkout/backend/configuration/encryption";
import {
  TransactionActionPayloadFragment,
  TransactionFragment,
} from "@/saleor-app-checkout/graphql";
import { PaymentProviderSettingsValues } from "@/saleor-app-checkout/types";
import { testingVars } from "../consts";

export const mollieCompletedOrderId = "ord_kr6ltl";

export const paymentProviders: PaymentProviderSettingsValues<"encrypted"> = {
  mollie: {
    apiKey: encryptSetting(testingVars.mollieKey),
    profileId: {
      encrypted: false,
      value: testingVars.mollieProfileId,
    },
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
  stripe: {
    secretKey: encryptSetting(testingVars.stripeSecretKey),
    webhookSecret: encryptSetting(testingVars.stripeWebhookSecret),
    publishableKey: {
      encrypted: false,
      value: testingVars.stripePublishableKey,
    },
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

export const transactionActionRequest: Record<
  "missingData" | "adyenRefund" | "mollieRefund",
  Partial<TransactionActionPayloadFragment>
> = {
  missingData: {
    transaction: undefined,
    action: undefined,
  },
  adyenRefund: {
    transaction: {
      id: "VHJhbnNhY3Rpb25JdGVtOjE3OA==",
      reference: "LD65H2FVNXSKGK82",
      type: "adyen-mc",
      authorizedAmount: {
        amount: 0,
        currency: "USD",
      },
      chargedAmount: {
        amount: 42.92,
      },
      voidedAmount: {
        amount: 0,
      },
      refundedAmount: {
        amount: 0,
      },
    },
    action: {
      actionType: "REFUND",
      amount: 4.31,
    },
  },
  mollieRefund: {
    transaction: {
      id: "VHJhbnNhY3Rpb25JdGVtOjE3Mg==",
      reference: "ord_kr6ltl",
      type: "mollie-creditcard",
      authorizedAmount: {
        amount: 0,
        currency: "USD",
      },
      chargedAmount: {
        amount: 21.67,
      },
      voidedAmount: {
        amount: 0,
      },
      refundedAmount: {
        amount: 0,
      },
    },
    action: {
      actionType: "REFUND",
      amount: 38.61,
    },
  },
};
