"use client";

import Link from "next/link";
import { UserIcon } from "lucide-react";
import { useQuery } from "urql";
import { UserMenu } from "./UserMenu";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";

export function AccountLink() {
	const [{ data }] = useQuery<CurrentUserQuery>({
		query: CurrentUserDocument.toString(),
	});

	if (data && data.me) {
		return <UserMenu user={data.me} />;
	} else {
		return (
			<Link href="/login" className="h-6 w-6 flex-shrink-0">
				<UserIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
				<span className="sr-only">Log in</span>
			</Link>
		);
	}
}
