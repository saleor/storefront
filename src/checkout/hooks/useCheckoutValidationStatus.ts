import { useMemo } from "react";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useUser } from "@/checkout/hooks/useUser";
import { type CheckoutStep } from "@/checkout/components/CheckoutProgressIndicator";
import { type ValidationIssue } from "@/checkout/components/CheckoutValidationSummary";

export interface CheckoutValidationStatus {
	isReadyForPayment: boolean;
	steps: CheckoutStep[];
	issues: ValidationIssue[];
	missingRequirements: string[];
}

/**
 * Hook that analyzes the checkout state and returns validation status,
 * steps progress, and actionable issues for the user.
 */
export const useCheckoutValidationStatus = (): CheckoutValidationStatus => {
	const { checkout } = useCheckout();
	const { authenticated } = useUser();

	return useMemo(() => {
		const steps: CheckoutStep[] = [];
		const issues: ValidationIssue[] = [];
		const missingRequirements: string[] = [];

		if (!checkout) {
			return {
				isReadyForPayment: false,
				steps: [],
				issues: [],
				missingRequirements: [],
			};
		}

		// Step 1: Email / Contact Information
		const hasEmail = !!checkout.email;
		const emailStep: CheckoutStep = {
			id: "email",
			label: authenticated ? "Signed in" : "Contact information",
			status: hasEmail ? "complete" : "current",
		};

		if (!hasEmail) {
			emailStep.error = "Email address is required";
			issues.push({
				id: "email-missing",
				message: "Please provide your email address in the contact section",
				severity: "error",
			});
			missingRequirements.push("email");
		}

		steps.push(emailStep);

		// Step 2: Shipping Address (if required)
		if (checkout.isShippingRequired) {
			const hasShippingAddress = !!checkout.shippingAddress;
			const shippingStep: CheckoutStep = {
				id: "shipping",
				label: "Shipping address",
				status: !hasEmail ? "incomplete" : hasShippingAddress ? "complete" : "current",
			};

			if (!hasShippingAddress) {
				shippingStep.error = "Shipping address is required";
				issues.push({
					id: "shipping-missing",
					message: "Please provide a shipping address",
					severity: "error",
				});
				missingRequirements.push("shipping address");
			}

			steps.push(shippingStep);

			// Step 3: Delivery Method (if shipping required)
			const hasDeliveryMethod = !!checkout.deliveryMethod;
			const deliveryStep: CheckoutStep = {
				id: "delivery",
				label: "Delivery method",
				status: !hasShippingAddress ? "incomplete" : hasDeliveryMethod ? "complete" : "current",
			};

			if (!hasDeliveryMethod && hasShippingAddress) {
				deliveryStep.error = "Delivery method is required";
				issues.push({
					id: "delivery-missing",
					message: "Please select a delivery method",
					severity: "error",
				});
				missingRequirements.push("delivery method");
			}

			steps.push(deliveryStep);
		}

		// Step 4: Billing Address
		const hasBillingAddress = !!checkout.billingAddress;
		const prerequisitesComplete = hasEmail && (!checkout.isShippingRequired || checkout.shippingAddress);

		const billingStep: CheckoutStep = {
			id: "billing",
			label: "Billing address",
			status: !prerequisitesComplete ? "incomplete" : hasBillingAddress ? "complete" : "current",
		};

		if (!hasBillingAddress) {
			billingStep.error = "Billing address is required";
			issues.push({
				id: "billing-missing",
				message: "Please provide a billing address",
				severity: "error",
			});
			missingRequirements.push("billing address");
		}

		steps.push(billingStep);

		// Step 5: Payment
		const allPreviousStepsComplete = steps.every((step) => step.status === "complete");
		const paymentStep: CheckoutStep = {
			id: "payment",
			label: "Payment",
			status: allPreviousStepsComplete ? "current" : "incomplete",
		};

		steps.push(paymentStep);

		// Determine if ready for payment
		const isReadyForPayment =
			hasEmail &&
			hasBillingAddress &&
			(!checkout.isShippingRequired || (!!checkout.shippingAddress && !!checkout.deliveryMethod));

		return {
			isReadyForPayment,
			steps,
			issues,
			missingRequirements,
		};
	}, [checkout, authenticated]);
};
