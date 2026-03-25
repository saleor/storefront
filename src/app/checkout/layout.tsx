import { type ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { brandConfig, formatPageTitle } from "@/config/brand";

export const metadata = {
	title: formatPageTitle("Checkout"),
	description: brandConfig.description,
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<main className="min-h-screen bg-neutral-950">
			<AuthProvider>{props.children}</AuthProvider>
		</main>
	);
}
