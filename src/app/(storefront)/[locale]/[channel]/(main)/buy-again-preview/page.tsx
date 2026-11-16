import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Package, UserRound, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import { getBuyAgainPreview } from "@/lib/custom/get-buy-again";
import { BuyAgainHistory } from "@/ui/components/account/buy-again-history";
import { AccountOrdersListSkeleton } from "@/ui/components/account/account-skeleton";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

type Props = {
	params: Promise<{ locale: string; channel: string }>;
	searchParams: Promise<{ approach?: string }>;
};

export default function BuyAgainPreview(props: Props) {
	if (process.env.NODE_ENV !== "development") notFound();
	return (
		<Suspense fallback={<AccountOrdersListSkeleton />}>
			<PreviewContent {...props} />
		</Suspense>
	);
}

async function PreviewContent({ params, searchParams }: Props) {
	const [{ locale, channel }, { approach }] = await Promise.all([params, searchParams]);
	const [orders, t] = await Promise.all([
		getBuyAgainPreview(channel),
		getTranslations({ locale, namespace: "buyAgain" }),
	]);
	return (
		<div className="container-content py-8 sm:py-12">
			<LinkWithChannel
				href="/"
				className="mb-8 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="h-3 w-3" />
				{t("backToShop")}
			</LinkWithChannel>
			<div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
				<aside className="hidden lg:block">
					<div className="mb-8 flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
							<UserRound className="h-5 w-5" />
						</div>
						<div>
							<p className="text-sm font-semibold">{t("demoCustomer")}</p>
							<p className="mt-1 text-xs text-muted-foreground">{t("reviewMode")}</p>
						</div>
					</div>
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-3 rounded-lg bg-secondary px-4 py-3 font-medium text-secondary-foreground">
							<Package className="h-4 w-4" />
							{t("title")}
						</div>
						<div className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
							<UserRound className="h-4 w-4" />
							{t("profile")}
						</div>
						<div className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
							<MapPin className="h-4 w-4" />
							{t("addresses")}
						</div>
						<div className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
							<CreditCard className="h-4 w-4" />
							{t("payments")}
						</div>
					</div>
					<p className="mt-8 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
						{t("sidebarNote")}
					</p>
				</aside>
				<div className="min-w-0">
					<div className="mb-8 flex flex-wrap items-start justify-between gap-4">
						<div>
							<p className="mb-3 text-eyebrow text-muted-foreground">{t("yourAccount")}</p>
							<h1 className="text-h1">{t("title")}</h1>
							<p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p>
						</div>
						<span className="rounded-full border px-3 py-1.5 text-xs font-medium">{t("reviewBadge")}</span>
					</div>
					<BuyAgainHistory
						orders={orders}
						channel={channel}
						localeSlug={locale}
						review
						initialApproach={approach === "preview" || approach === "shelf" ? approach : "compact"}
					/>
				</div>
			</div>
		</div>
	);
}
