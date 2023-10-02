import { RootWrapper } from "./pageWrapper";

export default function CheckoutPage() {
	return (
		<div className="checkout-bg min-h-[calc(100vh-106px)]">
			<section className="mx-auto max-w-7xl p-8">
				<h1 className="mt-8 text-3xl font-bold text-gray-900">Checkout</h1>

				<section className="mb-12 mt-6">
					<RootWrapper saleorApiUrl={process.env.SALEOR_API_URL!} />
				</section>
			</section>
		</div>
	);
}
