import "server-only";

import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

/**
 * The confirm step's hidden token: the idempotency key and the time the step was rendered,
 * signed so the form works without JavaScript and nobody can forge an elapsed time. The key is
 * reused on "Try again", so a retry after a lost response returns the original receipt.
 */

const fallbackSecret = randomBytes(32).toString("hex");

function secret(): string {
	return process.env.REVALIDATE_SECRET?.trim() || fallbackSecret;
}

function sign(payload: string): string {
	return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createConfirmToken(now = Date.now(), idempotencyKey: string = randomUUID()): string {
	const payload = `${idempotencyKey}.${now}`;
	return `${payload}.${sign(payload)}`;
}

export function readConfirmToken(
	token: string | null | undefined,
	now = Date.now(),
): { idempotencyKey: string; elapsedMs: number } | null {
	const parts = (token ?? "").split(".");
	if (parts.length !== 3) return null;
	const [idempotencyKey, renderedAt, signature] = parts;
	const expected = Buffer.from(sign(`${idempotencyKey}.${renderedAt}`));
	const given = Buffer.from(signature);
	if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
	const rendered = Number(renderedAt);
	if (!Number.isFinite(rendered) || !/^[0-9a-f-]{36}$/i.test(idempotencyKey)) return null;
	return { idempotencyKey, elapsedMs: Math.max(0, now - rendered) };
}

/**
 * The orders looked up for this flow, signed, so later steps need no second lookup (and no
 * rate-limited call per checkbox). The backend still checks every submit against the order.
 */
export function signSnapshot<T>(value: T): string {
	const payload = Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
	return `${payload}.${sign(payload)}`;
}

export function readSnapshot<T>(token: string | null | undefined): T | null {
	const [payload, signature, extra] = (token ?? "").split(".");
	if (!payload || !signature || extra !== undefined) return null;
	const expected = Buffer.from(sign(payload));
	const given = Buffer.from(signature);
	if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
	try {
		return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
	} catch {
		return null;
	}
}
