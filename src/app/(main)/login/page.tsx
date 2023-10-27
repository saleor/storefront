"use client";

import { gql, useQuery } from "urql";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { LoginForm } from "@/ui/components/LoginForm";
import { Loader } from "@/ui/atoms/Loader";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";
import { UserCard } from "@/ui/components/UserCard";

export default function LoginPage() {
	const { signOut } = useSaleorAuthContext();

	const [{ data, fetching }] = useQuery<CurrentUserQuery>({
		query: gql(CurrentUserDocument.toString()),
	});

	if (fetching) {
		return <Loader />;
	}

	return (
		<section className="mx-auto max-w-7xl p-8">
			{data?.me ? (
				<>
					<UserCard email={data.me.email} avatarURL={data.me.avatar?.url || ""} />
					<button
						onClick={() => signOut()}
						className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
						type="button"
					>
						Log Out
					</button>
				</>
			) : (
				<LoginForm />
			)}
		</section>
	);
}
