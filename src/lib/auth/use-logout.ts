"use client";

import { useCallback } from "react";

import { logout } from "@/app/actions";
import { markAuthSurfaceHardNav } from "@/lib/auth/auth-surface-nav";
import { resolveBrowseLocaleSlugWithFallback } from "@/lib/browse-locale";
import { buildStorefrontPath } from "@/lib/storefront-path";

export type LogoutOptions = {
	locale?: string;
	channel?: string;
	/** Override post-logout destination. Defaults to canonical browse home or `/`. */
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
			markAuthSurfaceHardNav();
			window.location.reload();
			return;
		}

		if (options?.redirectTo) {
			window.location.assign(options.redirectTo);
			return;
		}

		if (options?.channel) {
			const locale = resolveBrowseLocaleSlugWithFallback(options.locale);
			window.location.assign(buildStorefrontPath(locale, options.channel));
			return;
		}

		window.location.assign("/");
	}, []);
}
