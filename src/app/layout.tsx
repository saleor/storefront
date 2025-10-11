import "./globals.css";
import "../styles/editorjs.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata } from "next";
import localFont from "next/font/local";
import { ServiceWorkerRegister } from "./sw-register";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";

const geometos = localFont({
	src: "../../public/fonts/Geometos.ttf",
	variable: "--font-geometos",
	display: "swap",
	preload: true,
	fallback: ["sans-serif"],
	adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
	title: {
		default: "Your Store | Premium E-commerce",
		template: "%s | Your Store",
	},
	description:
		"Discover premium products with fast shipping and exceptional customer service. Shop our curated collection of high-quality items.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined,
	keywords: ["e-commerce", "online shopping", "premium products", "fast shipping"],
	authors: [{ name: "Your Store" }],
	creator: "Your Store",
	publisher: "Your Store",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: process.env.NEXT_PUBLIC_STOREFRONT_URL,
		siteName: "Your Store",
		title: "Your Store | Premium E-commerce",
		description: "Discover premium products with fast shipping and exceptional customer service.",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Your Store",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Your Store | Premium E-commerce",
		description: "Discover premium products with fast shipping and exceptional customer service.",
		creator: "@yourstore",
		images: ["/og-image.jpg"],
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
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/icon.svg", type: "image/svg+xml" },
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	verification: {
		google: "your-google-verification-code",
		// yandex: "your-yandex-verification-code",
		// bing: "your-bing-verification-code",
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: [
		{ media: "(prefers-color-scheme: dark)", color: "#121212" },
		{ media: "(prefers-color-scheme: light)", color: "#121212" },
	],
};

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang="en" className={`smooth-scroll min-h-dvh bg-black ${geometos.variable}`}>
			<head>
				{/* Preconnect to external domains */}
				<link rel="preconnect" href={process.env.NEXT_PUBLIC_SALEOR_API_URL} crossOrigin="anonymous" />
				<link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SALEOR_API_URL} />

				{/* Preload critical resources */}
				<link rel="preload" href="/fonts/Geometos.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
			</head>
			<body
				className={`relative min-h-dvh overflow-x-hidden font-sans text-base-50 antialiased ${geometos.className}`}
			>
				{/* Ambient background gradients */}
				<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
					<div
						className="bg-accent-950/20 animate-glow-pulse absolute -left-1/4 top-0 h-1/2 w-1/2 rounded-full blur-3xl"
						style={{ animationDelay: "0s" }}
					></div>
					<div
						className="bg-accent-900/10 animate-glow-pulse absolute -right-1/4 bottom-0 h-1/2 w-1/2 rounded-full blur-3xl"
						style={{ animationDelay: "1.5s" }}
					></div>
					<div className="bg-gradient-radial from-accent-950/5 animate-gradient absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 via-transparent to-transparent opacity-30"></div>
				</div>

				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:font-medium focus:text-black"
				>
					Skip to main content
				</a>
				{children}
				<Suspense>
					<DraftModeNotification />
				</Suspense>
				<ServiceWorkerRegister />
			</body>
		</html>
	);
}
