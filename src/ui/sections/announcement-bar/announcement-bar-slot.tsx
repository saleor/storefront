import { cookies } from "next/headers";
import {
	ANNOUNCEMENT_DISMISS_COOKIE,
	isAnnouncementDismissed,
	resolveAnnouncementDismissKey,
} from "@/lib/content/announcement-dismiss-key";
import { AnnouncementBar, type AnnouncementBarProps } from "./announcement-bar";

/**
 * Per-request gate for a dismissible announcement bar. Reading the dismiss cookie makes
 * this dynamic, so render it inside a `<Suspense>` whose fallback is the visible bar (see
 * `main-chrome.tsx`): shoppers who never dismissed see no shift, and a previously dismissed
 * bar is omitted from the streamed HTML instead of flashing in and collapsing on the client.
 */
export async function DismissibleAnnouncementBar(props: AnnouncementBarProps) {
	const dismissKey = resolveAnnouncementDismissKey({
		id: props.id,
		message: props.message,
		href: props.href ?? null,
		linkLabel: props.linkLabel ?? null,
	});

	const cookieStore = await cookies();
	if (isAnnouncementDismissed(cookieStore.get(ANNOUNCEMENT_DISMISS_COOKIE)?.value, dismissKey)) {
		return null;
	}

	return <AnnouncementBar {...props} />;
}
