import { AuthProvider } from "@/ui/components/AuthProvider";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default function RootLayout(props: { children: React.ReactNode; modal: React.ReactNode }) {
	return (
		<AuthProvider>
			<div className="min-h-[calc(100vh-106px)] flex-grow">{props.children}</div>
			{props.modal}
		</AuthProvider>
	);
}
