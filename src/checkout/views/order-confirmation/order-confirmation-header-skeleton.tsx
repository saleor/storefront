import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/ui/components/shared/logo";

const Bone = ({ className }: { className?: string }) => (
	<div className={cn("animate-pulse rounded bg-muted", className)} />
);

/** Header chrome for order-confirmation loading states — no i18n (safe outside `CheckoutIntlProvider`). */
export function OrderConfirmationHeaderSkeleton() {
	return (
		<header className="bg-background md:border-b md:border-border">
			<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<Logo className="h-7 w-auto" />

					<div className="flex items-center gap-1.5 text-muted-foreground" aria-hidden="true">
						<Lock className="h-3.5 w-3.5" />
						<Bone className="h-3 w-24" />
					</div>
				</div>
			</div>
		</header>
	);
}
