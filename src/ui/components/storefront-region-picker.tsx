"use client";

import type { ReactNode } from "react";
import { Check, ChevronDown, Globe, Languages, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ChannelSelectOption } from "@/config/channels";
import { getLocaleDefinition } from "@/config/locale";
import { getLocalesForChannel } from "@/config/locale-channel";
import { useStorefrontRegionNavigation } from "@/hooks/use-storefront-region-navigation";
import type { LocaleSelectOption } from "@/lib/locale-display";
import { enrichMarketOptions, getCurrencySymbol, type MarketSelectOption } from "@/lib/market-display";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu";

type StorefrontRegionPickerProps = {
	locales: LocaleSelectOption[];
	channels: ChannelSelectOption[];
	variant?: "default" | "inverted";
	className?: string;
};

function PickerSection({
	icon: Icon,
	title,
	description,
	children,
}: {
	icon: typeof Globe;
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<section className="min-w-0">
			<div className="mb-2 flex items-start gap-2 px-2">
				<Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
				<div>
					<p className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</p>
					{description ? (
						<p className="text-[11px] leading-snug text-muted-foreground">{description}</p>
					) : null}
				</div>
			</div>
			{children}
		</section>
	);
}

function OptionRow({ label, hint, selected }: { label: string; hint?: string; selected?: boolean }) {
	return (
		<span className="flex min-w-0 flex-1 items-center gap-3">
			<span className="min-w-0 flex-1 truncate font-medium">{label}</span>
			{hint ? (
				<span className="min-w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{hint}</span>
			) : null}
			<span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
				{selected ? <Check className="h-4 w-4 text-foreground" /> : null}
			</span>
		</span>
	);
}

function buildTriggerSummary(
	locale: LocaleSelectOption | undefined,
	market: MarketSelectOption | undefined,
	showLanguage: boolean,
	showMarket: boolean,
	localeBcp47: string,
): string {
	const parts: string[] = [];

	if (showLanguage && locale) {
		parts.push(locale.label);
	}

	if (showMarket && market) {
		const symbol = getCurrencySymbol(market.currencyCode, localeBcp47);
		parts.push(symbol === market.currencyCode ? market.currencyCode : `${symbol} ${market.currencyCode}`);
	}

	return parts.join(" · ");
}

export function StorefrontRegionPicker({
	locales,
	channels,
	variant = "default",
	className,
}: StorefrontRegionPickerProps) {
	const { locale, channel, navigateToLocale, navigateToChannel } = useStorefrontRegionNavigation();
	const t = useTranslations("nav.regionPicker");

	const showLanguage = locales.length > 1;
	const showMarket = channels.length > 1;
	const marketOptions = enrichMarketOptions(channels);

	const allowedLocales = getLocalesForChannel(channel);
	const visibleLocales =
		allowedLocales === null ? locales : locales.filter((item) => allowedLocales.includes(item.slug));

	const currentLocale =
		visibleLocales.find((item) => item.slug === locale) ?? locales.find((item) => item.slug === locale);
	const currentMarket = marketOptions.find((item) => item.slug === channel);
	const localeBcp47 = getLocaleDefinition(locale)?.bcp47 ?? "en-US";
	const summary = buildTriggerSummary(currentLocale, currentMarket, showLanguage, showMarket, localeBcp47);

	if (!showLanguage && !showMarket) {
		return null;
	}

	const inverted = variant === "inverted";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					"group inline-flex max-w-full items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm transition-all",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
					inverted
						? "border-inverse/20 bg-background/5 hover:border-inverse/35 hover:bg-background/10 focus-visible:ring-background/40 text-inverse-subtle hover:text-inverse focus-visible:ring-offset-foreground"
						: "hover:border-border/80 hover:bg-secondary/60 border-border bg-background text-foreground shadow-sm focus-visible:ring-ring focus-visible:ring-offset-background",
					className,
				)}
				aria-label={t("ariaLabel")}
			>
				<Globe
					className={cn(
						"h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-12",
						inverted ? "opacity-80" : "text-muted-foreground",
					)}
					aria-hidden
				/>
				<span className="truncate font-medium">{summary}</span>
				<ChevronDown
					className={cn(
						"h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180",
						inverted ? "opacity-60" : "text-muted-foreground",
					)}
					aria-hidden
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				side="top"
				sideOffset={10}
				collisionPadding={16}
				className={cn(
					"w-[min(calc(100vw-2rem),24rem)] rounded-xl border p-3 shadow-lg",
					showLanguage && showMarket && "sm:w-[28rem]",
				)}
			>
				<div className={cn("grid gap-4", showLanguage && showMarket && "sm:grid-cols-2")}>
					{showLanguage ? (
						<PickerSection icon={Languages} title={t("languageTitle")} description={t("languageDescription")}>
							<DropdownMenuGroup>
								<DropdownMenuRadioGroup value={locale} onValueChange={navigateToLocale}>
									{visibleLocales.map((item) => (
										<DropdownMenuRadioItem
											key={item.slug}
											value={item.slug}
											lang={item.slug}
											className="data-[state=checked]:bg-accent/60 my-0.5 rounded-lg py-2.5 pl-3 pr-3 [&>span:first-child]:hidden"
										>
											<OptionRow label={item.label} selected={item.slug === locale} />
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuGroup>
						</PickerSection>
					) : null}

					{showMarket ? (
						<PickerSection icon={Store} title={t("marketTitle")} description={t("marketDescription")}>
							<DropdownMenuGroup>
								<DropdownMenuRadioGroup value={channel} onValueChange={navigateToChannel}>
									{marketOptions.map((item) => (
										<DropdownMenuRadioItem
											key={item.id}
											value={item.slug}
											className="data-[state=checked]:bg-accent/60 my-0.5 rounded-lg py-2.5 pl-3 pr-3 [&>span:first-child]:hidden"
										>
											<OptionRow
												label={item.displayLabel}
												hint={item.currencyHint}
												selected={item.slug === channel}
											/>
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuGroup>
						</PickerSection>
					) : null}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
