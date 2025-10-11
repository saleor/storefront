import { createWithEqualityFn } from "zustand/traditional";

import { shallow } from "zustand/shallow";

export type CheckoutFormScope = "shippingAddress" | "billingAddress" | "guestUser";
type CheckoutFormValidationStatus = "valid" | "invalid" | "validating";

export type ValidationState = Record<CheckoutFormScope, CheckoutFormValidationStatus>;

export type CheckoutValidationState = {
	validationState: ValidationState;
};

interface UseCheckoutValidationStateStore extends CheckoutValidationState {
	actions: {
		validateAllForms: (signedIn: boolean, isShippingRequired?: boolean) => void;
		setValidationState: (scope: CheckoutFormScope, status: CheckoutFormValidationStatus) => void;
	};
}

const useCheckoutValidationStateStore = createWithEqualityFn<UseCheckoutValidationStateStore>(
	(set) => ({
		validationState: { shippingAddress: "valid", guestUser: "valid", billingAddress: "valid" },
		actions: {
			validateAllForms: (signedIn: boolean, isShippingRequired: boolean = true) =>
				set((state) => {
					const keysToValidate = Object.keys(state.validationState).filter((val) => {
						// Skip guest user validation if user is signed in
						if (signedIn && val === "guestUser") return false;
						// Skip shipping address validation if shipping is not required
						if (!isShippingRequired && val === "shippingAddress") return false;
						return true;
					}) as CheckoutFormScope[];

					// Start with current state
					const newValidationState = { ...state.validationState };

					// Set validating for forms that need validation
					keysToValidate.forEach((key) => {
						newValidationState[key] = "validating";
					});

					// Ensure shipping address is valid if not required
					if (!isShippingRequired) {
						newValidationState.shippingAddress = "valid";
					}

					return {
						validationState: newValidationState,
					};
				}),
			setValidationState: (scope: CheckoutFormScope, status: CheckoutFormValidationStatus) =>
				set((state) => ({
					validationState: { ...state.validationState, [scope]: status },
				})),
		},
	}),
	shallow,
);

export const useCheckoutValidationActions = () => useCheckoutValidationStateStore((state) => state.actions);

export const useCheckoutValidationState = (): CheckoutValidationState =>
	useCheckoutValidationStateStore(({ validationState }) => ({
		validationState,
	}));
