import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmptyCartPage } from "../EmptyCartPage";
import { PageNotFound } from "../PageNotFound";
import { useUser } from "../../hooks/useUser";
import { PageHeader } from "@/checkout/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout/sections/CheckoutForm";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { CheckoutSkeleton } from "@/checkout/views/Checkout/CheckoutSkeleton";
import { PAGE_ID } from "@/checkout/views/Checkout/consts";

export const Checkout = () => {
	const { checkout, fetching: fetchingCheckout } = useCheckout();
	const { loading: isAuthenticating } = useUser();

	const isCheckoutInvalid = !fetchingCheckout && !checkout && !isAuthenticating;

	const isInitiallyAuthenticating = isAuthenticating && !checkout;

	const isEmptyCart = checkout && !checkout.lines.length;

	return isCheckoutInvalid ? (
		<PageNotFound />
	) : isInitiallyAuthenticating ? (
		<CheckoutSkeleton />
	) : (
		<ErrorBoundary FallbackComponent={PageNotFound}>
			<div className="page" id={PAGE_ID}>
				<PageHeader />
				<div className="grid min-h-screen grid-cols-1 gap-x-16 lg:grid-cols-2">
					{isEmptyCart ? (
						<EmptyCartPage />
					) : (
						<>
							<Suspense fallback={<CheckoutFormSkeleton />}>
								<CheckoutForm />
							</Suspense>
							<Suspense fallback={<SummarySkeleton />}>
								<Summary {...checkout} />
							</Suspense>
						</>
					)}
				</div>
			</div>
		</ErrorBoundary>
	);
};
