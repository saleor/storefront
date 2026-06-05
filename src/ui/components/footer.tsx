import Link from "next/link";
import { ChannelSelect } from "./channel-select";
import {
	getStaticStorefrontChannelSlugs,
	needsAsyncChannelDiscovery,
	shouldFetchChannelMetadata,
	toChannelSelectOptions,
} from "@/config/channels";
import { getCachedChannelsList } from "@/lib/channels/get-channels-data";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import { getFooterMenuItems } from "@/lib/menus/get-menu-data";
import { FooterMenuColumns } from "./footer-menu-columns";
import { CopyrightText } from "./copyright-text";
import { Logo } from "./shared/logo";

export async function Footer({ channel }: { channel: string }) {
	const resolvedSlugs = needsAsyncChannelDiscovery()
		? await getStorefrontChannelSlugs()
		: getStaticStorefrontChannelSlugs();

	const [menuItems, channels] = await Promise.all([
		getFooterMenuItems(channel),
		shouldFetchChannelMetadata(resolvedSlugs) ? getCachedChannelsList() : Promise.resolve(null),
	]);

	const footerMenuItems = menuItems ?? [];
	const selectorChannels =
		channels?.channels && resolvedSlugs.length > 0
			? toChannelSelectOptions(channels.channels, resolvedSlugs)
			: [];

	return (
		<footer className="bg-foreground text-background">
			{/* Extra bottom padding on mobile to account for sticky add-to-cart bar */}
			<div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-12 lg:px-8 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link href={`/${channel}`} prefetch={false} className="mb-4 inline-block">
							<Logo className="h-7 w-auto" inverted />
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
							Minimal design, maximum impact. Thoughtfully crafted essentials for everyday comfort.
						</p>
					</div>

					<FooterMenuColumns items={footerMenuItems} />
				</div>

				{/* Channel selector — only storefront channels, hidden when single-channel */}
				{selectorChannels.length > 1 && (
					<div className="mt-8 text-neutral-400">
						<label className="flex items-center gap-2 text-sm">
							<span>Change currency:</span>
							<ChannelSelect channels={selectorChannels} />
						</label>
					</div>
				)}

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">
					<p className="text-xs text-neutral-500">
						<CopyrightText />
					</p>
					<div className="flex items-center gap-6">
						<Link
							href="/privacy"
							prefetch={false}
							className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							prefetch={false}
							className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
