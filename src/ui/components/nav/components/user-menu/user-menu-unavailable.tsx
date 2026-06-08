import { UserIcon } from "lucide-react";

/** Session cookies exist but `me` could not be loaded — not the same as signed out. */
export function UserMenuUnavailable() {
	return (
		<div
			className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground"
			title="Couldn't load account"
			aria-label="Account unavailable"
		>
			<UserIcon className="h-5 w-5" aria-hidden="true" />
		</div>
	);
}
