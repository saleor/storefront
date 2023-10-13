import { Inter } from "next/font/google";
import "./globals.css";
import { type ReactNode } from "react";
import { AuthProvider } from "@/ui/components/AuthProvider";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} flex min-h-screen flex-col`}>
				<AuthProvider>{props.children}</AuthProvider>
				<DraftModeNotification />
			</body>
		</html>
	);
}
