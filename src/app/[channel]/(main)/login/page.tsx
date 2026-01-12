import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { LoginForm } from "@/ui/components/LoginForm";

export const metadata = {
	title: "Sign In",
	description: "Sign in to your account to access your orders and saved addresses.",
};

export default function LoginPage() {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<LoginForm />
			</section>
		</Suspense>
	);
}
