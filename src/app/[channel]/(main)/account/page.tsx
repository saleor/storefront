import { Suspense } from "react";
import { AccountOverviewWelcome } from "@/ui/components/account/account-overview-header";
import { AccountOverviewDefaultAddress } from "@/ui/components/account/account-overview-default-address";
import { RecentOrdersSection } from "@/ui/components/account/recent-orders-section";

export default function AccountOverviewPage() {
	return (
		<div className="space-y-8">
			<AccountOverviewWelcome />

			<Suspense fallback={<RecentOrdersSkeleton />}>
				<RecentOrdersSection />
			</Suspense>

			<AccountOverviewDefaultAddress />
		</div>
	);
}

function RecentOrdersSkeleton() {
	return (
		<section>
			<div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
			<div className="space-y-2">
				{[1, 2, 3].map((i) => (
					<div key={i} className="bg-muted/30 h-16 animate-pulse rounded-lg border" />
				))}
			</div>
		</section>
	);
}
