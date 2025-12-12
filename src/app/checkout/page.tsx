import Link from "next/link";
import { invariant } from "ts-invariant";
import { RootWrapper } from "./pageWrapper";
import { Logo } from "@/ui/components/Logo";
import { getShopInfo } from "@/lib/content";

export const metadata = {
	title: "Checkout | Luxior Mall",
	description: "Complete your purchase securely.",
};

export default async function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	const [searchParams, shopInfo] = await Promise.all([props.searchParams, getShopInfo()]);
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	if (!searchParams.checkout && !searchParams.order) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-white">
				<div className="text-center">
					<h1 className="mb-4 text-2xl font-bold text-secondary-900">No checkout found</h1>
					<p className="mb-6 text-secondary-600">Please add items to your cart first.</p>
					<Link
						href="/products"
						className="inline-block rounded-md bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-dvh bg-secondary-50">
			<section className="mx-auto flex min-h-dvh max-w-7xl flex-col p-4 sm:p-8">
				{/* Header */}
				<header className="mb-8 flex items-center justify-between border-b border-secondary-200 py-4">
					<Link href="/" aria-label={`${shopInfo.name} homepage`}>
						<Logo />
					</Link>
					<div className="flex items-center gap-4">
						<span className="text-sm text-secondary-500">Secure Checkout</span>
						<svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</header>

				{/* Checkout Title */}
				<h1 className="mb-6 text-2xl font-bold text-secondary-900 sm:text-3xl">Checkout</h1>

				{/* Checkout Content */}
				<section className="mb-8 flex-1 rounded-lg bg-white p-4 shadow-sm sm:p-6">
					<RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />
				</section>

				{/* Footer */}
				<footer className="py-4 text-center text-sm text-secondary-500">
					<p>
						© {new Date().getFullYear()} {shopInfo.name}. All rights reserved.
					</p>
					<p className="mt-1">
						<Link href="/privacy-policy" className="hover:text-primary-600">
							Privacy Policy
						</Link>
						{" · "}
						<Link href="/terms-of-service" className="hover:text-primary-600">
							Terms of Service
						</Link>
					</p>
				</footer>
			</section>
		</div>
	);
}
