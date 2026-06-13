"use client";

import { useStorefrontRegionNavigation } from "@/hooks/use-storefront-region-navigation";
import type { LocaleSelectOption } from "@/lib/locale-display";
import { cn } from "@/lib/utils";

export const LocaleSelect = ({
	locales,
	variant = "default",
	className,
}: {
	locales: LocaleSelectOption[];
	variant?: "default" | "inverted";
	className?: string;
}) => {
	const { locale, navigateToLocale } = useStorefrontRegionNavigation();

	return (
		<select
			id="storefront-locale-select"
			aria-label="Language"
			className={cn(
				"h-10 w-fit rounded-md border px-4 py-2 pr-10 text-sm",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				"disabled:cursor-not-allowed disabled:opacity-50",
				variant === "inverted"
					? "border-inverse bg-transparent text-inverse-subtle focus-visible:ring-offset-foreground"
					: "border-input bg-background text-foreground focus-visible:ring-offset-background",
				className,
			)}
			onChange={(e) => navigateToLocale(e.currentTarget.value)}
			value={locale}
		>
			{locales.map((item) => (
				<option key={item.slug} value={item.slug} lang={item.slug}>
					{item.label}
				</option>
			))}
		</select>
	);
};
