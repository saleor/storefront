import { cn } from "@/lib/utils";
import { CheckoutHeader } from "@/checkout/views/saleor-checkout/checkout-header";

/**
 * Skeleton primitive - matches design system tokens.
 */
const Bone = ({ className }: { className?: string }) => (
	<div className={cn("animate-pulse rounded bg-muted", className)} />
);

/**
 * Order confirmation skeleton.
 *
 * Structure mirrors OrderConfirmation:
 * - min-h-screen bg-secondary
 * - CheckoutHeader step={4}
 * - main: mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8
 * - two-column layout same as checkout
 */
export const OrderConfirmationSkeleton = () => (
	<div className="min-h-screen bg-secondary">
		{/* Real header at step 4 */}
		<CheckoutHeader step={4} onStepClick={() => {}} />

		{/* Main content */}
		<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-8 md:flex-row">
				{/* Left column - Confirmation content */}
				<div className="order-2 min-w-0 flex-1 md:order-1">
					<div className="rounded-lg border border-border bg-card p-6 md:p-8">
						<div className="space-y-8">
							{/* Success header */}
							<div className="space-y-4 text-center">
								<div className="flex justify-center">
									<Bone className="h-16 w-16 rounded-full" />
								</div>
								<div className="space-y-2">
									<Bone className="mx-auto h-4 w-24" />
									<Bone className="mx-auto h-7 w-64" />
								</div>
							</div>

							{/* Confirmation card */}
							<div className="overflow-hidden rounded-lg border border-border">
								<div className="bg-secondary/50 border-b border-border p-4">
									<Bone className="h-5 w-48" />
									<Bone className="mt-2 h-4 w-64" />
								</div>
								<div className="space-y-4 p-4">
									{[1, 2, 3, 4].map((i) => (
										<div key={i} className="flex items-start gap-3">
											<Bone className="mt-0.5 h-5 w-5" />
											<div className="space-y-1">
												<Bone className="h-4 w-32" />
												<Bone className="h-4 w-48" />
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Action button */}
							<Bone className="h-12 w-full rounded-md" />
						</div>
					</div>
				</div>

				{/* Right column - Summary */}
				<div className="order-1 md:order-2 md:w-[380px] md:shrink-0">
					<div className="overflow-hidden rounded-lg border border-border bg-card md:sticky md:top-8">
						<SummarySkeleton />
					</div>
				</div>
			</div>
		</main>
	</div>
);

/**
 * Summary skeleton for order confirmation (non-editable).
 */
const SummarySkeleton = () => (
	<article className="divide-y divide-border">
		{/* Header */}
		<header className="bg-secondary/30 flex items-center gap-2 px-5 py-4">
			<Bone className="h-5 w-28" />
			<Bone className="h-4 w-16" />
		</header>

		{/* Products */}
		<section>
			<ul className="max-h-[280px] space-y-1 px-5 py-4">
				{[1, 2, 3].map((i) => (
					<li key={i} className="flex gap-4 py-2">
						<Bone className="h-14 w-14 shrink-0 rounded-lg" />
						<div className="flex min-w-0 flex-1 flex-col justify-center">
							<Bone className="h-4 w-3/4" />
							<Bone className="mt-1 h-3 w-1/2" />
						</div>
						<Bone className="h-4 w-14 self-center" />
					</li>
				))}
			</ul>
		</section>

		{/* Amounts (no promo for confirmation) */}
		<section className="px-5 py-4">
			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<Bone className="h-4 w-16" />
					<Bone className="h-4 w-14" />
				</div>
				<div className="flex justify-between">
					<Bone className="h-4 w-16" />
					<Bone className="h-4 w-12" />
				</div>
			</div>
			<div className="border-border/50 mt-4 flex items-baseline justify-between border-t pt-4">
				<Bone className="h-5 w-12" />
				<Bone className="h-6 w-20" />
			</div>
		</section>

		{/* Trust badges */}
		<footer className="bg-secondary/30 grid grid-cols-3 gap-2 px-5 py-4">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex flex-col items-center rounded-lg bg-secondary p-2.5">
					<Bone className="mb-1 h-4 w-4" />
					<Bone className="h-3 w-10" />
					<Bone className="mt-0.5 h-3 w-12" />
				</div>
			))}
		</footer>
	</article>
);
