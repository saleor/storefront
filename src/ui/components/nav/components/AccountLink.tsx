import React from "react";
import Link from "next/link";
import { UserIcon } from "lucide-react";

export function AccountLink() {
	return (
		<Link href="/login" className="h-6 w-6 flex-shrink-0">
			<UserIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
			<span className="sr-only">Log in</span>
		</Link>
	);
}
