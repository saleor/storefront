import Link from "next/link";
import { Lock } from "lucide-react";
import { type ReactNode } from "react";

import { Logo } from "@/ui/components/shared/logo";

type OrderConfirmationPageShellProps = {
	children: ReactNode;
};

/** Minimal chrome for order confirmation — no checkout step indicator. */
export function OrderConfirmationPageShell({ children }: OrderConfirmationPageShellProps) {
	return (
		<div className="min-h-screen overscroll-none bg-secondary">
			<header className="bg-background md:border-b md:border-border">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center">
							<Logo className="h-7 w-auto" />
						</Link>

						<div className="flex items-center gap-1.5 text-muted-foreground">
							<Lock className="h-3.5 w-3.5" />
							<span className="text-xs">Secure checkout</span>
						</div>
					</div>
				</div>
			</header>
			{children}
		</div>
	);
}
