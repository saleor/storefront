import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CurrentUserOrdersPaginatedDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { hasAuthSession } from "@/lib/auth/has-auth-session";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { OrderRow } from "@/ui/components/account/order-row";
import { buildOrderRowLabels } from "@/ui/components/account/order-row-labels";
import { accountRoutes } from "@/ui/components/account/routes";

export async function RecentOrdersSection({ localeSlug }: { localeSlug: string }) {
	if (!(await hasAuthSession())) {
		return null;
	}

	const t = await getTranslations({ locale: localeSlug, namespace: "account.overview" });
	const tErrors = await getTranslations({ locale: localeSlug, namespace: "account.errors" });
	const tOrder = await getTranslations({ locale: localeSlug, namespace: "account" });
	const tStatus = await getTranslations({ locale: localeSlug, namespace: "account.orderStatus" });

	const result = await executeAuthenticatedGraphQL(CurrentUserOrdersPaginatedDocument, {
		variables: { first: 3, after: null, ...graphqlLanguageCodeVariables(localeSlug) },
		cache: "no-cache",
	});

	if (!result.ok) {
		return (
			<section>
				<h2 className="mb-4 text-lg font-semibold">{t("recentOrders")}</h2>
				<div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
					{tErrors("loadRecentOrdersFailed")}
				</div>
			</section>
		);
	}

	const orders = result.data.me?.orders?.edges ?? [];

	return (
		<section>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold">{t("recentOrders")}</h2>
				{orders.length > 0 && (
					<LinkWithChannel
						href={accountRoutes.orders}
						className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						{t("viewAll")}
						<ChevronRight className="h-4 w-4" />
					</LinkWithChannel>
				)}
			</div>

			{orders.length === 0 ? (
				<div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
					{t("noOrdersYet")}
				</div>
			) : (
				<div className="space-y-2">
					{orders.map(({ node: order }) => (
						<OrderRow
							key={order.id}
							order={order}
							localeSlug={localeSlug}
							labels={buildOrderRowLabels(tOrder, tStatus, order)}
						/>
					))}
				</div>
			)}
		</section>
	);
}
