import { UserIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

import { getHeaderUser } from "@/lib/auth/get-header-user";

import { UserMenu } from "./user-menu";

export async function UserMenuServer({ channel }: { channel: string }) {
	// Request-dynamic under PPR — never serve a prerendered anonymous menu when cookies exist.
	await cookies();

	const user = await getHeaderUser();

	if (user) {
		return <UserMenu user={user} />;
	}

	return (
		<Link
			href={`/${channel}/login`}
			className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
		>
			<UserIcon className="h-5 w-5" aria-hidden="true" />
			<span className="sr-only">Log in</span>
		</Link>
	);
}
