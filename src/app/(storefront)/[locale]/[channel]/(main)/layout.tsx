import { type ReactNode, Suspense } from "react";
import { type Metadata } from "next";
import { StorefrontProviders } from "@/ui/components/storefront-providers";
import { brandConfig } from "@/config/brand";
import { CartDrawerSlot } from "./browse-chrome-slots";
import { MainChrome } from "./main-chrome";

// Define the title template here so it cascades to every browse page (products, search,
// categories, …) — a plain-string title would not propagate the brand suffix to children.
export const metadata: Metadata = {
	title: { default: brandConfig.siteName, template: brandConfig.titleTemplate },
	description: brandConfig.description,
};

type LayoutProps = {
	children: ReactNode;
	params: Promise<{ locale: string; channel: string }>;
};

export default function RootLayout({ children, params }: LayoutProps) {
	return (
		<StorefrontProviders>
			<MainChrome params={params}>{children}</MainChrome>
			<Suspense fallback={null}>
				<CartDrawerSlot params={params} />
			</Suspense>
		</StorefrontProviders>
	);
}
