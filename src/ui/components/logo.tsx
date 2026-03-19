import { LinkWithChannel } from "../atoms/link-with-channel";
import { Logo as SharedLogo } from "./shared/logo";

/**
 * Site logo with link to homepage.
 * Always renders as a link - no client-side pathname detection needed.
 */
export const Logo = ({ className }: { className?: string }) => {
	return (
		<LinkWithChannel href="/" className="flex shrink-0 items-center" aria-label="Homepage">
			<SharedLogo className={className ?? "h-9 w-auto"} />
		</LinkWithChannel>
	);
};
