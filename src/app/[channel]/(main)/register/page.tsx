import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { RegisterForm } from "@/ui/components/RegisterForm";

type PageProps = {
	params: { channel: string };
};
export default function RegisterPage({ params: { channel } }: PageProps) {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<RegisterForm channel={channel} />
			</section>
		</Suspense>
	);
}
