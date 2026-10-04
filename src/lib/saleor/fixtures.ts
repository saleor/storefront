import "server-only";

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type FixtureMode = "record" | "replay" | "off";

export type SaleorFixture = {
	operationName: string;
	status: number;
	body: unknown;
};

const ROOT = join(process.cwd(), "e2e/fixtures/saleor");

export function fixtureMode(raw: string | undefined = process.env.SALEOR_FIXTURES): FixtureMode {
	if (raw === "record" || raw === "replay") return raw;
	return "off";
}

export function fixtureKey(operationName: string, body: string | undefined): string {
	const hash = createHash("sha256")
		.update(`${operationName}\n${body ?? ""}`)
		.digest("hex")
		.slice(0, 16);
	return `${operationName}.${hash}.json`;
}

export function readFixture(operationName: string, body: string | undefined): SaleorFixture | null {
	const path = join(ROOT, fixtureKey(operationName, body));
	if (!existsSync(path)) return null;
	return JSON.parse(readFileSync(path, "utf8")) as SaleorFixture;
}

export function writeFixture(operationName: string, body: string | undefined, fixture: SaleorFixture): void {
	mkdirSync(ROOT, { recursive: true });
	writeFileSync(join(ROOT, fixtureKey(operationName, body)), JSON.stringify(fixture, null, 2));
}

/**
 * Public queries only. Mutations and session/app calls carry passwords, tokens,
 * and customer payloads — never write those into a fixture file.
 */
export function canRecordFixture(auth: string, requestBody: string | undefined): boolean {
	if (auth !== "none" || !requestBody) return false;
	try {
		const parsed = JSON.parse(requestBody) as { query?: string };
		return typeof parsed.query === "string" && /^\s*query\b/.test(parsed.query);
	} catch {
		return false;
	}
}

export type ReplayResult =
	| { status: "off" }
	| { status: "hit"; response: Response }
	| { status: "miss"; message: string };

/** Replay a public fixture. A miss is a result, not a throw, so callers keep the Result path. */
export function takeReplay(operationName: string, body: string | undefined): ReplayResult {
	const mode = fixtureMode();
	if (mode !== "replay") return { status: "off" };

	const fixture = readFixture(operationName, body);
	if (!fixture) {
		return {
			status: "miss",
			message:
				`No fixture for ${operationName}. Record one with SALEOR_FIXTURES=record ` +
				`(e2e/fixtures/saleor/${fixtureKey(operationName, body)}).`,
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
