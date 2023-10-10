import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/ui/components/AuthProvider";

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
					<div className="min-h-[calc(100vh-106px)] flex-grow">{props.children}</div>
					{props.modal}
				</AuthProvider>
			</body>
		</html>
	);
}
