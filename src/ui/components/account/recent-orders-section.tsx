import { ChevronRight } from "lucide-react";
import { CurrentUserOrdersPaginatedDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { hasAuthSession } from "@/lib/auth/has-auth-session";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { OrderRow } from "@/ui/components/account/order-row";
import { accountRoutes } from "@/ui/components/account/routes";

export async function RecentOrdersSection() {
	// Gate the authenticated query on a session cookie (like the account layout does).
	// Without it, prerender runs this with no cookies, hammering Saleor with retries that
	// saturate the request queue and time out the sibling `getStorefrontContent` cache fill.
	if (!(await hasAuthSession())) {
		return null;
	}

	const result = await executeAuthenticatedGraphQL(CurrentUserOrdersPaginatedDocument, {
		variables: { first: 3, after: null },
		cache: "no-cache",
	});

	if (!result.ok) {
		return (
			<section>
				<h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
				<div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
					We couldn&apos;t load your recent orders.
				</div>
			</section>
		);
	}

	const orders = result.data.me?.orders?.edges ?? [];

	return (
		<section>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold">Recent Orders</h2>
				{orders.length > 0 && (
					<LinkWithChannel
						href={accountRoutes.orders}
						className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						View all
						<ChevronRight className="h-4 w-4" />
					</LinkWithChannel>
				)}
			</div>

			{orders.length === 0 ? (
				<div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
					You haven&apos;t placed any orders yet.
				</div>
			) : (
				<div className="space-y-2">
					{orders.map(({ node: order }) => (
						<OrderRow key={order.id} order={order} />
					))}
				</div>
			)}
		</section>
	);
}
