import { cn } from "@/lib/utils";

export function ProductsGridSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="mb-4 aspect-[3/4] rounded-xl bg-muted" />
						<div className="space-y-1.5">
							<div className="h-4 w-3/4 rounded bg-muted" />
							<div className="h-4 w-1/2 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
