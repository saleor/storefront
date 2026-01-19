import { cn } from "@/lib/utils";

const Bone = ({ className }: { className?: string }) => (
	<div className={cn("animate-pulse rounded bg-muted", className)} />
);

/**
 * Payment section skeleton.
 *
 * Structure mirrors PaymentSection:
 * - py-4 container
 * - Title
 * - Payment method cards
 */
export const PaymentSectionSkeleton = () => (
	<div className="py-4" data-testid="paymentMethods">
		{/* Title */}
		<Bone className="mb-4 h-5 w-36" />
		{/* Payment method options */}
		<div className="flex items-center gap-4 rounded border border-border px-6 py-4">
			<Bone className="h-10 w-20 rounded-md" />
			<Bone className="h-10 w-20 rounded-md" />
			<Bone className="h-10 w-20 rounded-md" />
		</div>
	</div>
);
