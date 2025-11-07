import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmptyCartPage } from "../EmptyCartPage";
import { PageNotFound } from "../PageNotFound";
import { useUser } from "../../hooks/useUser";
import { Summary, SummarySkeleton } from "@/checkout/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout/sections/CheckoutForm";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { CheckoutSkeleton } from "@/checkout/views/Checkout/CheckoutSkeleton";
import { useCheckoutValidationActions } from "@/checkout/state/checkoutValidationStateStore/checkoutValidationStateStore";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore/updateStateStore";

export const Checkout = () => {
	const { checkout, fetching: fetchingCheckout } = useCheckout();
	const { loading: isAuthenticating } = useUser();
	const { resetValidationState } = useCheckoutValidationActions();
	const { resetUpdateState } = useCheckoutUpdateStateActions();

	const isCheckoutInvalid = !fetchingCheckout && !checkout && !isAuthenticating;

	const isInitiallyAuthenticating = isAuthenticating && !checkout;

	const isEmptyCart = checkout && !checkout.lines.length;

	// Cleanup state when component unmounts (user navigates away from checkout)
	useEffect(() => {
		return () => {
			console.warn("[CHECKOUT] Component unmounting, resetting checkout state");
			// Reset validation and update states to ensure clean state
			// when user returns to checkout or navigates elsewhere
			resetValidationState();
			resetUpdateState();
		};
	}, [resetValidationState, resetUpdateState]);

	return isCheckoutInvalid ? (
		<PageNotFound />
	) : isInitiallyAuthenticating ? (
		<CheckoutSkeleton />
	) : (
		<ErrorBoundary FallbackComponent={PageNotFound}>
			<div className="page">
				{isEmptyCart ? (
					<EmptyCartPage />
				) : (
					<div className="grid min-h-screen grid-cols-1 gap-x-16 lg:grid-cols-2">
						{/* Mobile: Summary first, Desktop: Form first */}
						<div className="order-2 lg:order-1">
							<Suspense fallback={<CheckoutFormSkeleton />}>
								<CheckoutForm />
							</Suspense>
						</div>
						<div className="order-1 lg:order-2">
							<Suspense fallback={<SummarySkeleton />}>
								<Summary {...checkout} />
							</Suspense>
						</div>
					</div>
				)}
			</div>
		</ErrorBoundary>
	);
};
