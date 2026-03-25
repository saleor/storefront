import { Suspense } from "react";
import Image from "next/image";
import { CheckoutLink } from "./checkout-link";
import { DeleteLineButton } from "./delete-line-button";
import * as Checkout from "@/lib/checkout";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { noIndexRobots } from "@/lib/seo";

export const metadata = {
	title: "Shopping Cart | InfinityBio Labs",
	robots: noIndexRobots,
};

export default function Page(props: { params: Promise<{ channel: string }> }) {
	return (
		<div className="min-h-[70vh] bg-neutral-950">
			<section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-white">Your Shopping Cart</h1>
				<Suspense fallback={<CartSkeleton />}>
					<CartContent params={props.params} />
				</Suspense>
			</section>
		</div>
	);
}

async function CartContent({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const params = await paramsPromise;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);
	const checkout = await Checkout.find(checkoutId);

	if (!checkout || checkout.lines.length < 1) {
		return (
			<div className="mt-12">
				<p className="my-12 text-sm text-neutral-400">
					Looks like you haven&apos;t added any items to the cart yet.
				</p>
				<LinkWithChannel
					href="/products"
					className="inline-block rounded-xl bg-emerald-500 px-8 py-3 text-center font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30"
				>
					Explore products
				</LinkWithChannel>
			</div>
		);
	}

	return (
		<form className="mt-10">
			<ul
				data-testid="CartProductList"
				role="list"
				className="divide-y divide-white/[0.06] border-b border-t border-white/[0.06]"
			>
				{checkout.lines.map((item) => (
					<li key={item.id} className="flex py-5">
						<div className="aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-neutral-900 sm:h-32 sm:w-32">
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
										<h2 className="font-medium text-white transition-colors hover:text-emerald-400">
											{item.variant?.product?.name}
										</h2>
									</LinkWithChannel>
									<p className="mt-1 text-sm text-neutral-500">{item.variant?.product?.category?.name}</p>
									{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
										<p className="mt-1 text-sm text-neutral-500">Variant: {item.variant.name}</p>
									)}
								</div>
								<p className="text-right font-semibold tabular-nums text-white">
									{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
								</p>
							</div>
							<div className="flex justify-between">
								<div className="text-sm font-bold text-neutral-300">Qty: {item.quantity}</div>
								<DeleteLineButton checkoutId={checkoutId} lineId={item.id} channel={params.channel} />
							</div>
						</div>
					</li>
				))}
			</ul>

			<div className="mt-10">
				<div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-4">
					<div className="flex items-center justify-between gap-2 py-2">
						<div>
							<p className="font-semibold text-white">Your Total</p>
							<p className="mt-1 text-sm text-neutral-500">Shipping will be calculated in the next step</p>
						</div>
						<div className="text-lg font-semibold tabular-nums text-white">
							{formatMoney(checkout.totalPrice.gross.amount, checkout.totalPrice.gross.currency)}
						</div>
					</div>
				</div>
				<div className="mt-8 text-center">
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

function CartSkeleton() {
	return (
		<div className="mt-10 animate-pulse">
			<div className="divide-y divide-white/[0.06] border-b border-t border-white/[0.06]">
				{[1, 2].map((i) => (
					<div key={i} className="flex py-5">
						<div className="h-24 w-24 rounded-xl bg-neutral-800 sm:h-32 sm:w-32" />
						<div className="flex-1 p-4 py-2">
							<div className="h-5 w-48 rounded bg-neutral-800" />
							<div className="mt-2 h-4 w-32 rounded bg-neutral-800" />
						</div>
					</div>
				))}
			</div>
			<div className="mt-10">
				<div className="h-20 rounded-2xl bg-neutral-800/50" />
				<div className="mt-8 flex justify-center">
					<div className="h-12 w-48 rounded-xl bg-neutral-800" />
				</div>
			</div>
		</div>
	);
}
