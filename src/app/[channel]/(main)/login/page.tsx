import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { AuthForms } from "@/ui/components/AuthForms";
import { Breadcrumb } from "@/ui/components/Breadcrumb";

export const metadata = {
	title: "Sign In | Luxior Mall",
	description: "Sign in to your Luxior Mall account to access your orders, wishlist, and more.",
};

export default function LoginPage() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			<Breadcrumb 
				items={[{ label: "Sign In" }]} 
				className="mb-6"
			/>
			
			<Suspense fallback={<Loader />}>
				<AuthForms />
			</Suspense>
		</section>
	);
}
