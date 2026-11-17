import "server-only";

import { cache } from "react";

import { resolveLocaleFromSlug } from "@/config/locale";
import { getSessionAccessToken } from "@/lib/auth/session-access-token";
import { isWithdrawalAvailable } from "./availability";
import { getConsumerIp } from "./consumer-ip";
import { getWithdrawalsProvider } from "./index";

/**
 * Which of the signed-in customer's orders get a "Withdraw from contract" link in the account.
 * `none`: the channel has no withdrawal function. `some`: the withdrawal backend listed the orders
 * still open for a withdrawal. `all`: unknown (no backend, or it could not answer), so every order
 * gets the link; a late withdrawal is still accepted and recorded.
 */
type Withdrawable = { kind: "none" } | { kind: "all" } | { kind: "some"; ids: ReadonlySet<string> };

/** An optional link waits at most this long; the page itself never waits (it streams). */
const ACCOUNT_LOOKUP_TIMEOUT_MS = 3_000;

export const getWithdrawableOrders = cache(async (locale: string, channel: string): Promise<Withdrawable> => {
	const input = { locale, channel };
	if (!(await isWithdrawalAvailable(input.channel))) return { kind: "none" };
	const provider = getWithdrawalsProvider({ timeoutMs: ACCOUNT_LOOKUP_TIMEOUT_MS });
	if (provider.kind === "stub") return { kind: "all" };
	const token = await getSessionAccessToken();
	if (!token) return { kind: "all" };
	const result = await provider.lookup(
		{
			channel: input.channel,
			languageCode: resolveLocaleFromSlug(input.locale).bcp47,
			requester: { mode: "customer", customerAccessToken: token },
		},
		{ consumerIp: await getConsumerIp() },
	);
	return result.ok
		? { kind: "some", ids: new Set(result.value.orders.map((order) => order.id)) }
		: { kind: "all" };
});

export function canWithdrawOrder(withdrawable: Withdrawable, orderId: string): boolean {
	return withdrawable.kind === "all" || (withdrawable.kind === "some" && withdrawable.ids.has(orderId));
}
