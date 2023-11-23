import { Suspense } from "react";
import { LoginComponent } from "./LoginComponent";
import { Loader } from "@/ui/atoms/Loader";

export default function LoginPage() {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<LoginComponent />
			</section>
		</Suspense>
	);
}
