import Image from "next/image";
import { ShoppingBag, ArrowRight } from "lucide-react";
import * as Checkout from "@/lib/checkout";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { Button } from "@/ui/atoms/Button";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { CartSummary } from "@/ui/components/CartSummary";
import { DeleteLineButton } from "./DeleteLineButton";
import { QuantitySelector } from "./QuantitySelector";

export const metadata = {
	title: "Shopping Cart | Luxior Mall",
	description: "Review your shopping cart and proceed to checkout at Luxior Mall.",
};

export default async function CartPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);
	const checkout = await Checkout.find(checkoutId);

	const isEmpty = !checkout || checkout.lines.length < 1;
	const itemCount = checkout?.lines.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<Breadcrumb 
				items={[{ label: "Shopping Cart" }]} 
				className="mb-6"
			/>

			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-secondary-900">Shopping Cart</h1>
				{!isEmpty && (
					<p className="mt-2 text-secondary-600">
						{itemCount} {itemCount === 1 ? "item" : "items"} in your cart
					</p>
				)}
			</div>

			{isEmpty ? (
				<EmptyCart />
			) : (
				<div className="lg:grid lg:grid-cols-12 lg:gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-8">
						<ul className="divide-y divide-secondary-200 border-t border-b border-secondary-200">
							{checkout.lines.map((item) => (
								<li key={item.id} className="flex py-6">
									{/* Product Image */}
									<div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50 sm:h-32 sm:w-32">
										{item.variant?.product?.thumbnail?.url ? (
											<Image
												src={item.variant.product.thumbnail.url}
												alt={item.variant.product.thumbnail.alt ?? item.variant.product.name}
												fill
												className="object-cover object-center"
												sizes="(max-width: 640px) 96px, 128px"
											/>
										) : (
											<div className="flex h-full items-center justify-center text-secondary-400">
												No image
											</div>
										)}
									</div>

									{/* Product Details */}
									<div className="ml-4 flex flex-1 flex-col sm:ml-6">
										<div className="flex justify-between">
											<div className="flex-1 pr-4">
												<LinkWithChannel
													href={getHrefForVariant({
														productSlug: item.variant.product.slug,
														variantId: item.variant.id,
													})}
												>
													<h3 className="text-base font-medium text-secondary-900 hover:text-primary-600 transition-colors">
														{item.variant.product.name}
													</h3>
												</LinkWithChannel>
												
												{item.variant.product.category && (
													<p className="mt-1 text-sm text-secondary-500">
														{item.variant.product.category.name}
													</p>
												)}
												
												{item.variant.name !== item.variant.id && item.variant.name && (
													<p className="mt-1 text-sm text-secondary-500">
														{item.variant.name}
													</p>
												)}
											</div>

											{/* Price */}
											<p className="text-base font-semibold text-secondary-900">
												{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
											</p>
										</div>

										{/* Quantity and Remove */}
										<div className="mt-4 flex items-center justify-between">
											<QuantitySelector 
												checkoutId={checkoutId} 
												lineId={item.id} 
												quantity={item.quantity} 
											/>
											<DeleteLineButton checkoutId={checkoutId} lineId={item.id} />
										</div>
									</div>
								</li>
							))}
						</ul>

						{/* Continue Shopping */}
						<div className="mt-6">
							<LinkWithChannel 
								href="/products"
								className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
							>
								<ArrowRight className="h-4 w-4 rotate-180" />
								Continue Shopping
							</LinkWithChannel>
						</div>
					</div>

					{/* Order Summary */}
					<div className="mt-8 lg:mt-0 lg:col-span-4">
						<CartSummary
							subtotal={checkout.subtotalPrice.gross}
							total={checkout.totalPrice.gross}
							itemCount={itemCount}
							checkoutHref={`/checkout?checkout=${checkoutId}`}
							isCheckoutDisabled={checkout.lines.length === 0}
							showPromoCode={false}
						/>
					</div>
				</div>
			)}
		</section>
	);
}

function EmptyCart() {
	return (
		<div className="text-center py-16">
			<div className="mx-auto w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
				<ShoppingBag className="h-8 w-8 text-secondary-400" />
			</div>
			<h2 className="text-xl font-semibold text-secondary-900 mb-2">
				Your cart is empty
			</h2>
			<p className="text-secondary-600 mb-8 max-w-md mx-auto">
				Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
			</p>
			<LinkWithChannel href="/products">
				<Button variant="primary" size="lg">
					Start Shopping
				</Button>
			</LinkWithChannel>
		</div>
	);
}
