"use client";
import { gql, useQuery } from "@apollo/client";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import Link from "next/link";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";

export function AccountLink() {
	const { signOut } = useSaleorAuthContext();
	const { data } = useQuery<CurrentUserQuery>(gql(CurrentUserDocument.toString()));

	return data?.me ? (
		<button onClick={() => signOut()} className="text-sm font-medium ">
			Log out
		</button>
	) : (
		<Link href="/login" className="text-sm font-medium ">
			Log in
		</Link>
	);
}
