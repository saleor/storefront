import "server-only";

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type FixtureMode = "record" | "replay" | "off";

export type SaleorFixture = {
	operationName: string;
	status: number;
	body: unknown;
};

const ROOT = join(process.cwd(), "e2e/fixtures/saleor");

const SECRET_KEYS = new Set([
	"password",
	"oldPassword",
	"newPassword",
	"confirmPassword",
	"token",
	"refreshToken",
	"accessToken",
	"csrfToken",
	"secret",
	"authorization",
]);

export function fixtureMode(raw: string | undefined = process.env.SALEOR_FIXTURES): FixtureMode {
	if (raw === "record" || raw === "replay") return raw;
	return "off";
}

function containsSecret(value: unknown): boolean {
	if (!value || typeof value !== "object") return false;
	if (Array.isArray(value)) return value.some(containsSecret);
	for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
		if (SECRET_KEYS.has(key) || containsSecret(child)) return true;
	}
	return false;
}

/**
 * Text that may identify a public query fixture.
 * Mutations and any body carrying a password or token return null so those
 * bytes are never hashed or written to disk.
 */
function publicQueryIdentity(body: string | undefined): string | null {
	if (!body) return null;
	try {
		const parsed = JSON.parse(body) as { query?: unknown; variables?: unknown };
		if (typeof parsed.query !== "string" || !/^\s*query\b/.test(parsed.query)) return null;
		if (containsSecret(parsed.variables)) return null;
		return `${parsed.query}\n${JSON.stringify(parsed.variables ?? null)}`;
	} catch {
		return null;
	}
}

/** Filename disambiguator. Not a password hash — secrets never reach this. */
function fingerprint(value: string): string {
	let h1 = 0x811c9dc5;
	let h2 = 0x01000193;
	for (let i = 0; i < value.length; i++) {
		const code = value.charCodeAt(i);
		h1 = Math.imul(h1 ^ code, 0x01000193);
		h2 = Math.imul(h2 ^ (code + 1), 0x01000193);
	}
	return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
}

export function fixtureKey(operationName: string, body: string | undefined): string | null {
	const identity = publicQueryIdentity(body);
	if (identity === null) return null;
	return `${operationName}.${fingerprint(`${operationName}\n${identity}`)}.json`;
}

export function readFixture(operationName: string, body: string | undefined): SaleorFixture | null {
	const key = fixtureKey(operationName, body);
	if (!key) return null;
	const path = join(ROOT, key);
	if (!existsSync(path)) return null;
	return JSON.parse(readFileSync(path, "utf8")) as SaleorFixture;
}

export function writeFixture(operationName: string, body: string | undefined, fixture: SaleorFixture): void {
	const key = fixtureKey(operationName, body);
	if (!key) return;
	mkdirSync(ROOT, { recursive: true });
	writeFileSync(join(ROOT, key), JSON.stringify(fixture, null, 2));
}

/**
 * Public queries only. Mutations and session/app calls carry passwords, tokens,
 * and customer payloads — never write those into a fixture file.
 */
export function canRecordFixture(auth: string, requestBody: string | undefined): boolean {
	return auth === "none" && publicQueryIdentity(requestBody) !== null;
}

export type ReplayResult =
	| { status: "off" }
	| { status: "hit"; response: Response }
	| { status: "miss"; message: string };

/** Replay a public fixture. A miss is a result, not a throw, so callers keep the Result path. */
export function takeReplay(operationName: string, body: string | undefined): ReplayResult {
	const mode = fixtureMode();
	if (mode !== "replay") return { status: "off" };
	const key = fixtureKey(operationName, body);
	if (!key) return { status: "off" };

	const fixture = readFixture(operationName, body);
	if (!fixture) {
		return {
			status: "miss",
			message:
				`No fixture for ${operationName}. Record one with SALEOR_FIXTURES=record ` +
				`(e2e/fixtures/saleor/${key}).`,
		};
	}

	return {
		status: "hit",
		response: new Response(JSON.stringify(fixture.body), {
			status: fixture.status,
			headers: { "Content-Type": "application/json", "x-paper-fixture": "replay" },
		}),
	};
}

export async function recordResponse(
	operationName: string,
	requestBody: string | undefined,
	response: Response,
	auth: string,
): Promise<Response> {
	if (fixtureMode() !== "record" || !canRecordFixture(auth, requestBody)) return response;

	const clone = response.clone();
	let body: unknown = null;
	try {
		body = await clone.json();
	} catch {
		body = await clone.text();
	}
	writeFixture(operationName, requestBody, {
		operationName,
		status: response.status,
		body,
	});
	return response;
}
