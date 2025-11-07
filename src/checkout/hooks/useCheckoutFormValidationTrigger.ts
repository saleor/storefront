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
			// If still validating after 1 second, force validation to complete
			validationTimeoutRef.current = setTimeout(() => {
				console.warn(`[VALIDATION TIMEOUT] ${scope} stuck in validating state for >1s, forcing completion`, {
					skip,
					hasForm: !!form,
					formValues: form?.values,
				});

				if (skip) {
					console.warn(`[VALIDATION TIMEOUT] Skipping validation for ${scope}, setting to valid`);
					setValidationState(scope, "valid");
				} else if (form) {
					console.warn(`[VALIDATION TIMEOUT] Re-running validation for ${scope}`);
					void setCheckoutFormValidationState(form);
				} else {
					console.error(`[VALIDATION TIMEOUT] No form available for ${scope}, setting to valid as fallback`);
					setValidationState(scope, "valid");
				}
			}, 1000); // Reduced to 1 second for faster recovery
		}

		return () => {
			if (validationTimeoutRef.current) {
				clearTimeout(validationTimeoutRef.current);
				validationTimeoutRef.current = null;
			}
		};
	}, [validating, scope, skip, setValidationState, setCheckoutFormValidationState, form]);
};
