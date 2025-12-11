import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata } from "next";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";
import { Analytics } from "@/ui/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Luxior Mall | Premium Shopping Experience",
		template: "%s | Luxior Mall",
	},
	description: "Discover premium products at Luxior Mall. Shop the latest fashion, electronics, home goods and more with free shipping on orders over $50.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined,
	keywords: ["shopping", "e-commerce", "fashion", "electronics", "home goods", "online store"],
	authors: [{ name: "Luxior Mall" }],
	creator: "Luxior Mall",
	publisher: "Luxior Mall",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: "Luxior Mall",
		title: "Luxior Mall | Premium Shopping Experience",
		description: "Discover premium products at Luxior Mall. Shop the latest fashion, electronics, home goods and more.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Luxior Mall | Premium Shopping Experience",
		description: "Discover premium products at Luxior Mall.",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang="en" className="min-h-dvh">
			<body className={`${inter.className} min-h-dvh`}>
				{children}
				<Suspense>
					<DraftModeNotification />
				</Suspense>
				<Analytics />
			</body>
		</html>
	);
}
