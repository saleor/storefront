import { type ReactNode, Suspense } from "react";
import { type Metadata } from "next";
import { resolveLocaleFromSlug } from "@/config/locale";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { buildPolicyLabelValues, formatPolicyAwareLabel } from "@/lib/content";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { getStorefrontContent } from "@/lib/content/server";
import { CartDrawerWrapper } from "@/ui/components/cart/cart-drawer-wrapper";
import { StorefrontProviders } from "@/ui/components/storefront-providers";
import { brandConfig } from "@/config/brand";
import { MainChrome } from "./main-chrome";

// Define the title template here so it cascades to every browse page (products, search,
// categories, …) — a plain-string title would not propagate the brand suffix to children.
export const metadata: Metadata = {
	title: { default: brandConfig.siteName, template: brandConfig.titleTemplate },
	description: brandConfig.description,
};

export default async function RootLayout(props: {
	children: ReactNode;
	params: Promise<{ locale: string; channel: string }>;
}) {
	const { locale: localeSlug, channel } = await props.params;
	const content = await getStorefrontContent(channel, localeSlug);
	const currency = await resolveChannelCurrency(channel);
	const policyValues = buildPolicyLabelValues(content.policies, {
		currency,
		locale: resolveLocaleFromSlug(localeSlug).bcp47,
	});

	// Interpolate channel-wide policy values into the announcement so the advertised
	// threshold always matches the cart's free-shipping math (single source of truth).
	const chrome = {
		...content.chrome,
		announcementBar: {
			...content.chrome.announcementBar,
			message: formatPolicyAwareLabel(content.chrome.announcementBar.message, policyValues, {
				defaultTemplate: defaultStorefrontContent.chrome.announcementBar.message,
				context: "announcementBar.message",
			}),
		},
	};

	return (
		<StorefrontProviders>
			<MainChrome locale={localeSlug} channel={channel} chrome={chrome}>
				{props.children}
			</MainChrome>
			<Suspense fallback={null}>
				<CartDrawerWrapper
					channel={channel}
					localeSlug={localeSlug}
					cart={content.surfaces.cart}
					policies={content.policies}
				/>
			</Suspense>
		</StorefrontProviders>
	);
}
