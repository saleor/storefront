import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { CheckoutLink } from "./CheckoutLink";
import { DeleteLineButton } from "./DeleteLineButton";
import * as Checkout from "@/lib/checkout";
import { formatMoney } from "@/lib/graphql";

export const metadata = {
	title: "Shopping Cart · Saleor Storefront example",
};

export default async function Page() {
	const checkoutId = cookies().get("checkoutId")?.value || "";

	const checkout = await Checkout.find(checkoutId);
	const lines = checkout ? checkout.lines : [];

	return (
		<section className="mx-auto max-w-7xl p-8">
			<h1 className="mt-8 text-3xl font-bold text-gray-900">Your Shopping Cart</h1>

			<form className="mt-12">
				<div>
					<ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
						{lines.map((item) => (
							<li key={item.id} className="flex py-4">
								<div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50 sm:h-32 sm:w-32">
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
										<div className="">
											<Link href={`/products/${item.variant.product.slug}?variant=${item.variant.id}`}>
												<h3 className="font-medium text-gray-700">{item.variant?.product?.name}</h3>
											</Link>
											<p className="mt-1 text-sm text-gray-500">{item.variant?.product?.category?.name}</p>
											{Boolean(item.variant.name) && (
												<p className="mt-1 text-sm text-gray-500">Variant: {item.variant.name}</p>
											)}
										</div>

										<p className="text-right font-semibold text-gray-900">
											{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
										</p>
									</div>

									<div className="flex justify-between">
										<div className="text-sm font-bold">Qty: {item.quantity}</div>
										<DeleteLineButton checkoutId={checkoutId} lineId={item.id} />
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>

				<div className="mt-12">
					<div className="rounded border bg-gray-50 px-4 py-2">
						<div className="flex items-center justify-between py-2">
							<div>
								<p className="font-semibold text-gray-900">Your Total</p>
								<p className="mt-1 text-sm text-gray-500">Shipping will be calculated in the next step</p>
							</div>
							<div className="font-medium text-gray-900">
								{checkout &&
									formatMoney(checkout.totalPrice.gross.amount, checkout.totalPrice.gross.currency)}
							</div>
						</div>
					</div>
					<div className="mt-10 grid sm:grid-cols-3">
						<CheckoutLink checkoutId={checkoutId} disabled={lines.length < 1} />
					</div>
				</div>
			</form>
		</section>
	);
}
