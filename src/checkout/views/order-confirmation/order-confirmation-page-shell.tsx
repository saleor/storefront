"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode } from "react";

import { useCheckoutBrowseLocale } from "@/checkout/providers/checkout-browse";
import { Logo } from "@/ui/components/shared/logo";
import { StorefrontHomeLink } from "@/ui/components/shared/storefront-home-link";

type OrderConfirmationPageShellProps = {
	children: ReactNode;
	storefrontChannel?: string | null;
};

/** Minimal chrome for order confirmation — no checkout step indicator. */
export function OrderConfirmationPageShell({ children, storefrontChannel }: OrderConfirmationPageShellProps) {
	const storefrontLocale = useCheckoutBrowseLocale();
	const t = useTranslations("checkout.steps");

	return (
		<div className="min-h-screen overscroll-none bg-secondary">
			<header className="bg-background md:border-b md:border-border">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<StorefrontHomeLink
							locale={storefrontLocale}
							channel={storefrontChannel}
							className="flex items-center"
						>
							<Logo className="h-7 w-auto" />
						</StorefrontHomeLink>

						<div className="flex items-center gap-1.5 text-muted-foreground">
							<Lock className="h-3.5 w-3.5" />
							<span className="text-xs">{t("secureCheckout")}</span>
						</div>
					</div>
				</div>
			</header>
			{children}
		</div>
	);
}
