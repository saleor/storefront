"use client";

import { UserIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { logout } from "@/app/actions";

/**
 * Session cookies exist but `me` could not be loaded — a wedged session
 * (e.g. tokens minted by a previously configured Saleor instance).
 * `router.refresh()` cannot fix it (cookies persist), so clicking clears the
 * broken session server-side and reloads into a clean guest state.
 */
export function UserMenuUnavailable() {
	const t = useTranslations("nav.userMenu");
	const [isClearing, setIsClearing] = useState(false);

	return (
		<button
			type="button"
			disabled={isClearing}
			onClick={async () => {
				setIsClearing(true);
				try {
					await logout();
				} catch {
					// Cookie clear is best-effort; the reload re-evaluates session state regardless.
				}
				window.location.reload();
			}}
			className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
			title={t("unavailableTitle")}
			aria-label={t("unavailableAriaLabel")}
		>
			<UserIcon className="h-5 w-5" aria-hidden="true" />
		</button>
	);
}
