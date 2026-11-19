import { Suspense } from "react";
import { Receipt, ArrowLeft } from "lucide-react";
import { getBuyAgainDemoOrders } from "@/lib/custom/get-buy-again";
import { BuyAgainHistory } from "@/ui/components/account/buy-again-history";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

export const metadata = { title: "Buy again — design review", robots: { index: false, follow: false } };

type Props = {
	params: Promise<{ locale: string; channel: string }>;
	searchParams: Promise<{ approach?: string }>;
};

export default function BuyAgainReviewPage(props: Props) {
	return (
		<Suspense fallback={<div className="container-content py-section-sm">Loading order history…</div>}>
			<ReviewContent {...props} />
		</Suspense>
	);
}

async function ReviewContent({ params, searchParams }: Props) {
	const [{ locale, channel }, { approach }] = await Promise.all([params, searchParams]);
	const orders = await getBuyAgainDemoOrders(channel);
	return (
		<div className="container-content py-8 sm:py-12">
			<div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground">
				<span>
					<strong className="text-foreground">Design review</strong> · Sample order history, live catalog &
					real demo cart. No sign-in needed.
				</span>
				<span>Three approaches · English preview</span>
			</div>
			<div className="flex flex-col gap-8 md:flex-row md:gap-12">
				<aside className="shrink-0 md:w-44">
					<LinkWithChannel
						href="/"
						className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to store
					</LinkWithChannel>
					<div className="hidden md:block">
						<div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background">
							JD
						</div>
						<p className="font-semibold">Jamie’s account</p>
						<p className="mt-1 text-xs text-muted-foreground">Sample customer</p>
					</div>
					<div className="mt-8 flex items-center gap-3 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background">
						<Receipt className="h-4 w-4" />
						Order history
					</div>
					<p className="mt-4 hidden text-xs leading-relaxed text-muted-foreground md:block">
						Same orders.
						<br />
						Three ways to buy again.
					</p>
				</aside>
				<div className="min-w-0 flex-1">
					<BuyAgainHistory
						orders={orders}
						locale={locale}
						approach={approach === "inline" || approach === "panel" ? approach : "quick"}
						demo
					/>
				</div>
			</div>
		</div>
	);
}
