import { type ReactNode, Suspense } from "react";
import { Footer } from "@/ui/components/Footer";
import { Header } from "@/ui/components/Header";
import { CartProvider, CartDrawerWrapper } from "@/ui/components/cart";
import { AuthProvider } from "@/ui/components/AuthProvider";
import { brandConfig } from "@/config/brand";

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
		<AuthProvider>
			<CartProvider>
				<Header channel={channel} />
				<div className="flex min-h-[calc(100dvh-64px)] flex-col">
					<main className="flex-1">{props.children}</main>
					<Footer channel={channel} />
				</div>
				<Suspense fallback={null}>
					<CartDrawerWrapper channel={channel} />
				</Suspense>
			</CartProvider>
		</AuthProvider>
	);
}
