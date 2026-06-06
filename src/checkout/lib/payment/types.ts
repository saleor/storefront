import { type PaymentGatewayFragment } from "@/checkout/graphql";

export type PaymentGatewayLike = Pick<PaymentGatewayFragment, "id" | "name">;

export type PaymentSubmitMode = "client" | "server";

/** Result of a payment attempt after billing has been updated. */
export type PaymentResult =
	| { ok: true; orderId: string }
	| {
			ok: false;
			error: string;
			/** Which error bucket in the payment step form state */
			errorKey?: "payment" | "billing";
			fieldErrors?: Record<string, string>;
	  };

export type PaymentContext = {
	checkoutId: string;
	/** Live gross total from Saleor — required so authorization matches checkoutComplete. */
	amount: number;
};

type IntegratedPaymentProvider =
	| { type: "stripe"; gateway: PaymentGatewayLike; submitMode: PaymentSubmitMode }
	| { type: "dummy"; gateway: PaymentGatewayLike; submitMode: PaymentSubmitMode };

/** Which payment integration handles the current checkout. */
export type ResolvedPaymentProvider =
	| IntegratedPaymentProvider
	| { type: "none" }
	| { type: "unsupported"; gateways: ReadonlyArray<PaymentGatewayLike> }
	| { type: "dummy_missing" };

export type TransactionInitializePayload =
	| {
			errors?: ReadonlyArray<{ message?: string | null }> | null;
			transactionEvent?: { type?: string | null; message?: string | null } | null;
			transaction?: { id?: string | null } | null;
			data?: unknown;
	  }
	| null
	| undefined;

export function isIntegratedPaymentProvider(
	provider: ResolvedPaymentProvider,
): provider is IntegratedPaymentProvider {
	return provider.type === "stripe" || provider.type === "dummy";
}
