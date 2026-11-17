import "server-only";

import { withdrawalFunctionByChannel } from "@/config/withdrawals";
import { isEuEeaChannel } from "@/lib/channels/get-price-display";

/**
 * Whether the channel shows the withdrawal function: the override in `src/config/withdrawals.ts`,
 * else channels that ship to the EU or EEA (the test behind the prior-price rule).
 */
export async function isWithdrawalAvailable(channel: string): Promise<boolean> {
	const override = withdrawalFunctionByChannel[channel];
	if (override !== undefined) return override;
	// When Paper cannot tell (no shipping zones and no readable default country, so a store set up
	// incompletely), it shows the function: hiding a legal duty by mistake is worse than offering
	// it where the law does not ask for it.
	return isEuEeaChannel(channel);
}
