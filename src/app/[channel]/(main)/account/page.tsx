import { Suspense } from "react";
import { AccountOverviewWelcome } from "@/ui/components/account/account-overview-welcome";
import { AccountOverviewDefaultAddress } from "@/ui/components/account/account-overview-default-address";
import { RecentOrdersSection } from "@/ui/components/account/recent-orders-section";
import { RecentOrdersSectionSkeleton } from "@/ui/components/account/account-skeleton";

export default function AccountOverviewPage() {
	return (
		<div className="space-y-8">
			<AccountOverviewWelcome />

			<Suspense fallback={<RecentOrdersSectionSkeleton />}>
				<RecentOrdersSection />
			</Suspense>

			<AccountOverviewDefaultAddress />
		</div>
	);
}
