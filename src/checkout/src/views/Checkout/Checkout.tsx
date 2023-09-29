import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmptyCartPage } from "../EmptyCartPage";
import { PageNotFound } from "../PageNotFound";
import { useUser } from "../../hooks/useUser";
import { PageHeader } from "@/checkout/src/sections/PageHeader";
import { Summary, SummarySkeleton } from "@/checkout/src/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout/src/sections/CheckoutForm";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { CheckoutSkeleton } from "@/checkout/src/views/Checkout/CheckoutSkeleton";
import { PAGE_ID } from "@/checkout/src/views/Checkout/consts";

export const Checkout = () => {
	const { checkout, loading } = useCheckout();
	const { loading: isAuthenticating } = useUser();

	const isCheckoutInvalid = !loading && !checkout && !isAuthenticating;

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
				<div className="grid grid-cols-1 gap-x-16 lg:grid-cols-2">
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
