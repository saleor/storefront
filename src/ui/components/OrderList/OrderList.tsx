"use client";

import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import { OrderListItem } from "./components/OrderListItem";
import { CurrentUserOrderListDocument, type CurrentUserOrderListQuery } from "@/gql/graphql";

export function OrderList() {
	const router = useRouter();
	const [{ data, fetching }] = useQuery<CurrentUserOrderListQuery>({
		query: CurrentUserOrderListDocument.toString(),
	});

	if (fetching) {
		return <div>Loading...</div>;
	}

	const user = data?.me;
	const email = user?.email;

	if (!email) {
		router.push("/");
		return <div>User does not have email</div>;
	}

	const orders = user.orders?.edges || [];

	return (
		<div className="mx-auto max-w-7xl p-8">
			<h1 className="text-2xl font-bold tracking-tight text-neutral-900">
				{user.firstName ? user.firstName : user.email}&rsquo;s orders
			</h1>

			{orders.length === 0 ? (
				<div className="mt-8">
					<div className="rounded border border-neutral-100 bg-white p-4">
						<div className="flex items-center">No orders found</div>
					</div>
				</div>
			) : (
				<ul className="mt-8 space-y-6">
					{orders.map(({ node: order }) => {
						return <OrderListItem order={order} key={order.id} />;
					})}
				</ul>
			)}
		</div>
	);
}
