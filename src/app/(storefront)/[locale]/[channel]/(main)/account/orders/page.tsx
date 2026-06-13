import { Suspense } from "react";
import { CurrentUserOrdersPaginatedDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { hasAuthSession } from "@/lib/auth/has-auth-session";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { resolveLocaleFromSlug } from "@/config/locale";
import { OrderRow } from "@/ui/components/account/order-row";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { Button } from "@/ui/components/ui/button";
import { accountRoutes } from "@/ui/components/account/routes";
import { AccountOrdersListSkeleton } from "@/ui/components/account/account-skeleton";

const ORDERS_PER_PAGE = 10;

type Props = {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ after?: string }>;
};

export default function AccountOrdersPage({ params, searchParams }: Props) {
	return (
		<Suspense fallback={<AccountOrdersListSkeleton />}>
			<AccountOrdersContent params={params} searchParams={searchParams} />
		</Suspense>
	);
}

async function AccountOrdersContent({ params, searchParams }: Props) {
	const [{ locale }, { after }] = await Promise.all([params, searchParams]);
	const intlLocale = resolveLocaleFromSlug(locale).bcp47;

	// Gate on a session cookie before the authenticated fetch (mirrors the account layout):
	// during prerender there are no cookies, so this skips the network call that would
	// otherwise hang/retry and time out the sibling `getStorefrontContent` cache fill.
	if (!(await hasAuthSession())) {
		return <AccountOrdersError message="Sign in to view your orders." />;
	}

	const result = await executeAuthenticatedGraphQL(CurrentUserOrdersPaginatedDocument, {
		variables: {
			first: ORDERS_PER_PAGE,
			after: after || null,
			...graphqlLanguageCodeVariables(locale),
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
							<OrderRow key={order.id} order={order} intlLocale={intlLocale} />
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
