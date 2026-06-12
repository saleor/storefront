import { UserIcon } from "lucide-react";
import Link from "next/link";

export function UserMenuLoginLink({ channel }: { channel: string }) {
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
