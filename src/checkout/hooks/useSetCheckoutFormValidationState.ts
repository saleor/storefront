import { useCallback } from "react";
import { type FormDataBase, hasErrors, type UseFormReturn } from "@/checkout/hooks/useForm";
import {
	type CheckoutFormScope,
	useCheckoutValidationActions,
} from "@/checkout/state/checkoutValidationStateStore";
import { useAlerts } from "@/checkout/hooks/useAlerts";

export const useSetCheckoutFormValidationState = (scope: CheckoutFormScope) => {
	const { setValidationState } = useCheckoutValidationActions();
	const { showCustomErrors } = useAlerts();

	const setCheckoutFormValidationState = useCallback(
		async <TData extends FormDataBase>({
			validateForm,
			setTouched,
			values,
		}: Pick<UseFormReturn<TData>, "validateForm" | "setTouched" | "values">) => {
			const formErrors = validateForm(values);

			if (!hasErrors(formErrors)) {
				setValidationState(scope, "valid");
				return;
			}

			await setTouched(Object.keys(formErrors).reduce((result, key) => ({ ...result, [key]: true }), {}));

			// Show toast notifications for Cortex-related validation errors
			if (scope === "guestUser") {
				const cortexErrors: string[] = [];

				if (formErrors.cortexCloudUsername) {
					cortexErrors.push(formErrors.cortexCloudUsername as string);
				}

				if (formErrors.cortexFollowConfirmed) {
					cortexErrors.push(formErrors.cortexFollowConfirmed as string);
				}

				// Show toast for Cortex errors
				if (cortexErrors.length > 0) {
					showCustomErrors(
						cortexErrors.map((message) => ({ message }))
					);
				}
			}

			setValidationState(scope, "invalid");
		},
		[scope, setValidationState, showCustomErrors],
	);

	return {
		setCheckoutFormValidationState,
	};
};
