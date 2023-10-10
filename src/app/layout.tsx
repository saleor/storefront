import { Inter } from "next/font/google";
import { Footer } from "@/ui/components/Footer";
import { Nav } from "@/ui/components/Nav";
import "./globals.css";
import { AuthProvider } from "@/ui/components/AuthProvider";
import { Topbar } from "@/ui/components/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default function RootLayout(props: { children: React.ReactNode; modal: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} flex min-h-screen flex-col`}>
				<AuthProvider>
					<Topbar />
					<Nav />
					<div className="min-h-[calc(100vh-106px)] flex-grow">{props.children}</div>
					<Footer />
					{props.modal}
				</AuthProvider>
			</body>
		</html>
	);
}
