"use client";
import { redirect } from "next/navigation";
import { useQuery } from "urql";
import Image from "next/image";
import { CurrentUserOrderListDocument, type CurrentUserOrderListQuery } from "@/gql/graphql";

export default function OrderPage() {
	const [{ data }] = useQuery<CurrentUserOrderListQuery>({
		query: CurrentUserOrderListDocument.toString(),
	});

	if (!data || !data.me) {
		redirect("/login");
	}

	const user = data?.me;
	const email = user?.email;

	if (!email) {
		return <div>User does not have email</div>;
	}

	const orders = user.orders?.edges || [];

	return (
		<div className="mx-auto max-w-7xl p-8">
			<h1 className="text-2xl font-bold tracking-tight text-slate-900">{user.firstName}&rsquo;s Orders</h1>

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
									<div className="items-center gap-6 border-b border-gray-200 bg-neutral-100/20 p-4">
										<dl className="col-span-3 grid flex-1 grid-cols-3 gap-6 text-sm">
											<div>
												<dt className="font-medium text-slate-900">Order number</dt>
												<dd className="mt-1 text-slate-500">{order.number}</dd>
											</div>
											<div className="hidden sm:block">
												<dt className="font-medium text-slate-900">Date placed</dt>
												<dd className="mt-1 text-slate-500">
													<time dateTime={order.created}>{order.created}</time>
												</dd>
											</div>
											<div>
												<dt className="font-medium text-slate-900">Total amount</dt>
												<dd className="mt-1 font-medium text-slate-900">{order.total?.gross.amount}</dd>
											</div>
										</dl>
									</div>

									{order.lines && (
										<ul className="divide-y divide-gray-200">
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
																				src={product.thumbnail?.url}
																				alt="image"
																				width={200}
																				height={200}
																				className="h-full w-full object-cover object-center"
																			/>
																		)}
																	</div>
																	<div className="ml-4 flex-1 text-sm">
																		<div className="flex justify-between font-medium text-neutral-800 ">
																			<div>{product.name}</div>
																		</div>
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
