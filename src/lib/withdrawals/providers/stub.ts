import type { WithdrawalsProvider } from "../provider";

/**
 * Nothing can be looked up or recorded. The withdraw screens detect this provider and end in an
 * email to the seller, which is not a withdrawal function on its own.
 */
export const stubWithdrawalsProvider: WithdrawalsProvider = {
	kind: "stub",
	lookup: async () => ({
		ok: false,
		error: { code: "UNAVAILABLE", message: "No withdrawal backend configured" },
	}),
	submit: async () => ({
		ok: false,
		error: { code: "UNAVAILABLE", message: "No withdrawal backend configured" },
	}),
};
