import { type ReactNode, Suspense } from "react";
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
	params: Promise<{ channel: string }>;
}) {
	const channel = (await props.params).channel;

	return (
		<StorefrontProviders>
			<MainChrome channel={channel}>{props.children}</MainChrome>
			<Suspense fallback={null}>
				<CartDrawerWrapper channel={channel} />
			</Suspense>
		</StorefrontProviders>
	);
}
