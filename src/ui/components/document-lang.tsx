"use client";

import { useEffect } from "react";

/** Sync `<html lang>` with the browse URL locale segment. */
export function DocumentLang({ lang }: { lang: string }) {
	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);

	return null;
}
