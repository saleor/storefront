import { Suspense } from "react";
import { Loader } from "@/ui/atoms/loader";
import { SignUpForm } from "@/ui/components/sign-up-form";

export const metadata = {
	title: "Create Account",
	description: "Create a new account to save your addresses and order history.",
};

export default function SignUpPage() {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<SignUpForm />
			</section>
		</Suspense>
	);
}
