"use client";
import { useQuery } from "urql";
import Image from "next/image";
import { CurrentUserOrderListDocument, type CurrentUserOrderListQuery } from "@/gql/graphql";
import { formatMoney } from "@/lib/graphql";
import { formatDate } from "@/lib/date";

export function OrderList() {
	const [{ data, fetching }] = useQuery<CurrentUserOrderListQuery>({
		query: CurrentUserOrderListDocument.toString(),
	});

	if (fetching) {
		return <div>Loading...</div>;
	}

	const user = data?.me;
	const email = user?.email;

	if (!email) {
		return <div>User does not have email</div>;
	}

	const orders = user.orders?.edges || [];

	return (
		<div className="mx-auto max-w-7xl p-8">
			<h1 className="text-2xl font-bold tracking-tight text-neutral-900">{user.firstName}&rsquo;s Orders</h1>

			{orders.length === 0 ? (
				<div className="mt-8">
					<div className="rounded border border-neutral-100 bg-white p-4">
						<div className="flex items-center">No orders found</div>
					</div>
				</div>
			) : (
				<ul className="mt-8 space-y-4">
					{orders.map(
						({ node: order }) =>
							order.id &&
							order.created && (
								<li
									key={order.id}
									className="rounded border-b border-t border-neutral-200 bg-white sm:border"
								>
									<div className="items-center gap-6 border-b border-neutral-200 bg-neutral-100/20 p-4">
										<dl className="col-span-3 grid flex-1 grid-cols-3 gap-6 text-sm">
											<div>
												<dt className="font-medium text-neutral-900">Order number</dt>
												<dd className="mt-1 text-neutral-500">{order.number}</dd>
											</div>
											<div className="hidden sm:block">
												<dt className="font-medium text-neutral-900">Date placed</dt>
												<dd className="mt-1 text-neutral-500">
													<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
												</dd>
											</div>
											<div>
												<dt className="font-medium text-neutral-900">Total amount</dt>
												<dd className="mt-1 font-medium text-neutral-900">
													{order.total && formatMoney(order.total.gross.amount, order.total.gross.currency)}
												</dd>
											</div>
										</dl>
									</div>

									{order.lines && (
										<ul className="divide-y divide-neutral-200">
											{order.lines.map((item) => {
												const product = item.variant?.product;

												if (product) {
													return (
														product.id && (
															<li key={product.id} className="p-4">
																<div className="flex items-center">
																	<div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border">
																		{product.thumbnail?.url && (
																			<Image
																				src={product.thumbnail.url}
																				alt="image"
																				width={200}
																				height={200}
																				className="h-full w-full object-cover object-center"
																			/>
																		)}
																	</div>
																	<div className="ml-4 flex-1 text-sm">
																		<p className="flex justify-between font-medium text-neutral-800">
																			{product.name}
																		</p>
																	</div>
																</div>
															</li>
														)
													);
												}
											})}
										</ul>
									)}
								</li>
							),
					)}
				</ul>
			)}
		</div>
	);
}
