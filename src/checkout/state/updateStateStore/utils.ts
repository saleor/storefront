import { type CheckoutUpdateState } from "@/checkout/state/updateStateStore/updateStateStore";

export const areAnyRequestsInProgress = ({ updateState }: CheckoutUpdateState) =>
	Object.values(updateState).some((status) => status === "loading");

export const hasFinishedApiChangesWithNoError = ({ updateState }: CheckoutUpdateState) =>
	!areAnyRequestsInProgress({ updateState } as CheckoutUpdateState) &&
	Object.values(updateState).every((status) => status === "success");
