import { cookies } from "next/headers";
import {
	ANNOUNCEMENT_DISMISS_COOKIE,
	isAnnouncementDismissed,
	resolveAnnouncementDismissKey,
} from "@/lib/content/announcement-dismiss-key";
import { AnnouncementBar, type AnnouncementBarProps } from "./announcement-bar";

/**
 * Per-request gate for a dismissible announcement bar. Reading the dismiss cookie makes
 * this dynamic — render inside `<Suspense>` in `main-chrome.tsx` so `cookies()` does not
 * block the layout shell. The fallback is the visible bar (no shift for shoppers who never
 * dismissed); shoppers who already closed it may see a brief flash until this resolves.
 */
export async function DismissibleAnnouncementBar(props: AnnouncementBarProps) {
	if (!props.message.trim()) {
		return null;
	}

	if (!props.dismissible) {
		return <AnnouncementBar {...props} />;
	}

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
