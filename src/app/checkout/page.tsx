import Link from "next/link";
import { invariant } from "ts-invariant";
import { RootWrapper } from "./pageWrapper";

export const metadata = {
	title: "Checkout",
	description: "Complete your purchase securely. Fill in your details to checkout and get instant access to your digital products.",
};

export default async function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	const searchParams = await props.searchParams;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	if (!searchParams.checkout && !searchParams.order) {
		return null;
	}

	return (
		<div className="min-h-dvh">
			<section className="mx-auto flex min-h-dvh max-w-7xl flex-col px-6 py-8 lg:px-12">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-base-800 pb-6">
					<Link
						aria-label="Return to homepage"
						href="/"
						className="group flex items-center gap-2 text-white transition-colors duration-200 hover:text-accent-200"
					>
						<svg
							className="h-5 w-5 transform transition-transform duration-200 group-hover:-translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						<span className="font-display text-lg">Back to Store</span>
					</Link>
					<div className="flex items-center gap-2 text-sm text-base-400">
						<svg
							className="h-5 w-5 text-accent-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<span>Secure Checkout</span>
					</div>
				</div>

				{/* Only show header for checkout, not for order confirmation */}
				{!searchParams.order && (
					<div className="animate-slide-up-fade mt-8">
						<h1 className="mb-2 font-display text-4xl font-light text-white">Complete Your Order</h1>
						<p className="text-base-300">Fill in your details below to complete your purchase</p>
					</div>
				)}

				<section className="mb-12 mt-8 flex-1">
					<RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />
				</section>
			</section>
		</div>
	);
}
