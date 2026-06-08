"use client";

import type { useRouter } from "next/navigation";

import { revalidateStorefrontChromeAction } from "@/app/actions";

type Router = ReturnType<typeof useRouter>;

export type SyncAuthSurfacesAfterSignInOptions = {
	/** Full navigation after cache bust — reliable once BFF Set-Cookie has landed. */
	redirectTo?: string;
	/** Skip router.refresh() when client UI must stay mounted (e.g. password-reset success screen). */
	skipRefresh?: boolean;
};

/** Bust cached auth UI and refresh RSC after BFF sign-in (cookies already set by the API route). */
export async function syncAuthSurfacesAfterSignIn(
	channel: string,
	router: Router,
	options?: SyncAuthSurfacesAfterSignInOptions,
): Promise<void> {
	if (!channel) {
		throw new Error("syncAuthSurfacesAfterSignIn requires a channel slug");
	}

	await revalidateStorefrontChromeAction(channel);

	if (options?.redirectTo) {
		// Hard navigation: avoids router.refresh() racing on the login page and guarantees
		// cookies + invalidated layout are picked up on the destination.
		window.location.assign(options.redirectTo);
		return;
	}

	if (!options?.skipRefresh) {
		router.refresh();
	}
}

/**
 * Hard navigation to storefront home.
 * Use after checkout (or any `/checkout` surface) so the header picks up HttpOnly session cookies —
 * soft `router.push` can restore a cached anonymous `UserMenuServer` shell.
 */
export function navigateToStorefrontHome(channel: string) {
	window.location.assign(channel ? `/${channel}` : "/");
}
