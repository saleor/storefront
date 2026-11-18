import "server-only";

import type { WithdrawalsProvider } from "./provider";
import { stubWithdrawalsProvider } from "./providers/stub";

export type { WithdrawalsProvider, WithdrawalsResult } from "./provider";
export * from "./types";

/**
 * The provider behind the /withdraw screens. Paper ships only `stub`: nothing is recorded, and
 * the screens end in "Send your withdrawal by email". A backend that records withdrawals and
 * sends the receipt plugs in here by implementing `WithdrawalsProvider` (`./provider.ts`); the
 * screens, the account links and the order lookups already work with any provider.
 */
export function getWithdrawalsProvider(_options: { timeoutMs?: number } = {}): WithdrawalsProvider {
	return stubWithdrawalsProvider;
}
