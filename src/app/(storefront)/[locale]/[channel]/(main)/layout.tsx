import { type ReactNode, Suspense } from "react";
import { getStorefrontContent } from "@/lib/content/server";
import { CartDrawerWrapper } from "@/ui/components/cart/cart-drawer-wrapper";
import { StorefrontProviders } from "@/ui/components/storefront-providers";
import { brandConfig } from "@/config/brand";
import { MainChrome } from "./main-chrome";

export const metadata = {
	title: brandConfig.siteName,
	description: brandConfig.description,
};

export default async function RootLayout(props: {
	children: ReactNode;
	params: Promise<{ locale: string; channel: string }>;
}) {
	const { locale: localeSlug, channel } = await props.params;
	const content = await getStorefrontContent(channel, localeSlug);

	return (
		<StorefrontProviders>
			<MainChrome locale={localeSlug} channel={channel} chrome={content.chrome}>
				{props.children}
			</MainChrome>
			<Suspense fallback={null}>
				<CartDrawerWrapper channel={channel} cart={content.surfaces.cart} />
			</Suspense>
		</StorefrontProviders>
	);
}
