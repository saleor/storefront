/**
 * First writer wins for a sessionStorage key. Used so RSC refresh / Strict Mode
 * remounts / Back-forward cache cannot multiply begin_checkout or search.
 *
 * Storage is injectable for tests. Any SecurityError / quota failure is a miss
 * (do not emit) — better to undercount than throw out of a React effect.
 */
export function claimOnce(
	key: string,
	storage: Pick<Storage, "getItem" | "setItem"> | null = defaultSessionStorage(),
): boolean {
	if (!key || !storage) return false;
	try {
		if (storage.getItem(key)) return false;
		storage.setItem(key, "1");
		return true;
	} catch {
		return false;
	}
}

export function claimBeginCheckout(
	checkoutId: string,
	storage: Pick<Storage, "getItem" | "setItem"> | null = defaultSessionStorage(),
): boolean {
	if (!checkoutId) return false;
	return claimOnce(`paper.analytics.checkout_started:${checkoutId}`, storage);
}

export function claimSearchView(
	href: string,
	storage: Pick<Storage, "getItem" | "setItem"> | null = defaultSessionStorage(),
): boolean {
	if (!href) return false;
	return claimOnce(`paper.analytics.search:${href}`, storage);
}

function defaultSessionStorage(): Pick<Storage, "getItem" | "setItem"> | null {
	try {
		if (typeof window === "undefined") return null;
		return window.sessionStorage;
	} catch {
		return null;
	}
}
