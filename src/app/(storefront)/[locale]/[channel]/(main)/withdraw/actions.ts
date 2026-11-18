"use server";

import { advanceWithdrawal } from "@/lib/withdrawals/flow";
import type { WithdrawState } from "@/lib/withdrawals/flow-types";

/**
 * One step of the withdraw flow. Works without JavaScript: everything the step needs is in
 * `formData`, so the previous state is never read.
 */
export async function withdrawAction(_previous: WithdrawState, formData: FormData): Promise<WithdrawState> {
	return advanceWithdrawal(formData);
}
