import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Loader } from "@/ui/atoms/Loader";
import { LoginForm } from "@/ui/components/LoginForm";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";

type PageProps = {
	params: {
		channel: string;
	};
};
export default async function LoginPage({ params: { channel } }: PageProps) {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});
	if (user) redirect(`/${channel}`);

	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<LoginForm />
			</section>
		</Suspense>
	);
}
