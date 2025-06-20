import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmptyCartPage } from "../EmptyCartPage";
import { PageNotFound } from "../PageNotFound";
import { useUser } from "../../hooks/useUser";
import { Summary, SummarySkeleton } from "@/checkout/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout/sections/CheckoutForm";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { CheckoutSkeleton } from "@/checkout/views/Checkout/CheckoutSkeleton";

export const Checkout = () => {
	const { checkout, fetching: fetchingCheckout, error } = useCheckout();
	const { loading: isAuthenticating } = useUser();

	const isCheckoutInvalid = !fetchingCheckout && !checkout && !isAuthenticating;

	const isInitiallyAuthenticating = isAuthenticating && !checkout;

	const isEmptyCart = checkout && !checkout.lines.length;

	// Add debugging logs
	console.log("Checkout Debug:", {
		checkout: !!checkout,
		fetchingCheckout,
		isAuthenticating,
		isCheckoutInvalid,
		error: error ? (error as Error)?.message : null,
	});

	// Add more detailed debugging
	console.log("Checkout detailed debug:", {
		checkoutExists: !!checkout,
		checkoutLines: checkout?.lines,
		checkoutLinesLength: checkout?.lines?.length,
		isEmptyCart,
		totalPrice: checkout?.totalPrice,
		subtotalPrice: checkout?.subtotalPrice,
		shippingPrice: checkout?.shippingPrice,
	});

	return isCheckoutInvalid ? (
		<PageNotFound error={error} />
	) : isInitiallyAuthenticating ? (
		<CheckoutSkeleton />
	) : !checkout ? (
		<CheckoutSkeleton />
	) : (
		<ErrorBoundary
			FallbackComponent={({ error: boundaryError }) => {
				console.error("ErrorBoundary caught error:", boundaryError);
				return <PageNotFound error={boundaryError as Error} />;
			}}
		>
			<div className="page">
				{isEmptyCart ? (
					<EmptyCartPage />
				) : (
					<div className="grid min-h-screen grid-cols-1 gap-x-16 lg:grid-cols-2">
						<ErrorBoundary
							FallbackComponent={({ error: formError }) => {
								console.error("CheckoutForm error:", formError);
								return <div>CheckoutForm Error: {(formError as Error)?.message || "Unknown error"}</div>;
							}}
						>
							<Suspense fallback={<CheckoutFormSkeleton />}>
								<CheckoutForm />
							</Suspense>
						</ErrorBoundary>
						<ErrorBoundary
							FallbackComponent={({ error: summaryError }) => {
								console.error("Summary error:", summaryError);
								return <div>Summary Error: {(summaryError as Error)?.message || "Unknown error"}</div>;
							}}
						>
							<Suspense fallback={<SummarySkeleton />}>
								<Summary
									lines={checkout.lines || []}
									totalPrice={checkout.totalPrice}
									subtotalPrice={checkout.subtotalPrice}
									giftCards={checkout.giftCards || []}
									voucherCode={checkout.voucherCode}
									discount={checkout.discount}
									shippingPrice={checkout.shippingPrice}
								/>
							</Suspense>
						</ErrorBoundary>
					</div>
				)}
			</div>
		</ErrorBoundary>
	);
};
