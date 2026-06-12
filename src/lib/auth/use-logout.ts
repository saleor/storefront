"use client";

import { useCallback } from "react";

import { logout } from "@/app/actions";

export type LogoutOptions = {
	channel?: string;
	/** Override post-logout destination. Defaults to `/${channel}` or `/`. */
	redirectTo?: string;
	/** Reload the current URL (e.g. checkout in-flow sign-out). */
	stayOnPage?: boolean;
};

/** End Saleor session on the server and hard-navigate to bust Router Cache. */
export function useLogout() {
	return useCallback(async (options?: LogoutOptions) => {
		try {
			await logout();
		} catch {
			// Checkout detach / server cookie clear is best-effort.
		}

		if (options?.stayOnPage) {
			window.location.reload();
			return;
		}

		const target = options?.redirectTo ?? (options?.channel ? `/${options.channel}` : "/");
		window.location.assign(target);
	}, []);
}
