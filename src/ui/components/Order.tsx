import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import { formatMoney } from "@/lib/graphql";
import { getHrefForVariant } from "@/utils/getHrefForVariant";
import { type OrderDetailsFragment } from "@/gql/graphql";

type Props = {
	order: OrderDetailsFragment;
};

export const Order = ({ order }: Props) => {
	return (
		<>
			<div className="flex flex-col gap-2 rounded border bg-neutral-200/20 px-6 py-4 md:grid md:grid-cols-4 md:gap-8">
				<dl className="flex flex-col divide-y divide-neutral-200 text-sm md:col-span-3 md:grid md:grid-cols-3 md:gap-6 md:divide-none lg:col-span-2">
					<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start">
						<dt className="font-medium text-neutral-900">Order number</dt>
						<dd className="mt-1 text-neutral-600">{order.number}</dd>
					</div>
					<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start">
						<dt className="font-medium text-neutral-900">Date placed</dt>
						<dd className="mt-1 text-neutral-600">
							<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
						</dd>
					</div>
					<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start">
						<dt className="font-medium text-neutral-900">Total amount</dt>
						<dd className="mt-1 font-medium text-neutral-900">
							{formatMoney(order.total.gross.amount, order.total.gross.currency)}
						</dd>
					</div>
				</dl>
				<div className="flex flex-col md:flex-row md:items-center lg:col-span-2">
					<Link
						href="#"
						className="flex items-center justify-center rounded border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50 focus:bg-neutral-50 md:ml-auto"
					>
						View Order
					</Link>
				</div>
			</div>

			{order.lines.length > 0 && (
				<table className="mt-6 w-full table-fixed divide-y text-sm text-neutral-500">
					<thead>
						<tr className="[&>th:last-child]:text-end max-md:[&>th:not(:first-child):not(:last-child)]:hidden [&>th:not(:last-child)]:pr-6 [&>th]:py-4 [&>th]:font-normal">
							<th>Product</th>
							<th>Variant</th>
							<th>Category</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody className="[&>tr]:border-b">
						{order.lines.map((item) => {
							if (item.variant) {
								const product = item.variant?.product;

								return (
									<tr
										className="[&>td:last-child]:text-end max-md:[&>td:not(:first-child):not(:last-child)]:hidden [&>td:not(:last-child)]:pr-6 [&>td]:py-6"
										key={product.id}
									>
										<td className="flex flex-row items-center gap-3 md:gap-6">
											<div className="aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-50 md:h-24 md:w-24">
												{product.thumbnail && (
													<Image
														src={product.thumbnail.url}
														alt={product.thumbnail.alt ?? ""}
														width={200}
														height={200}
														className="h-full w-full object-contain object-center"
													/>
												)}
											</div>
											<Link
												href={
													item.variant?.id
														? getHrefForVariant(product.slug, item.variant.id)
														: `/products/${product.slug}`
												}
												className="font-medium text-neutral-700"
											>
												{product.name}
											</Link>
										</td>
										<td>
											{item.variant.name !== item.variant?.id && Boolean(item.variant.name)
												? item.variant.name
												: "-"}
										</td>
										<td>{product.category?.name}</td>
										<td>
											<div className="flex flex-col gap-1">
												{item.variant.pricing?.price &&
													(item.quantity > 1 ? (
														<>
															<span className="opacity-80">
																{item.quantity} x{" "}
																{formatMoney(
																	item.variant.pricing.price.gross.amount,
																	item.variant.pricing.price.gross.currency,
																)}
															</span>
															{formatMoney(
																item.variant.pricing.price.gross.amount * item.quantity,
																item.variant.pricing.price.gross.currency,
															)}
														</>
													) : (
														formatMoney(
															item.variant.pricing.price.gross.amount,
															item.variant.pricing.price.gross.currency,
														)
													))}
											</div>
										</td>
									</tr>
								);
							}
						})}
					</tbody>
				</table>
			)}
		</>
	);
};
