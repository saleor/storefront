"use client";

import { X } from "lucide-react";

/**
 * X button for the dismissible announcement bar. The bar itself is server-rendered;
 * this island only persists the dismissal and applies it live. Hiding is driven by
 * the `data-announcement-dismissed` attribute + CSS (see `brand.css`) rather than a
 * React unmount, so it matches the pre-paint no-flash guard exactly — no flicker,
 * no layout shift, and the chrome height token collapses to 0 in the same frame.
 */
export function AnnouncementDismissButton({ dismissKey }: { dismissKey: string }) {
	const handleDismiss = () => {
		try {
			window.localStorage.setItem(dismissKey, "1");
		} catch {
			// Ignore storage failures (private mode / quota) — UI still hides below.
		}
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
