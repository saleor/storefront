"use client";
import { gql, useQuery } from "@apollo/client";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";

export function Topbar() {
	const { signOut } = useSaleorAuthContext();
	const { data } = useQuery<CurrentUserQuery>(gql(CurrentUserDocument.toString()));

	return (
		<div className="border-b border-neutral-100 bg-neutral-800">
			<div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div></div>
				<div className="flex items-center text-center text-sm font-medium text-neutral-50 hover:text-neutral-300">
					<StarIcon className="mr-2 h-4 text-yellow-300" />
					<Link href="https://github.com/saleor/storefront" target="_blank">
						Star our Storefront Example on GitHub
					</Link>
				</div>

				<div className="flex flex-1 items-center justify-end">
					{data?.me ? (
						<button
							onClick={() => signOut()}
							className="text-sm font-medium text-white hover:text-neutral-300"
						>
							Logout
						</button>
					) : (
						<Link href="/login" className="text-sm font-medium text-white hover:text-neutral-300">
							Login
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
