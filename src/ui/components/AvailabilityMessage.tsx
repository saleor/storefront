import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

type Props = {
	isAvailable: boolean;
	quantityAvailable?: number | null;
	lowStockThreshold?: number;
};

export const AvailabilityMessage = ({ isAvailable, quantityAvailable, lowStockThreshold = 5 }: Props) => {
	// Out of stock
	if (!isAvailable || quantityAvailable === 0) {
		return (
			<div className="flex items-center gap-2 text-red-600">
				<XCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
				<span className="text-sm font-medium">Out of Stock</span>
			</div>
		);
	}

	// Low stock warning
	if (quantityAvailable && quantityAvailable <= lowStockThreshold) {
		return (
			<div className="flex items-center gap-2 text-amber-600">
				<AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
				<span className="text-sm font-medium">Only {quantityAvailable} left in stock - order soon!</span>
			</div>
		);
	}

	// In stock
	return (
		<div className="flex items-center gap-2 text-green-600">
			<CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
			<span className="text-sm font-medium">In Stock</span>
		</div>
	);
};
