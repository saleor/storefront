import "./globals.css";
import "../styles/editorjs.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toast.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata } from "next";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import { ServiceWorkerRegister } from "./sw-register";
import { ScrollRestoration } from "./scroll-restoration";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";
import { StructuredData } from "@/ui/components/StructuredData";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { CookieConsent } from "@/components/CookieConsent";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";

const geometos = localFont({
	src: "../../public/fonts/Geometos.ttf",
	variable: "--font-geometos",
	display: "swap",
	fallback: ["sans-serif"],
	adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
	title: {
		default: SITE_CONFIG.name,
		template: `%s | ${SITE_CONFIG.name}`,
	},
	description: SITE_CONFIG.description,
	metadataBase: new URL(SITE_CONFIG.url),
	keywords: [
		"guitar tones",
		"cab impulse responses",
		"IR",
		"amp captures",
		"neural captures",
		"guitar plugins",
		"rock guitar tone",
		"metal guitar tone",
		"professional audio",
		"guitar cab simulation",
	],
	authors: [{ name: SITE_CONFIG.name }],
	creator: SITE_CONFIG.name,
	publisher: SITE_CONFIG.name,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: SITE_CONFIG.locale,
		url: SITE_CONFIG.url,
		siteName: SITE_CONFIG.name,
		title: SITE_CONFIG.name,
		description: SITE_CONFIG.description,
		images: [
			{
				url: SITE_CONFIG.image,
				width: 1200,
				height: 630,
				alt: SITE_CONFIG.name,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_CONFIG.name,
		description: SITE_CONFIG.description,
		creator: SITE_CONFIG.twitter.creator,
		site: SITE_CONFIG.twitter.site,
		images: [SITE_CONFIG.image],
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
	// Icons are defined by icon.png and apple-icon.png in the app directory
	manifest: "/site.webmanifest",
	verification: {
		// Add your verification codes here
		// google: "your-google-verification-code",
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
		<html lang="en" className={`min-h-dvh bg-black ${geometos.variable}`}>
			<head>
				{/* Preconnect to external domains */}
				<link rel="preconnect" href={process.env.NEXT_PUBLIC_SALEOR_API_URL} crossOrigin="anonymous" />
				<link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SALEOR_API_URL} />

				{/* Structured Data for SEO */}
				<StructuredData data={[generateOrganizationSchema(), generateWebsiteSchema()]} />
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
				<CookieConsentProvider>
					{children}
					<Suspense>
						<DraftModeNotification />
					</Suspense>
					<Suspense fallback={null}>
						<ScrollRestoration />
					</Suspense>
					<ServiceWorkerRegister />
					<ToastContainer
						position="top-right"
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="dark"
						style={{ marginTop: "1rem", zIndex: 9999 }}
					/>
					<CookieConsent />
				</CookieConsentProvider>
			</body>
		</html>
	);
}
