import { Suspense } from "react";
import { invariant } from "ts-invariant";
import { RootWrapper } from "./page-wrapper";
import { Loader } from "@/ui/atoms/loader";
import { noIndexRobots } from "@/lib/seo";

export const metadata = {
	title: "Checkout | InfinityBio Labs",
	description: "Complete your purchase securely.",
	robots: noIndexRobots,
};

/**
 * Checkout page with Cache Components.
 * Entire page is dynamic (reads searchParams for checkout ID).
 */
export default function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	return (
		<Suspense fallback={<CheckoutSkeleton />}>
			<CheckoutContent searchParams={props.searchParams} />
		</Suspense>
	);
}

/**
 * Dynamic checkout content - reads searchParams at request time.
 */
async function CheckoutContent({
	searchParams: searchParamsPromise,
}: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	const searchParams = await searchParamsPromise;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	if (!searchParams.checkout && !searchParams.order) {
		return null;
	}

	return <RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />;
}

function CheckoutSkeleton() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-neutral-950">
			<Loader />
		</div>
	);
}
