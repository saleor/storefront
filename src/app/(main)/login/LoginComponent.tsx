"use client";

import { useQuery } from "urql";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import Link from "next/link";
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
			<div className="mt-4 flex space-x-2">
				<Link href="/orders" className="h-full rounded bg-neutral-100 px-4 py-2 hover:bg-neutral-200">
					My orders
				</Link>
				<button
					onClick={() => signOut()}
					className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
					type="button"
				>
					Log Out
				</button>
			</div>
		</>
	) : (
		<LoginForm />
	);
};
