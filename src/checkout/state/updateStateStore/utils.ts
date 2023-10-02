import { type CheckoutUpdateState } from "@/checkout/state/updateStateStore/updateStateStore";

export const areAnyRequestsInProgress = ({ updateState, loadingCheckout }: CheckoutUpdateState) =>
	Object.values(updateState).some((status) => status === "loading") || loadingCheckout;

export const hasFinishedApiChangesWithNoError = ({ updateState, ...rest }: CheckoutUpdateState) =>
	!areAnyRequestsInProgress({ updateState, ...rest }) &&
	Object.values(updateState).every((status) => status === "success");
