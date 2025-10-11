import { type ReactNode } from "react";
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
				<Footer channel={channel} />
			</div>
		</>
	);
}
