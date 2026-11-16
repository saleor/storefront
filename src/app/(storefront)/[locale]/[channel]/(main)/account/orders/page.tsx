import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getCurrentUserOrders } from "@/lib/account/get-orders";
import { hasAuthSession } from "@/lib/auth/has-auth-session";
import { BuyAgainHistory } from "@/ui/components/account/buy-again-history";
import { prepareBuyAgainOrders } from "@/lib/custom/get-buy-again";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { Button } from "@/ui/components/ui/button";
import { accountRoutes } from "@/ui/components/account/routes";
import { AccountOrdersListSkeleton } from "@/ui/components/account/account-skeleton";

const ORDERS_PER_PAGE = 10;

type Props = {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ after?: string; approach?: string }>;
};

export default function AccountOrdersPage({ params, searchParams }: Props) {
	return (
		<Suspense fallback={<AccountOrdersListSkeleton />}>
			<AccountOrdersContent params={params} searchParams={searchParams} />
		</Suspense>
	);
}

async function AccountOrdersContent({ params, searchParams }: Props) {
	const [{ locale }, { after, approach }] = await Promise.all([params, searchParams]);
	const t = await getTranslations({ locale, namespace: "account.orders" });
	const tErrors = await getTranslations({ locale, namespace: "account.errors" });

	if (!(await hasAuthSession())) {
		return <AccountOrdersError title={t("title")} message={t("signInRequired")} />;
	}

	const result = await getCurrentUserOrders(locale, ORDERS_PER_PAGE, after);

	if (!result.ok) {
		return <AccountOrdersError title={t("title")} message={tErrors("loadOrdersFailed")} />;
	}

	if (!result.data.me) {
		return <AccountOrdersError title={t("title")} message={t("signInRequired")} />;
	}

	const ordersConnection = result.data.me.orders;
	const orders = ordersConnection?.edges ?? [];
	const pageInfo = ordersConnection?.pageInfo;
	const totalCount = ordersConnection?.totalCount ?? 0;
	let reorderOrders;
	try {
		reorderOrders = await prepareBuyAgainOrders(orders);
	} catch {
		return (
			<AccountOrdersError
				title={t("title")}
				message="Availability could not be checked. Please refresh and try again."
			/>
		);
	}

	return (
		<div className="space-y-6">
			{orders.length === 0 && (
				<div>
					<h1 className="text-balance text-h1">{t("title")}</h1>
					<p className="mt-1 text-sm text-muted-foreground">{t("count", { count: totalCount })}</p>
				</div>
			)}

			{orders.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<p className="text-muted-foreground">{t("empty")}</p>
				</div>
			) : (
				<>
					<BuyAgainHistory
						orders={reorderOrders}
						locale={locale}
						approach={approach === "inline" || approach === "panel" ? approach : "quick"}
					/>

					{pageInfo?.hasNextPage && pageInfo.endCursor && (
						<div className="flex justify-center pt-2">
							<LinkWithChannel
								href={`${accountRoutes.orders}?after=${encodeURIComponent(pageInfo.endCursor)}&approach=${approach === "inline" || approach === "panel" ? approach : "quick"}`}
							>
								<Button variant="outline-solid">{t("loadMore")}</Button>
							</LinkWithChannel>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function AccountOrdersError({ title, message }: { title: string; message: string }) {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-balance text-h1">{title}</h1>
			</div>
			<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
				{message}
			</div>
		</div>
	);
}
