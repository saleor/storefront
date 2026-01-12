import { shallow } from "zustand/shallow";
import { useCallback, useMemo } from "react";
import { createWithEqualityFn } from "zustand/traditional";
import { type CheckoutScope } from "@/checkout/hooks/useAlerts";

export type CheckoutUpdateStateStatus = "success" | "loading" | "error";

export type CheckoutUpdateStateScope = Exclude<CheckoutScope, "checkoutPay" | "checkoutFinalize">;

export interface CheckoutUpdateState {
	loadingCheckout: boolean;
	updateState: Record<CheckoutUpdateStateScope, CheckoutUpdateStateStatus>;
	submitInProgress: boolean;
	changingBillingCountry: boolean;
}

/** Public actions exposed via useCheckoutUpdateStateActions */
interface PublicActions {
	setChangingBillingCountry: (changingBillingCountry: boolean) => void;
	setSubmitInProgress: (submitInProgress: boolean) => void;
	setShouldRegisterUser: (shouldRegisterUser: boolean) => void;
	setLoadingCheckout: (loading: boolean) => void;
}

interface InternalActions {
	setUpdateState: (scope: CheckoutUpdateStateScope, status: CheckoutUpdateStateStatus) => void;
}

export interface CheckoutUpdateStateStore extends CheckoutUpdateState {
	shouldRegisterUser: boolean;
	actions: PublicActions;
	internal: InternalActions;
}

const useCheckoutUpdateStateStore = createWithEqualityFn<CheckoutUpdateStateStore>(
	(set) => ({
		shouldRegisterUser: false,
		submitInProgress: false,
		loadingCheckout: false,
		changingBillingCountry: false,
		updateState: {
			paymentGatewaysInitialize: "success",
			checkoutShippingUpdate: "success",
			checkoutCustomerAttach: "success",
			checkoutBillingUpdate: "success",
			checkoutAddPromoCode: "success",
			checkoutDeliveryMethodUpdate: "success",
			checkoutLinesUpdate: "success",
			checkoutEmailUpdate: "success",
			userRegister: "success",
			resetPassword: "success",
			signIn: "success",
			requestPasswordReset: "success",
			checkoutLinesDelete: "success",
			userAddressCreate: "success",
			userAddressDelete: "success",
			userAddressUpdate: "success",
		},
		actions: {
			setSubmitInProgress: (submitInProgress: boolean) => set({ submitInProgress }),
			setShouldRegisterUser: (shouldRegisterUser: boolean) => set({ shouldRegisterUser }),
			setLoadingCheckout: (loading: boolean) => set({ loadingCheckout: loading }),
			setChangingBillingCountry: (changingBillingCountry: boolean) => set({ changingBillingCountry }),
		},
		internal: {
			setUpdateState: (scope, status) =>
				set((state) => ({
					updateState: { ...state.updateState, [scope]: status },
				})),
		},
	}),
	shallow,
);

export const useCheckoutUpdateState = (): CheckoutUpdateState => {
	const { updateState, loadingCheckout, submitInProgress, changingBillingCountry } =
		useCheckoutUpdateStateStore(
			({ updateState, loadingCheckout, submitInProgress, changingBillingCountry }) => ({
				changingBillingCountry,
				updateState,
				loadingCheckout,
				submitInProgress,
			}),
		);

	return { updateState, loadingCheckout, submitInProgress, changingBillingCountry };
};

export const useUserRegisterState = () => {
	const shouldUserRegister = useCheckoutUpdateStateStore((state) => state.shouldRegisterUser);
	return useMemo(() => shouldUserRegister, [shouldUserRegister]);
};

/** Returns stable action references (no re-render on state changes) */
export const useCheckoutUpdateStateActions = () => useCheckoutUpdateStateStore((state) => state.actions);

export function useCheckoutUpdateStateChange(scope: CheckoutUpdateStateScope): {
	setCheckoutUpdateState: (status: CheckoutUpdateStateStatus) => void;
};

export function useCheckoutUpdateStateChange(scope: undefined): {
	setCheckoutUpdateState: () => void;
};

export function useCheckoutUpdateStateChange(scope?: CheckoutUpdateStateScope) {
	const setUpdateState = useCheckoutUpdateStateStore((state) => state.internal.setUpdateState);

	// Create stable callback that curries the scope
	const setCheckoutUpdateState = useCallback(
		(status: CheckoutUpdateStateStatus) => {
			if (scope) setUpdateState(scope, status);
		},
		[scope, setUpdateState],
	);

	return { setCheckoutUpdateState: scope ? setCheckoutUpdateState : () => {} };
}
