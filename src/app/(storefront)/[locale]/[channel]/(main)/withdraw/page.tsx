import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WITHDRAW_PATH } from "@/config/legal";
import { isWithdrawalAvailable } from "@/lib/withdrawals/availability";
import { buildInitialWithdrawState } from "@/lib/withdrawals/flow";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { PageContentSkeleton } from "@/ui/components/page-content-skeleton";
import { WithdrawFlow } from "@/ui/components/withdraw/withdraw-flow";

type WithdrawParams = Promise<{ locale: string; channel: string }>;
type WithdrawSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata(props: { params: WithdrawParams }): Promise<Metadata> {
	const params = await props.params;
	const t = await getTranslations({ locale: params.locale, namespace: "withdraw.meta" });
	return {
		...buildBrowsePageMetadata({
			title: t("title"),
			description: t("description"),
			locale: params.locale,
			channel: params.channel,
			pathSuffix: WITHDRAW_PATH,
		}),
		robots: { index: false, follow: true },
	};
}

/**
 * The withdrawal function: two labelled steps ("Vertrag widerrufen", "Widerruf bestätigen")
 * and a receipt. `?order=` carries the order's ID from the order emails or the account pages.
 * Only on channels that ship to the EU or EEA, unless `src/config/withdrawals.ts` says otherwise.
 */
export default function WithdrawPage(props: { params: WithdrawParams; searchParams: WithdrawSearchParams }) {
	return (
		<Suspense fallback={<PageContentSkeleton />}>
			<WithdrawContent params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

async function WithdrawContent(props: { params: WithdrawParams; searchParams: WithdrawSearchParams }) {
	const [{ locale, channel }, searchParams] = await Promise.all([props.params, props.searchParams]);
	if (!(await isWithdrawalAvailable(channel))) {
		notFound();
	}
	const order = searchParams.order;
	const initialState = await buildInitialWithdrawState({
		locale,
		channel,
		orderId: typeof order === "string" && order.length <= 200 ? order : null,
	});

	return (
		<div className="container-prose py-8 pb-16">
			<WithdrawFlow initialState={initialState} />
		</div>
	);
}
