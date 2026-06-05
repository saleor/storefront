import { Suspense } from "react";
import { CurrentUserOrdersPaginatedDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { OrderRow } from "@/ui/components/account/order-row";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { Button } from "@/ui/components/ui/button";
import { accountRoutes } from "@/ui/components/account/routes";
import { AccountOrdersListSkeleton } from "@/ui/components/account/account-skeleton";

const ORDERS_PER_PAGE = 10;

type Props = {
	searchParams: Promise<{ after?: string }>;
};

export default function AccountOrdersPage({ searchParams }: Props) {
	return (
		<Suspense fallback={<AccountOrdersListSkeleton />}>
			<AccountOrdersContent searchParams={searchParams} />
		</Suspense>
	);
}

async function AccountOrdersContent({ searchParams }: Props) {
	const { after } = await searchParams;

	const result = await executeAuthenticatedGraphQL(CurrentUserOrdersPaginatedDocument, {
		variables: {
			first: ORDERS_PER_PAGE,
			after: after || null,
		},
		cache: "no-cache",
	});

	if (!result.ok) {
		return <AccountOrdersError message="We couldn't load your orders. Please try again in a moment." />;
	}

	if (!result.data.me) {
		return <AccountOrdersError message="Sign in to view your orders." />;
	}

	const ordersConnection = result.data.me.orders;
	const orders = ordersConnection?.edges ?? [];
	const pageInfo = ordersConnection?.pageInfo;
	const totalCount = ordersConnection?.totalCount ?? 0;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					{totalCount === 0 ? "No orders yet" : `${totalCount} order${totalCount !== 1 ? "s" : ""}`}
				</p>
			</div>

			{orders.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
				</div>
			) : (
				<>
					<div className="space-y-2">
						{orders.map(({ node: order }) => (
							<OrderRow key={order.id} order={order} />
						))}
					</div>

					{pageInfo?.hasNextPage && pageInfo.endCursor && (
						<div className="flex justify-center pt-2">
							<LinkWithChannel href={`${accountRoutes.orders}?after=${pageInfo.endCursor}`}>
								<Button variant="outline-solid">Load more orders</Button>
							</LinkWithChannel>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function AccountOrdersError({ message }: { message: string }) {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
			</div>
			<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
				{message}
			</div>
		</div>
	);
}
