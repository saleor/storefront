import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/ui/components/shared/logo";

const Bone = ({ className }: { className?: string }) => (
	<div className={cn("animate-pulse rounded bg-muted", className)} />
);

type CheckoutHeaderSkeletonProps = {
	step?: number;
	totalSteps?: number;
};

/** Header chrome for loading states — no i18n (safe outside `CheckoutIntlProvider`). */
export function CheckoutHeaderSkeleton({ step = 1, totalSteps = 3 }: CheckoutHeaderSkeletonProps) {
	const progressPercentage = Math.min((step / totalSteps) * 100, 100);

	return (
		<header className="bg-background md:border-b md:border-border">
			<div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 md:pb-4 md:pt-4 lg:px-8">
				<div className="flex items-center justify-between">
					<Logo className="h-7 w-auto" />

					<nav className="hidden items-center gap-2 md:flex" aria-hidden="true">
						{Array.from({ length: totalSteps }, (_, i) => (
							<div key={i} className="flex items-center">
								<div className="flex items-center gap-2">
									<Bone className="h-6 w-6 rounded-full" />
									<Bone className="h-4 w-16" />
								</div>
								{i < totalSteps - 1 && <div className="mx-4 h-px w-8 bg-border" />}
							</div>
						))}
					</nav>

					<div className="flex items-center gap-1.5 text-muted-foreground" aria-hidden="true">
						<Lock className="h-3.5 w-3.5" />
						<Bone className="h-3 w-24" />
					</div>
				</div>

				<div className="mt-3 md:hidden" aria-hidden="true">
					<div className="mb-2 flex items-center justify-between">
						<Bone className="h-3 w-20" />
						<Bone className="h-3 w-16" />
					</div>
					<div className="h-1 overflow-hidden rounded-full bg-muted">
						<div
							className="bg-foreground/30 h-full transition-all duration-300"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
