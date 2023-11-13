"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { useQuery } from "urql";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";

export function AccountLink() {
	const [{ data }] = useQuery<CurrentUserQuery>({
		query: CurrentUserDocument.toString(),
	});

	const isLoggedIn = data && data.me;

	if (isLoggedIn) {
		return (
			<Link href="/orders" className="h-8 w-8 flex-shrink-0">
				<Image
					className="h-8 w-8 rounded-full border"
					aria-hidden="true"
					src={data.me?.avatar?.url || ""}
					width={24}
					height={24}
					alt=""
				/>
				<span className="sr-only">Orders</span>
			</Link>
		);
	} else {
		return (
			<Link href="/login" className="h-6 w-6 flex-shrink-0">
				<UserIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
				<span className="sr-only">Log in</span>
			</Link>
		);
	}
}
