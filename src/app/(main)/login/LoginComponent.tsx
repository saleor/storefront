"use client";

import { useQuery } from "urql";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";
import { LoginForm } from "@/ui/components/LoginForm";
import { UserCard } from "@/ui/components/UserCard";

export const LoginComponent = () => {
	const { signOut } = useSaleorAuthContext();

	const [{ data }] = useQuery<CurrentUserQuery>({
		query: CurrentUserDocument.toString(),
	});

	return data?.me ? (
		<>
			<UserCard user={data.me} />
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
	);
};
