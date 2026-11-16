import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getBuyAgainHistory } from "@/lib/custom/get-buy-again";
import { hasAuthSession } from "@/lib/auth/has-auth-session";
import { BuyAgainHistory } from "@/ui/components/account/buy-again-history";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { Button } from "@/ui/components/ui/button";
import { accountRoutes } from "@/ui/components/account/routes";
import { AccountOrdersListSkeleton } from "@/ui/components/account/account-skeleton";

const ORDERS_PER_PAGE = 10;

type Props = {
	params: Promise<{ locale: string; channel: string }>;
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
	const [{ locale, channel }, { after, approach }] = await Promise.all([params, searchParams]);
	const t = await getTranslations({ locale, namespace: "account.orders" });
	const tErrors = await getTranslations({ locale, namespace: "account.errors" });

	if (!(await hasAuthSession())) {
		return <AccountOrdersError title={t("title")} message={t("signInRequired")} />;
	}

	const result = await getBuyAgainHistory(channel, ORDERS_PER_PAGE, after).catch(() => null);

	if (!result) {
		return <AccountOrdersError title={t("title")} message={tErrors("loadOrdersFailed")} />;
	}

	const { orders, pageInfo, totalCount } = result;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-balance text-h1">{t("title")}</h1>
				<p className="mt-1 text-sm text-muted-foreground">{t("count", { count: totalCount })}</p>
			</div>

			{orders.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<p className="text-muted-foreground">{t("empty")}</p>
				</div>
			) : (
				<>
					<BuyAgainHistory
						orders={orders}
						channel={channel}
						localeSlug={locale}
						initialApproach={approach === "preview" || approach === "shelf" ? approach : "compact"}
					/>

					{pageInfo?.hasNextPage && pageInfo.endCursor && (
						<div className="flex justify-center pt-2">
							<LinkWithChannel href={`${accountRoutes.orders}?after=${pageInfo.endCursor}`}>
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
