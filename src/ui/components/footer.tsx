import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { StorefrontRegionPicker } from "./storefront-region-picker";
import {
	getStaticStorefrontChannelSlugs,
	needsAsyncChannelDiscovery,
	shouldFetchChannelMetadata,
	toChannelSelectOptions,
} from "@/config/channels";
import { getCachedChannelsList } from "@/lib/channels/get-channels-data";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import { getFooterMenuItems } from "@/lib/menus/get-menu-data";
import { getStorefrontContent } from "@/lib/content/server";
import { getStorefrontLocaleOptions } from "@/lib/locale-display";
import { FooterMenuColumns } from "./footer-menu-columns";
import { CopyrightText } from "./copyright-text";
import { FooterAttribution } from "./footer-attribution";
import { FooterPhotoCredits } from "./footer-photo-credits";
import { brandConfig } from "@/config/brand";
import { IMPRINT_PATH, LEGAL_PAGE_KEYS } from "@/config/legal";
import { resolveLocaleFromSlug } from "@/config/locale";
import { getLegalLinks } from "@/lib/catalog/get-legal-links";
import { getSellerIdentity } from "@/lib/channels/get-seller-identity";
import { sellerAddressLines } from "@/lib/channels/seller-identity";
import { PriceNote } from "./price-note";
import { Logo } from "./shared/logo";

import { buildStorefrontPath } from "@/lib/storefront-path";

const legalLinkClass = "text-xs text-inverse-muted transition-colors hover:text-inverse-subtle";

export async function Footer({ locale, channel }: { locale: string; channel: string }) {
	const resolvedSlugs = needsAsyncChannelDiscovery()
		? await getStorefrontChannelSlugs()
		: getStaticStorefrontChannelSlugs();

	const [menuItems, channels, content, seller, legalLinks, tLegal] = await Promise.all([
		getFooterMenuItems(channel, locale),
		shouldFetchChannelMetadata(resolvedSlugs) ? getCachedChannelsList() : Promise.resolve(null),
		getStorefrontContent(channel, locale),
		getSellerIdentity(),
		getLegalLinks(locale),
		getTranslations({ locale, namespace: "legal.footer" }),
	]);

	// Who sells, on every page: the legal name is in the copyright line, the address under
	// it. The imprint has the rest.
	const sellerAddressLine = seller?.address
		? sellerAddressLines(seller.address, resolveLocaleFromSlug(locale).bcp47).join(" · ")
		: null;
	// Only pages that exist: the imprint needs a seller, the rest need their Saleor Page.
	const legalNav = [
		...(seller ? [{ label: tLegal("imprint"), path: IMPRINT_PATH }] : []),
		...LEGAL_PAGE_KEYS.flatMap((key) => {
			const link = legalLinks[key];
			return link ? [{ label: link.title, path: link.path }] : [];
		}),
	];

	const footerMenuItems = menuItems ?? [];
	const localeOptions = getStorefrontLocaleOptions();
	const selectorChannels =
		channels?.channels && resolvedSlugs.length > 0
			? toChannelSelectOptions(channels.channels, resolvedSlugs)
			: [];

	return (
		<footer className="bg-foreground text-background">
			{/* Extra bottom padding on mobile to account for sticky add-to-cart bar */}
			<div className="container-content pb-24 pt-12 sm:pb-12 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link href={buildStorefrontPath(locale, channel)} className="mb-4 inline-block">
							<Logo className="h-7 w-auto" inverted />
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-inverse-subtle">{brandConfig.tagline}</p>
					</div>

					<FooterMenuColumns items={footerMenuItems} />
				</div>

				{/* Language + market — hidden when only one option on each axis */}
				{(localeOptions.length > 1 || selectorChannels.length > 1) && (
					<div className="mt-10">
						<StorefrontRegionPicker locales={localeOptions} channels={selectorChannels} variant="inverted" />
					</div>
				)}

				{/* Covers every price on the page that has no note of its own (listing cards, search). */}
				<PriceNote channel={channel} locale={locale} variant="all" className="mt-10 text-inverse-muted" />

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-inverse pt-8 sm:flex-row">
					<div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
						<p className="text-xs text-inverse-muted">
							{/* The year is read at request time; the shell keeps the line's height. */}
							<Suspense fallback={"\u00a0"}>
								<CopyrightText holder={seller?.legalName} />
							</Suspense>
						</p>
						{sellerAddressLine ? <p className="text-xs text-inverse-muted">{sellerAddressLine}</p> : null}
						<FooterAttribution />
						<FooterPhotoCredits credits={content.surfaces.homepage.photoCredits} />
					</div>
					{legalNav.length > 0 ? (
						<nav
							aria-label={tLegal("navLabel")}
							className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end"
						>
							{legalNav.map((link) => (
								<Link
									key={link.path}
									href={buildStorefrontPath(locale, channel, link.path)}
									prefetch={false}
									className={legalLinkClass}
								>
									{link.label}
								</Link>
							))}
						</nav>
					) : null}
				</div>
			</div>
		</footer>
	);
}
