import { invariant } from "ts-invariant";
import { Suspense } from "react";
import { RootWrapper } from "./pageWrapper";

export const metadata = {
	title: "Checkout · Saleor Storefront example",
};

export default function CheckoutPage({
	searchParams,
}: {
	searchParams: { checkout?: string; order?: string };
}) {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	if (!searchParams.checkout && !searchParams.order) {
		return null;
	}

	return (
		<div className="min-h-[100dvh] bg-white">
			<section className="mx-auto flex min-h-[100dvh] max-w-7xl flex-col p-8">
				<div className="flex items-center font-bold">
					<a aria-label="homepage" href="/">
						ACME
					</a>
				</div>
				<h1 className="mt-8 text-3xl font-bold text-neutral-900">Checkout</h1>

				<section className="mb-12 mt-6 flex-1">
					<Suspense>
						<RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />
					</Suspense>
				</section>
			</section>
		</div>
	);
}
