import { Truck, RotateCcw, Shield } from "lucide-react";
import { getStorePolicies } from "@/lib/content";

export async function ProductPageTrustBadges() {
	const policies = await getStorePolicies();

	return (
		<div className="space-y-3 border-t border-secondary-200 pt-6">
			<div className="flex items-center gap-3 text-sm text-secondary-600">
				<Truck className="h-5 w-5 text-primary-600" />
				<span>Free shipping on orders over KES {policies.freeShippingThreshold}</span>
			</div>
			<div className="flex items-center gap-3 text-sm text-secondary-600">
				<RotateCcw className="h-5 w-5 text-primary-600" />
				<span>{policies.returnPeriodDays}-day free returns</span>
			</div>
			<div className="flex items-center gap-3 text-sm text-secondary-600">
				<Shield className="h-5 w-5 text-primary-600" />
				<span>Secure checkout</span>
			</div>
		</div>
	);
}
