import { Suspense } from "react";
import { cookies } from "next/headers";
import { CurrentUserOrderListDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { LoginForm } from "@/ui/components/login-form";
import { OrderListItem } from "@/ui/components/order-list-item";
import { Loader } from "@/ui/atoms/loader";

/**
 * Orders page with Cache Components.
 * Entire page is dynamic (requires auth check).
 */
export default function OrderPage() {
	return (
		<Suspense fallback={<Loader />}>
			<OrdersContent />
		</Suspense>
	);
}

/**
 * Dynamic orders content - checks auth and fetches orders at request time.
 */
async function OrdersContent() {
	// During static generation, skip API call entirely
	let hasCookies = false;
	try {
		const cookieStore = await cookies();
		hasCookies = cookieStore.getAll().length > 0;
	} catch {
		// Static generation - no cookies available
	}

	if (!hasCookies) {
		return <LoginForm />;
	}

	const result = await executeAuthenticatedGraphQL(CurrentUserOrderListDocument, {
		cache: "no-cache",
	});

	if (!result.ok || !result.data.me) {
		return <LoginForm />;
	}

	const user = result.data.me;
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
