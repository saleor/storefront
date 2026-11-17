import type { LookupRequest, LookupResponse, SubmitRequest, SubmitResponse, WithdrawalError } from "./types";

export type WithdrawalsResult<T> = { ok: true; value: T } | { ok: false; error: WithdrawalError };

export type WithdrawalsCallContext = {
	/** The consumer's IP as Paper's server saw it, or "unknown". */
	consumerIp: string;
};

/**
 * Where withdrawals go. A `backend` provider looks orders up, records the withdrawal and sends
 * the receipt; `stub` records nothing, and the screens end in an email to the seller instead.
 */
export interface WithdrawalsProvider {
	readonly kind: "backend" | "stub";
	lookup(request: LookupRequest, context: WithdrawalsCallContext): Promise<WithdrawalsResult<LookupResponse>>;
	submit(request: SubmitRequest, context: WithdrawalsCallContext): Promise<WithdrawalsResult<SubmitResponse>>;
}
