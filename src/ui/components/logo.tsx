import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { Logo as SharedLogo } from "./shared/logo";

/**
 * Site logo with link to homepage.
 * Always renders as a link - no client-side pathname detection needed.
 */
export const Logo = () => {
	return (
		<LinkWithChannel href="/" prefetch={true} className="flex shrink-0 items-center" aria-label="Homepage">
			<SharedLogo className="h-7 w-auto" />
		</LinkWithChannel>
	);
};
