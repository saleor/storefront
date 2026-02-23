import { ChevronRight } from "lucide-react";
import { CurrentUserOrdersPaginatedDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { OrderRow } from "@/ui/components/account/order-row";
import { AccountAddressCard } from "@/ui/components/account/address-card";
import { accountRoutes } from "@/ui/components/account/routes";
import { getCurrentUser } from "./get-current-user";

export default async function AccountOverviewPage() {
	const [user, ordersResult] = await Promise.all([
		getCurrentUser(),
		executeAuthenticatedGraphQL(CurrentUserOrdersPaginatedDocument, {
			variables: { first: 3, after: null },
			cache: "no-cache",
		}),
	]);

	const orders = ordersResult.ok ? ordersResult.data.me?.orders?.edges ?? [] : [];
	const defaultAddress = user
		? user.addresses.find((a) => a.id === user.defaultShippingAddress?.id) ?? user.addresses[0]
		: null;

	const displayName = user?.firstName || user?.email.split("@")[0] || "";

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Welcome back, {displayName}</h1>
				<p className="mt-1 text-sm text-muted-foreground">Here is an overview of your account activity.</p>
			</div>

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

			<section>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold">Default Address</h2>
					<LinkWithChannel
						href={accountRoutes.addresses}
						className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						Manage
						<ChevronRight className="h-4 w-4" />
					</LinkWithChannel>
				</div>

				{defaultAddress ? (
					<AccountAddressCard address={defaultAddress} isDefaultShipping />
				) : (
					<div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
						No addresses saved yet.
					</div>
				)}
			</section>
		</div>
	);
}
