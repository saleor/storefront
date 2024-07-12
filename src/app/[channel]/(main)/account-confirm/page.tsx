import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Loader } from "@/ui/atoms/Loader";
import { emailConfirmation } from "@/app/actions";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

type PageProps = {
	params: {
		channel: string;
	};
	searchParams: {
		email: string;
		token: string;
	};
};

export default async function EmailConfirmation({ searchParams: { email, token } }: PageProps) {
	const { confirmAccount } = await emailConfirmation(email, token);

	if (confirmAccount && confirmAccount?.errors.length > 0) {
		return redirect("/error");
	}
	if (confirmAccount && confirmAccount.user?.isConfirmed) {
	}
	return (
		<Suspense fallback={<Loader />}>
			<section className="flex h-screen items-center justify-center bg-gray-100">
				<div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
					<div className="mb-6 flex justify-center">
						<svg
							className="h-16 w-16 text-green-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m0 4v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h2"
							/>
						</svg>
					</div>
					<h1 className="mb-4 text-2xl font-bold text-gray-800">Email Confirmed!</h1>
					<p className="mb-6 text-gray-600">
						Thank you for confirming your email address. Your account has been successfully activated.
					</p>

					<LinkWithChannel
						href={`/login`}
						className="inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
					>
						Go to Login
					</LinkWithChannel>
				</div>
			</section>
		</Suspense>
	);
}
