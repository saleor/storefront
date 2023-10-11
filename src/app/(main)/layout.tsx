import { type ReactNode } from "react";
import { Footer } from "@/ui/components/Footer";
import { Nav } from "@/ui/components/Nav";
import { Topbar } from "@/ui/components/Topbar";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<>
			<Topbar />
			<Nav />
			<div className="min-h-[calc(100vh-106px)] flex-grow">{props.children}</div>
			<Footer />
		</>
	);
}
