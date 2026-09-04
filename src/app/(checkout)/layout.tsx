import "../globals.css";
import { type ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getDefaultLocaleSlug, resolveLocaleFromSlug } from "@/config/locale";
import { getRootHtmlFontProps } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { speedInsightsSampleRate } from "@/lib/speed-insights";

const defaultHtmlLang = resolveLocaleFromSlug(getDefaultLocaleSlug()).htmlLang;

/**
 * Checkout surface root layout — its own `<html>`/`<body>` (multiple root layouts).
 *
 * Locale-less surface: no `cookies()` here (blocks the route outside Suspense).
 * `html lang` defaults to `NEXT_PUBLIC_DEFAULT_LOCALE`; `CheckoutBrowseProvider`
 * syncs the resolved browse locale after RSC loads inside page Suspense.
 */
export default function CheckoutLayout(props: { children: ReactNode }) {
	const htmlProps = getRootHtmlFontProps(defaultHtmlLang);

	return (
		<html {...htmlProps} className={cn(htmlProps.className, GeistMono.variable)}>
			<body className="min-h-dvh font-sans">
				<main className="min-h-dvh">{props.children}</main>
				{/* Sampled — unsampled Speed Insights dominates the Vercel bill at scale. */}
				<SpeedInsights sampleRate={speedInsightsSampleRate()} />
			</body>
		</html>
	);
}
