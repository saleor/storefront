import { shallow } from "zustand/shallow";
import { useMemo } from "react";
import { memoize, omit } from "lodash-es";
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

export interface CheckoutUpdateStateStore extends CheckoutUpdateState {
	shouldRegisterUser: boolean;
	actions: {
		setChangingBillingCountry: (changingBillingCountry: boolean) => void;
		setSubmitInProgress: (submitInProgress: boolean) => void;
		setShouldRegisterUser: (shouldRegisterUser: boolean) => void;
		setLoadingCheckout: (loading: boolean) => void;
		setUpdateState: (scope: CheckoutUpdateStateScope) => (status: CheckoutUpdateStateStatus) => void;
	};
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
			setShouldRegisterUser: (shouldRegisterUser: boolean) =>
				set({
					shouldRegisterUser,
				}),
			setLoadingCheckout: (loading: boolean) => set({ loadingCheckout: loading }),
			setChangingBillingCountry: (changingBillingCountry: boolean) => set({ changingBillingCountry }),
			setUpdateState: memoize(
				(scope) => (status) =>
					set((state) => {
						return {
							updateState: {
								...state.updateState,
								[scope]: status,
							},
						};
					}),
			),
		},
	}),
	shallow,
);
// useCheckoutUpdateStateStore.subscribe(console.log);

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

export const useCheckoutUpdateStateActions = () =>
	useCheckoutUpdateStateStore(({ actions }) => omit(actions, "setUpdateState"));

export function useCheckoutUpdateStateChange(scope: CheckoutUpdateStateScope): {
	setCheckoutUpdateState: (status: CheckoutUpdateStateStatus) => void;
};

export function useCheckoutUpdateStateChange(scope: undefined): {
	setCheckoutUpdateState: () => void;
};

export function useCheckoutUpdateStateChange(scope?: CheckoutUpdateStateScope) {
	return useCheckoutUpdateStateStore(({ actions: { setUpdateState } }) => ({
		setCheckoutUpdateState: scope ? setUpdateState(scope) : () => {},
	}));
}
