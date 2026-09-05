import { timingSafeEqual } from "crypto";

export function normalizeOrderEmail(value: string): string {
	return value.trim().toLowerCase();
}

/**
 * Constant-time-ish compare. Always hashes both sides to the same length so a miss
 * does not confirm that the order exists.
 */
export function emailsMatch(stored: string | null | undefined, submitted: string): boolean {
	const left = Buffer.from(normalizeOrderEmail(stored ?? "\0"), "utf8");
	const right = Buffer.from(normalizeOrderEmail(submitted), "utf8");
	const size = Math.max(left.length, right.length, 1);
	const a = Buffer.alloc(size);
	const b = Buffer.alloc(size);
	left.copy(a);
	right.copy(b);
	const equalBytes = timingSafeEqual(a, b);
	const equalLength = left.length === right.length;
	return Boolean(stored) && equalBytes && equalLength;
}
