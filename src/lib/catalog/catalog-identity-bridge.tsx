"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CatalogIdentity } from "@/lib/catalog/catalog-identity";

type CatalogIdentityContextValue = {
	identity: CatalogIdentity | null;
	setIdentity: (identity: CatalogIdentity | null) => void;
};

const CatalogIdentityContext = createContext<CatalogIdentityContextValue | null>(null);

/**
 * Lives in browse chrome (`StorefrontProviders`) so the footer/header region picker
 * can read the active catalog entity — page content registers via {@link CatalogIdentityBridge}.
 */
export function CatalogIdentityProvider({ children }: { children: ReactNode }) {
	const [identity, setIdentity] = useState<CatalogIdentity | null>(null);
	const value = useMemo(() => ({ identity, setIdentity }), [identity]);

	return <CatalogIdentityContext.Provider value={value}>{children}</CatalogIdentityContext.Provider>;
}

export function useCatalogIdentity(): CatalogIdentity | null {
	return useContext(CatalogIdentityContext)?.identity ?? null;
}

/**
 * Registers the current catalog detail page for locale switching (primary + per-locale slugs).
 * Render once in product/category/collection/page shells.
 */
export function CatalogIdentityBridge({ kind, primarySlug, localeSlugs }: CatalogIdentity) {
	const setIdentity = useContext(CatalogIdentityContext)?.setIdentity;
	const localeSlugsKey = localeSlugs ? JSON.stringify(localeSlugs) : "";

	useEffect(() => {
		if (!setIdentity) return;
		setIdentity({
			kind,
			primarySlug,
			localeSlugs: localeSlugsKey ? (JSON.parse(localeSlugsKey) as Record<string, string>) : undefined,
		});
		return () => setIdentity(null);
	}, [setIdentity, kind, primarySlug, localeSlugsKey]);

	return null;
}
