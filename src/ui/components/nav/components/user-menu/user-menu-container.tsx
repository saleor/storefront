import { UserIcon } from "lucide-react";
import { UserMenu } from "./user-menu";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

export async function UserMenuContainer() {
	// Try to get current user - handle auth errors gracefully (expired token = not logged in)
	let user = null;
	try {
		const result = await executeGraphQL(CurrentUserDocument, {
			cache: "no-cache",
		});
		user = result.me;
	} catch {
		// Auth failed (expired signature, etc.) - treat as not logged in
	}

	if (user) {
		return <UserMenu user={user} />;
	} else {
		return (
			<LinkWithChannel
				href="/login"
				className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
			>
				<UserIcon className="h-5 w-5" aria-hidden="true" />
				<span className="sr-only">Log in</span>
			</LinkWithChannel>
		);
	}
}
