import { invariant } from "ts-invariant";
import { RootWrapper } from "./page-wrapper";

export const metadata = {
	title: "Checkout · Saleor Storefront example",
	description: "Complete your purchase securely.",
};

export default async function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	const searchParams = await props.searchParams;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	if (!searchParams.checkout && !searchParams.order) {
		return null;
	}

	// V0 design handles its own layout - no outer wrapper needed
	return <RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />;
}
