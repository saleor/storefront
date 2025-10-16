import { CheckoutLink } from "./CheckoutLink";
import { CartItemList } from "./CartItemList";
import * as Checkout from "@/lib/checkout";
import { formatMoney } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export const metadata = {
	title: "Shopping Cart · Saleor Storefront example",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);

	const checkout = await Checkout.find(checkoutId);

	if (!checkout || checkout.lines.length < 1) {
		return (
			<section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
				<div className="animate-slide-up-fade space-y-8 text-center">
					<div className="relative inline-block">
						{/* Empty cart icon */}
						<div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-base-800 bg-gradient-to-br from-base-900 to-base-950">
							<svg
								className="h-16 w-16 text-base-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
						</div>
						<div className="bg-accent-900/10 animate-glow-pulse absolute left-1/2 top-0 -z-10 h-40 w-40 -translate-x-1/2 rounded-full blur-2xl"></div>
					</div>

					<div>
						<h1 className="mb-4 font-display text-4xl font-light text-white md:text-5xl">
							Your Cart is Empty
						</h1>
						<p className="mx-auto max-w-md text-lg text-base-300">
							Discover our curated collection and add items to get started
						</p>
					</div>

					<LinkWithChannel href="/products" className="btn-primary inline-block">
						Explore Products
					</LinkWithChannel>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
			<div className="animate-slide-up-fade">
				<h1 className="mb-2 font-display text-4xl font-light text-white">Shopping Cart</h1>
				<p className="text-base-300">
					{checkout.lines.length} {checkout.lines.length === 1 ? "item" : "items"} in your cart
				</p>
			</div>

			<div className="mt-12 grid gap-8 lg:grid-cols-3">
				{/* Cart Items */}
				<div className="lg:col-span-2">
					<CartItemList items={checkout.lines} checkoutId={checkoutId} />
				</div>

				{/* Order Summary */}
				<div className="lg:col-span-1">
					<div className="card sticky top-24 space-y-6">
						<h2 className="font-display text-2xl font-light text-white">Order Summary</h2>

						<div className="space-y-3 border-b border-t border-base-800 py-4">
							<div className="flex justify-between text-base-300">
								<span>Subtotal</span>
								<span className="font-medium">
									{formatMoney(checkout.totalPrice.gross.amount, checkout.totalPrice.gross.currency)}
								</span>
							</div>
							<div className="flex justify-between text-base-300">
								<span>Shipping</span>
								<span className="text-sm">Calculated at checkout</span>
							</div>
						</div>

						<div className="flex items-center justify-between pt-2">
							<span className="font-display text-xl font-light text-white">Total</span>
							<span className="gradient-text text-2xl font-semibold">
								{formatMoney(checkout.totalPrice.gross.amount, checkout.totalPrice.gross.currency)}
							</span>
						</div>

						<CheckoutLink checkoutId={checkoutId} disabled={!checkout.lines.length} className="w-full" />

						<p className="text-center text-xs text-base-500">Secure checkout powered by Saleor</p>
					</div>
				</div>
			</div>
		</section>
	);
}
