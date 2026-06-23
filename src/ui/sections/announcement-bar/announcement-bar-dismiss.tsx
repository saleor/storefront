"use client";

import { X } from "lucide-react";
import { formatAnnouncementDismissCookie } from "@/lib/content/announcement-dismiss-key";

/**
 * X button for the dismissible announcement bar. The bar is server-rendered; on dismiss
 * this island writes a cookie so the server can omit the bar from the initial HTML on the
 * next load (no flash, no inline script — see `announcement-bar-slot.tsx`), then hides the
 * bar live for the current view. Hiding is driven by the `data-announcement-dismissed`
 * attribute + CSS (see `brand.css`) rather than a React unmount, so the chrome height token
 * collapses to 0 with no layout shift.
 */
export function AnnouncementDismissButton({ dismissKey }: { dismissKey: string }) {
	const handleDismiss = () => {
		document.cookie = formatAnnouncementDismissCookie(dismissKey);
		const root = document.documentElement;
		root.setAttribute("data-announcement-dismissed", "");
		root.style.setProperty("--announcement-bar-height", "0px");
	};

	return (
		<button
			type="button"
			onClick={handleDismiss}
			className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-background/80 transition-colors hover:bg-background/10 hover:text-background"
			aria-label="Dismiss announcement"
		>
			<X className="h-4 w-4" aria-hidden="true" />
		</button>
	);
}
