import { type ReactNode, Suspense } from "react";
import { AuthProvider } from "@/ui/components/AuthProvider";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<main>
			<Suspense
				fallback={
					<div className="flex min-h-screen items-center justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-500 border-t-transparent" />
					</div>
				}
			>
				<AuthProvider>{props.children}</AuthProvider>
			</Suspense>
		</main>
	);
}
