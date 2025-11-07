import { useCallback, useEffect, useRef } from "react";
import { type FormDataBase, type UseFormReturn } from "@/checkout/hooks/useForm";
import { useSetCheckoutFormValidationState } from "@/checkout/hooks/useSetCheckoutFormValidationState";
import {
	type CheckoutFormScope,
	useCheckoutValidationActions,
	useCheckoutValidationState,
} from "@/checkout/state/checkoutValidationStateStore";

interface UseCheckoutFormValidationTriggerProps<TData extends FormDataBase> {
	scope: CheckoutFormScope;
	form: UseFormReturn<TData>;
	skip?: boolean;
}

// tells forms to validate once the pay button is clicked
export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>({
	scope,
	form,
	skip = false,
}: UseCheckoutFormValidationTriggerProps<TData>) => {
	const { validationState } = useCheckoutValidationState();
	const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState(scope);
	const { setValidationState } = useCheckoutValidationActions();
	const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const validating = validationState[scope] === "validating";

	const handleGlobalValidationTrigger = useCallback(async () => {
		if (validating) {
			if (skip) {
				// we don't validate this form, so just set valid
				setValidationState(scope, "valid");
				return;
			}

			void setCheckoutFormValidationState(form);
		}
	}, [form, scope, setCheckoutFormValidationState, setValidationState, skip, validating]);

	useEffect(() => {
		void handleGlobalValidationTrigger();
	}, [handleGlobalValidationTrigger]);

	// Validation timeout fallback: if validation is stuck in "validating" for too long,
	// force it to complete by re-running validation. This prevents soft-locks when
	// components unmount/remount during validation (e.g., user signs in mid-checkout).
	useEffect(() => {
		// Clear any existing timeout
		if (validationTimeoutRef.current) {
			clearTimeout(validationTimeoutRef.current);
			validationTimeoutRef.current = null;
		}

		if (validating) {
			// If still validating after 2 seconds, force validation to complete
			validationTimeoutRef.current = setTimeout(() => {
				console.warn(`[VALIDATION TIMEOUT] ${scope} stuck in validating state, forcing completion`);

				if (skip) {
					setValidationState(scope, "valid");
				} else {
					void setCheckoutFormValidationState(form);
				}
			}, 2000);
		}

		return () => {
			if (validationTimeoutRef.current) {
				clearTimeout(validationTimeoutRef.current);
				validationTimeoutRef.current = null;
			}
		};
	}, [validating, scope, skip, setValidationState, setCheckoutFormValidationState, form]);
};
