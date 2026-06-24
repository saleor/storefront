import Link from "next/link";
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
import { Logo } from "./shared/logo";

import { buildStorefrontPath } from "@/lib/storefront-path";

export async function Footer({ locale, channel }: { locale: string; channel: string }) {
	const resolvedSlugs = needsAsyncChannelDiscovery()
		? await getStorefrontChannelSlugs()
		: getStaticStorefrontChannelSlugs();

	const [menuItems, channels, content] = await Promise.all([
		getFooterMenuItems(channel, locale),
		shouldFetchChannelMetadata(resolvedSlugs) ? getCachedChannelsList() : Promise.resolve(null),
		getStorefrontContent(channel, locale),
	]);

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
						<Link href={buildStorefrontPath(locale, channel)} prefetch={false} className="mb-4 inline-block">
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

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-inverse pt-8 sm:flex-row">
					<div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
						<p className="text-xs text-inverse-muted">
							<CopyrightText />
						</p>
						<FooterAttribution />
						<FooterPhotoCredits credits={content.surfaces.homepage.photoCredits} />
					</div>
					<div className="flex items-center gap-6">
						<Link
							href="/privacy"
							prefetch={false}
							className="text-xs text-inverse-muted transition-colors hover:text-inverse-subtle"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							prefetch={false}
							className="text-xs text-inverse-muted transition-colors hover:text-inverse-subtle"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
