import { Truck, RotateCcw, Shield, CreditCard } from "lucide-react";

const badges = [
	{
		icon: Truck,
		title: "Free Shipping",
		description: "On orders over $50",
	},
	{
		icon: RotateCcw,
		title: "Easy Returns",
		description: "30-day return policy",
	},
	{
		icon: Shield,
		title: "Secure Checkout",
		description: "SSL encrypted payment",
	},
	{
		icon: CreditCard,
		title: "Flexible Payment",
		description: "Multiple payment options",
	},
];

export function TrustBadges() {
	return (
		<section className="border-b border-secondary-200 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{badges.map((badge) => {
						const Icon = badge.icon;
						return (
							<div key={badge.title} className="flex items-center gap-3">
								<div className="flex-shrink-0 p-2 rounded-full bg-primary-50">
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
