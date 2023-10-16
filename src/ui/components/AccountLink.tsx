import React from "react";
import Link from "next/link";
import { UserIcon } from "@/checkout/ui-kit/icons/User";

export function AccountLink() {
	return (
		<Link href="/login" className="h-6 w-6 flex-shrink-0">
			<UserIcon />
		</Link>
	);
}
