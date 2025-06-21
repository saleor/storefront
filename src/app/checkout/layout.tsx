import { type ReactNode } from "react";
import { AuthProvider } from "@/ui/components/AuthProvider";
import { ReactQueryProvider } from "@/checkout/providers/ReactQueryProvider";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<main>
			<AuthProvider>
				<ReactQueryProvider>{props.children}</ReactQueryProvider>
			</AuthProvider>
		</main>
	);
}
