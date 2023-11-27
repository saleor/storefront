import Image from "next/image";
import Link from "next/link";
import { formatDate, formatMoney, getHrefForVariant } from "@/lib/utils";
import { type OrderDetailsFragment } from "@/gql/graphql";
import { PaymentStatus } from "@/ui/components/PaymentStatus";

type Props = {
	order: OrderDetailsFragment;
};

export const OrderListItem = ({ order }: Props) => {
	return (
		<li className="bg-white">
			<div className="flex flex-col gap-2 border bg-neutral-200/20 px-6 py-4 md:grid md:grid-cols-4 md:gap-8">
				<dl className="flex flex-col divide-y divide-neutral-200 text-sm md:col-span-3 md:grid md:grid-cols-3 md:gap-6 md:divide-none lg:col-span-2">
					<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start md:gap-y-1">
						<dt className="font-medium text-neutral-900">Order number</dt>
						<dd className="text-neutral-600">{order.number}</dd>
					</div>
					<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start md:gap-y-1">
						<dt className="font-medium text-neutral-900">Date placed</dt>
						<dd className="text-neutral-600">
							<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
						</dd>
					</div>
					<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start md:gap-y-1">
						<dt className="font-medium text-neutral-900">Payment status</dt>
						<dd>
							<PaymentStatus status={order.paymentStatus} />
						</dd>
					</div>
				</dl>
				{/* TODO: Reveal after implementing the order details page. */}
				{/* <div className="flex flex-col md:col-span-1 md:flex-row md:items-center lg:col-span-2">
					<Link
						href="#"
						className="flex items-center justify-center rounded border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50 focus:bg-neutral-50 md:ml-auto"
					>
						View Order
					</Link>
				</div> */}
			</div>

			{order.lines.length > 0 && (
				<>
					<div className="md:border-x md:px-6">
						<table className="w-full text-sm text-neutral-500">
							<thead className="sr-only">
								<tr>
									<td>product</td>
									<td className="max-md:hidden">quantity and unit price</td>
									<td>price</td>
								</tr>
							</thead>
							<tbody className="md:divide-y">
								{order.lines.map((item) => {
									if (!item.variant) {
										return null;
									}

									const product = item.variant.product;

									return (
										<tr key={product.id}>
											<td className="py-6 pr-6 md:w-[60%] lg:w-[70%]">
												<div className="flex flex-row items-center">
													{product.thumbnail && (
														<div className="mr-3 aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-50 md:mr-6 md:h-24 md:w-24">
															<Image
																src={product.thumbnail.url}
																alt={product.thumbnail.alt ?? ""}
																width={200}
																height={200}
																className="h-full w-full object-contain object-center"
															/>
														</div>
													)}
													<div>
														<Link
															href={getHrefForVariant({
																productSlug: product.slug,
																variantId: item.variant.id,
															})}
															className="font-medium text-neutral-900"
														>
															{product.name}
														</Link>
														{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
															<p className="mt-1">Variant: {item.variant.name}</p>
														)}
													</div>
												</div>
											</td>
											<td className="py-6 pr-6 max-md:hidden">
												{item.quantity} ×{" "}
												{item.variant.pricing?.price &&
													formatMoney(
														item.variant.pricing.price.gross.amount,
														item.variant.pricing.price.gross.currency,
													)}
											</td>
											<td className="py-6 text-end">
												<div className="flex flex-col gap-1 text-neutral-900">
													{item.variant.pricing?.price &&
														formatMoney(
															item.variant.pricing.price.gross.amount * item.quantity,
															item.variant.pricing.price.gross.currency,
														)}
													{item.quantity > 1 && (
														<span className="text-xs md:hidden">
															{item.quantity} ×{" "}
															{item.variant.pricing?.price &&
																formatMoney(
																	item.variant.pricing.price.gross.amount,
																	item.variant.pricing.price.gross.currency,
																)}
														</span>
													)}
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<dl className="flex justify-between border-y py-6 text-sm font-medium text-neutral-900 md:border md:px-6">
						<dt>Total amount including delivery</dt>
						<dd>{formatMoney(order.total.gross.amount, order.total.gross.currency)}</dd>
					</dl>
				</>
			)}
		</li>
	);
};
