import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../globals.css";
import { type ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { brandConfig, formatPageTitle } from "@/config/brand";

export const metadata = {
	title: formatPageTitle("Checkout"),
	description: brandConfig.description,
	robots: { index: false, follow: false },
};

/**
 * Checkout surface root layout — its own `<html>`/`<body>` (multiple root layouts).
 *
 * Locale-less surface: `lang` stays the default; checkout copy is localized via the
 * `browse-locale` cookie inside `CheckoutApp`. No storefront chrome (header/footer).
 */
export default function CheckoutLayout(props: { children: ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh`}>
			<body className="min-h-dvh font-sans">
				<main className="min-h-dvh">{props.children}</main>
				<SpeedInsights />
			</body>
		</html>
	);
}
