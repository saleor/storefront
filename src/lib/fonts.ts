import { GeistSans } from "geist/font/sans";
import { Fraunces } from "next/font/google";
import { isEditorialTypography } from "@/config/typography-theme";
import { cn } from "@/lib/utils";

/** Fraunces for Direction A — must be initialized unconditionally (Next.js font loader rule). */
const frauncesDisplay = Fraunces({
	subsets: ["latin"],
	variable: "--font-fraunces",
	display: "swap",
	adjustFontFallback: true,
});

export type RootHtmlFontProps = {
	lang: string;
	className: string;
	/** Dismiss island may set attrs/styles on `<html>` after click. */
	suppressHydrationWarning: true;
	"data-typography"?: "editorial";
};

/** Shared `<html>` font classes + optional editorial data attribute for browse layouts.
 *  Geist Mono is imported only from checkout / `global-error` so browse documents
 *  do not download a font those surfaces use. */
export function getRootHtmlFontProps(htmlLang: string): RootHtmlFontProps {
	const editorial = isEditorialTypography();

	return {
		lang: htmlLang,
		className: cn(GeistSans.variable, editorial && frauncesDisplay.variable, "min-h-dvh"),
		suppressHydrationWarning: true,
		...(editorial ? { "data-typography": "editorial" as const } : {}),
	};
}
