/** Set before hard navigation after login/logout so header auth refresh skips a redundant router.refresh(). */
export const AUTH_SURFACE_HARD_NAV_KEY = "paper:auth-surface-hard-nav";

export function markAuthSurfaceHardNav(): void {
	try {
		sessionStorage.setItem(AUTH_SURFACE_HARD_NAV_KEY, "1");
	} catch {
		// Private mode / SSR — skip is best-effort.
	}
}

export function consumeAuthSurfaceHardNav(): boolean {
	try {
		if (sessionStorage.getItem(AUTH_SURFACE_HARD_NAV_KEY) !== "1") {
			return false;
		}
		sessionStorage.removeItem(AUTH_SURFACE_HARD_NAV_KEY);
		return true;
	} catch {
		return false;
	}
}
