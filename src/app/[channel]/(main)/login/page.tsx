import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { LoginForm } from "@/ui/components/LoginForm";

interface LoginPageProps {
	params: Promise<{ channel: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
	const { channel } = await params;

	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<LoginForm channel={channel} />
			</section>
		</Suspense>
	);
}
