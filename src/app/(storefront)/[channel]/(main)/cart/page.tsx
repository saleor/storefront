import { Suspense } from "react";
import Image from "next/image";
import { deleteCartLine } from "@/app/actions";
import { CheckoutLink } from "./checkout-link";
import { DeleteLineButton } from "./delete-line-button";
import * as Checkout from "@/lib/checkout";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { buttonClassName } from "@/ui/components/ui/button";

export const metadata = {
	title: "Shopping Cart · Saleor Storefront example",
};

export default function Page(props: { params: Promise<{ channel: string }> }) {
	return (
		<section className="mx-auto max-w-7xl p-8">
			<h1 className="mt-8 text-3xl font-bold text-foreground">Your Shopping Cart</h1>
			{/* Cart content is dynamic (reads cookies) - wrap in Suspense */}
			<Suspense fallback={<CartSkeleton />}>
				<CartContent params={props.params} />
			</Suspense>
		</section>
	);
}

/**
 * Dynamic cart content - reads cookies at request time.
 * With Cache Components, this streams in after the static shell.
 */
async function CartContent({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const params = await paramsPromise;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);
	const checkout = await Checkout.find(checkoutId);

	if (!checkout || checkout.lines.length < 1) {
		return (
			<div className="mt-12">
				<p className="my-12 text-sm text-muted-foreground">
					Looks like you haven&apos;t added any items to the cart yet.
				</p>
				<LinkWithChannel href="/products" className={buttonClassName({ className: "max-w-full sm:px-16" })}>
					Explore products
				</LinkWithChannel>
			</div>
		);
	}

	return (
		<form className="mt-12">
			<ul
				data-testid="CartProductList"
				role="list"
				className="divide-y divide-border border-b border-t border-border"
			>
				{checkout.lines.map((item) => (
					<li key={item.id} className="flex py-4">
						<div className="aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted sm:h-32 sm:w-32">
							{item.variant?.product?.thumbnail?.url && (
								<Image
									src={item.variant.product.thumbnail.url}
									alt={item.variant.product.thumbnail.alt ?? ""}
									width={200}
									height={200}
									className="h-full w-full object-contain object-center"
								/>
							)}
						</div>
						<div className="relative flex flex-1 flex-col justify-between p-4 py-2">
							<div className="flex justify-between justify-items-start gap-4">
								<div>
									<LinkWithChannel
										href={getHrefForVariant({
											productSlug: item.variant.product.slug,
											variantId: item.variant.id,
										})}
									>
										<h2 className="font-medium text-foreground">{item.variant?.product?.name}</h2>
									</LinkWithChannel>
									<p className="mt-1 text-sm text-muted-foreground">
										{item.variant?.product?.category?.name}
									</p>
									{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
										<p className="mt-1 text-sm text-muted-foreground">Variant: {item.variant.name}</p>
									)}
								</div>
								<p className="text-right font-semibold text-foreground">
									{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
								</p>
							</div>
							<div className="flex justify-between">
								<div className="text-sm font-bold">Qty: {item.quantity}</div>
								<DeleteLineButton
									deleteLine={deleteCartLine.bind(null, checkoutId, item.id, params.channel)}
								/>
							</div>
						</div>
					</li>
				))}
			</ul>

			<div className="mt-12">
				<div className="rounded-md border bg-muted px-4 py-2">
					<div className="flex items-center justify-between gap-2 py-2">
						<div>
							<p className="font-semibold text-foreground">Your Total</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Shipping will be calculated in the next step
							</p>
						</div>
						<div className="font-medium text-foreground">
							{formatMoney(checkout.totalPrice.gross.amount, checkout.totalPrice.gross.currency)}
						</div>
					</div>
				</div>
				<div className="mt-10 text-center">
					<CheckoutLink
						checkoutId={checkoutId}
						disabled={!checkout.lines.length}
						className="w-full sm:w-1/3"
					/>
				</div>
			</div>
		</form>
	);
}

/**
 * Skeleton fallback for cart - part of static shell.
 */
function CartSkeleton() {
	return (
		<div className="mt-12 animate-pulse">
			<div className="divide-y divide-border border-b border-t border-border">
				{[1, 2].map((i) => (
					<div key={i} className="flex py-4">
						<div className="h-24 w-24 rounded-md bg-muted sm:h-32 sm:w-32" />
						<div className="flex-1 p-4 py-2">
							<div className="h-5 w-48 rounded bg-muted" />
							<div className="mt-2 h-4 w-32 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
			<div className="mt-12">
				<div className="h-20 rounded-md bg-muted" />
				<div className="mt-10 flex justify-center">
					<div className="h-12 w-48 rounded-md bg-muted" />
				</div>
			</div>
		</div>
	);
}
