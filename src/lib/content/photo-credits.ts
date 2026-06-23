import type { HomepagePhotoCredit } from "@/lib/content/types";
import { isSafeExternalHref } from "@/lib/url/safe-href";

function isPhotoCreditShape(value: unknown): value is HomepagePhotoCredit {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const record = value as Record<string, unknown>;
	return typeof record.name === "string" && typeof record.href === "string";
}

function normalizePhotoCredit(value: unknown): HomepagePhotoCredit | null {
	if (!isPhotoCreditShape(value)) {
		return null;
	}

	const name = value.name.trim();
	const href = value.href.trim();
	if (!name || !isSafeExternalHref(href)) {
		return null;
	}

	return { name, href };
}

/** Parse Saleor `photo-credits` JSON (array of `{ name, href }`). */
export function parsePhotoCredits(raw: string | undefined): HomepagePhotoCredit[] | undefined {
	if (!raw?.trim()) {
		return undefined;
	}

	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return undefined;
		}

		const credits = parsed
			.map(normalizePhotoCredit)
			.filter((credit): credit is HomepagePhotoCredit => credit !== null);

		return credits.length > 0 ? credits : undefined;
	} catch {
		return undefined;
	}
}

export function serializePhotoCredits(credits: readonly HomepagePhotoCredit[]): string {
	return JSON.stringify(credits);
}
