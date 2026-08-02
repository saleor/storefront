"use client";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ErrorContent, type ErrorContentProps } from "@/ui/components/error-content";

/**
 * Catches errors thrown in the root layouts themselves. Because it replaces the crashed
 * root, it must render its own `<html>`/`<body>`.
 */
export default function GlobalError({ error, reset }: ErrorContentProps) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh`}>
			<body className="min-h-dvh font-sans">
				<ErrorContent error={error} reset={reset} />
			</body>
		</html>
	);
}
