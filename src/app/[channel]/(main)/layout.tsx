import { type ReactNode, Suspense } from "react";
import { Footer } from "@/ui/components/Footer";
import { Header } from "@/ui/components/Header";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default async function RootLayout(props: {
	children: ReactNode;
	params: Promise<{ channel: string }>;
}) {
	const channel = (await props.params).channel;

	return (
		<>
			<Header channel={channel} />
			<div className="flex min-h-[calc(100dvh-5rem)] flex-col">
				<main id="main-content" className="flex-1" role="main">
					{props.children}
				</main>
				<Suspense
					fallback={
						<footer className="mt-24 border-t border-base-900 bg-base-950">
							<div className="mx-auto max-w-7xl px-6 lg:px-12">
								<div className="grid grid-cols-1 gap-12 py-20 md:grid-cols-3 md:gap-16">
									<div className="h-32 animate-pulse rounded bg-base-800" />
									<div className="h-32 animate-pulse rounded bg-base-800" />
									<div className="h-32 animate-pulse rounded bg-base-800" />
								</div>
							</div>
						</footer>
					}
				>
					<Footer channel={channel} />
				</Suspense>
			</div>
		</>
	);
}
