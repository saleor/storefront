import { Truck, RotateCcw, Shield, CreditCard, LucideIcon } from "lucide-react";
import { getTrustBadges, type TrustBadgeIcon } from "@/lib/content";

const iconMap: Record<TrustBadgeIcon, LucideIcon> = {
	truck: Truck,
	rotate: RotateCcw,
	shield: Shield,
	"credit-card": CreditCard,
};

export async function TrustBadges() {
	const trustBadges = await getTrustBadges();

	if (trustBadges.length === 0) {
		return null;
	}

	return (
		<section className="border-b border-secondary-200 bg-white">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
					{trustBadges.map((badge) => {
						const Icon = iconMap[badge.icon];
						return (
							<div key={badge.title} className="flex items-center gap-3">
								<div className="flex-shrink-0 rounded-full bg-primary-50 p-2">
									<Icon className="h-5 w-5 text-primary-600" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-secondary-900">{badge.title}</h3>
									<p className="text-xs text-secondary-500">{badge.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
