"use client";

import React from "react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { gql, useQuery } from "@apollo/client";
import { LoginForm } from "@/ui/components/LoginForm";
import { Loader } from "@/ui/atoms/Loader";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";
import { UserCard } from "@/ui/components/UserCard";

export default function LoginPage() {
	const { signOut } = useSaleorAuthContext();

	const { data, loading } = useQuery<CurrentUserQuery>(gql(CurrentUserDocument.toString()));

	if (loading) {
		return <Loader />;
	}

	return (
		<section className="mx-auto max-w-7xl p-8">
			{data?.me ? (
				<>
					<UserCard email={data.me.email} avatarURL={data.me.avatar?.url || ""} />
					<button
						onClick={() => signOut()}
						className="rounded bg-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-700"
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
