import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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
	"data-typography"?: "editorial";
};

/** Shared `<html>` font classes + optional editorial data attribute for all root layouts. */
export function getRootHtmlFontProps(htmlLang: string): RootHtmlFontProps {
	const editorial = isEditorialTypography();

	return {
		lang: htmlLang,
		className: cn(GeistSans.variable, GeistMono.variable, editorial && frauncesDisplay.variable, "min-h-dvh"),
		...(editorial ? { "data-typography": "editorial" as const } : {}),
	};
}
